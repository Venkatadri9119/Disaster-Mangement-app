import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, CitizenProfile, VolunteerProfile
from app.core.security import generate_otp, verify_otp, create_access_token

router = APIRouter()

class OTPRequest(BaseModel):
    phone: str = Field(..., example="+919876543210")

class OTPVerify(BaseModel):
    phone: str
    code: str
    name: str = "Citizen User"
    role: str = "CITIZEN" # CITIZEN, VOLUNTEER, ADMIN
    preferred_language: str = "en"

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str
    preferred_language: str

@router.post("/request-otp")
def request_otp(data: OTPRequest):
    code = generate_otp(data.phone)
    return {"message": "OTP sent successfully", "phone": data.phone, "demo_otp": code}

@router.post("/verify-otp", response_model=AuthTokenResponse)
def verify_otp_endpoint(data: OTPVerify, db: Session = Depends(get_db)):
    if not verify_otp(data.phone, data.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP code")

    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            phone=data.phone,
            name=data.name,
            role=data.role,
            preferred_language=data.preferred_language
        )
        db.add(user)
        db.flush()

        if data.role == "CITIZEN":
            cp = CitizenProfile(user_id=user.id)
            db.add(cp)
        elif data.role == "VOLUNTEER":
            vp = VolunteerProfile(user_id=user.id, availability_status="AVAILABLE")
            db.add(vp)
            
        db.commit()

    token = create_access_token(subject=user.id, role=user.role)
    return AuthTokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        role=user.role,
        preferred_language=user.preferred_language
    )
