from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, CitizenProfile, VolunteerProfile
from app.api.deps import get_current_user

router = APIRouter()

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile_data = {}
    if current_user.role == "CITIZEN" and current_user.citizen_profile:
        profile_data = {
            "emergency_contact": current_user.citizen_profile.emergency_contact,
            "latitude": current_user.citizen_profile.latitude,
            "longitude": current_user.citizen_profile.longitude
        }
    elif current_user.role == "VOLUNTEER" and current_user.volunteer_profile:
        profile_data = {
            "skills": current_user.volunteer_profile.skills,
            "availability_status": current_user.volunteer_profile.availability_status,
            "latitude": current_user.volunteer_profile.latitude,
            "longitude": current_user.volunteer_profile.longitude,
            "medical_certified": current_user.volunteer_profile.medical_certified,
            "workload_count": current_user.volunteer_profile.workload_count
        }

    return {
        "id": current_user.id,
        "name": current_user.name,
        "phone": current_user.phone,
        "email": current_user.email,
        "role": current_user.role,
        "preferred_language": current_user.preferred_language,
        "profile": profile_data
    }

@router.post("/me/location")
def update_user_location(data: LocationUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "CITIZEN":
        if not current_user.citizen_profile:
            cp = CitizenProfile(user_id=current_user.id, latitude=data.latitude, longitude=data.longitude)
            db.add(cp)
        else:
            current_user.citizen_profile.latitude = data.latitude
            current_user.citizen_profile.longitude = data.longitude
    elif current_user.role == "VOLUNTEER":
        if not current_user.volunteer_profile:
            vp = VolunteerProfile(user_id=current_user.id, latitude=data.latitude, longitude=data.longitude)
            db.add(vp)
        else:
            current_user.volunteer_profile.latitude = data.latitude
            current_user.volunteer_profile.longitude = data.longitude
            
    db.commit()
    return {"status": "success", "latitude": data.latitude, "longitude": data.longitude}
