import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import EmergencyRequest, User, RequestAssignment, AuditLog
from app.api.deps import get_current_user
from app.ai.tools import AIToolExecutor
from app.ai.duplicate_detector import DuplicateDetector

router = APIRouter()

class CreateEmergencyPayload(BaseModel):
    disaster_type: str
    people_count: int = 1
    medical_need: bool = False
    missing_person: bool = False
    evacuation_required: bool = False
    latitude: float
    longitude: float
    address_text: Optional[str] = None
    photo_url: Optional[str] = None

class AssignVolunteerPayload(BaseModel):
    volunteer_id: str

class UpdatePriorityPayload(BaseModel):
    priority: str # CRITICAL, HIGH, NORMAL
    reason: str = "Admin manual override"

@router.post("")
def create_emergency(payload: CreateEmergencyPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check for potential duplicates/fraud
    recent = db.query(EmergencyRequest).filter(EmergencyRequest.status != "RESOLVED").all()
    rec_list = [{"id": r.id, "latitude": r.latitude, "longitude": r.longitude, "disaster_type": r.disaster_type} for r in recent]
    is_dup, reason = DuplicateDetector.check_duplicate(payload.latitude, payload.longitude, payload.disaster_type, rec_list)

    executor = AIToolExecutor(db, current_user.id)
    res = executor.create_emergency_request(
        disaster_type=payload.disaster_type,
        people_count=payload.people_count,
        medical_need=payload.medical_need,
        missing_person=payload.missing_person,
        evacuation_required=payload.evacuation_required,
        latitude=payload.latitude,
        longitude=payload.longitude,
        address_text=payload.address_text
    )

    req_id = res.get("request_id")
    if is_dup and req_id:
        req = db.query(EmergencyRequest).filter(EmergencyRequest.id == req_id).first()
        if req:
            req.flagged_fraud = True
            req.fraud_reason = reason
            db.commit()

    return res

@router.get("")
def list_emergencies(priority: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(EmergencyRequest)
    if priority:
        query = query.filter(EmergencyRequest.priority == priority)
    if status:
        query = query.filter(EmergencyRequest.status == status)
    
    requests = query.order_by(EmergencyRequest.created_at.desc()).all()
    results = []
    for r in requests:
        citizen = db.query(User).filter(User.id == r.citizen_id).first()
        results.append({
            "id": r.id,
            "citizen_name": citizen.name if citizen else "Citizen",
            "citizen_phone": citizen.phone if citizen else "",
            "disaster_type": r.disaster_type,
            "people_count": r.people_count,
            "medical_need": r.medical_need,
            "missing_person": r.missing_person,
            "evacuation_required": r.evacuation_required,
            "priority": r.priority,
            "status": r.status,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "address_text": r.address_text,
            "flagged_fraud": r.flagged_fraud,
            "fraud_reason": r.fraud_reason,
            "created_at": r.created_at.isoformat()
        })
    return results

@router.get("/{id}")
def get_emergency_detail(id: str, db: Session = Depends(get_db)):
    executor = AIToolExecutor(db, "system")
    return executor.get_request_status(id)

@router.post("/{id}/assign")
def assign_volunteer_to_emergency(id: str, payload: AssignVolunteerPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    executor = AIToolExecutor(db, current_user.id)
    return executor.assign_volunteer(id, payload.volunteer_id)

@router.patch("/{id}/priority")
def override_priority(id: str, payload: UpdatePriorityPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    old_prio = req.priority
    req.priority = payload.priority
    req.updated_at = datetime.datetime.utcnow()
    
    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        action="ADMIN_PRIORITY_OVERRIDE",
        target_type="emergency_requests",
        target_id=req.id,
        details={"old_priority": old_prio, "new_priority": payload.priority, "reason": payload.reason}
    )
    db.add(audit)
    db.commit()

    return {"status": "success", "id": req.id, "old_priority": old_prio, "new_priority": req.priority}

@router.post("/{id}/status")
def update_status(id: str, status_str: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = status_str
    db.commit()
    return {"status": "success", "id": req.id, "new_status": req.status}
