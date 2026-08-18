from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, VolunteerProfile, EmergencyRequest
from app.api.deps import get_current_user
from app.ai.matching_engine import HybridMatchingEngine

router = APIRouter()

class AvailabilityPayload(BaseModel):
    availability_status: str # AVAILABLE, UNAVAILABLE, ON_MISSION

@router.get("/nearby")
def get_nearby_volunteers(latitude: float = 16.5062, longitude: float = 80.6480, radius_km: float = 15.0, db: Session = Depends(get_db)):
    volunteers = db.query(VolunteerProfile).all()
    results = []
    for vp in volunteers:
        user = db.query(User).filter(User.id == vp.user_id).first()
        if not user:
            continue
        dist = HybridMatchingEngine.haversine_distance_km(latitude, longitude, vp.latitude or 16.5062, vp.longitude or 80.6480)
        if dist <= radius_km:
            results.append({
                "user_id": vp.user_id,
                "name": user.name,
                "phone": user.phone,
                "skills": vp.skills,
                "availability_status": vp.availability_status,
                "latitude": vp.latitude,
                "longitude": vp.longitude,
                "distance_km": round(dist, 2),
                "medical_certified": vp.medical_certified,
                "workload_count": vp.workload_count
            })
    return results

@router.patch("/availability")
def update_availability(payload: AvailabilityPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.volunteer_profile:
        vp = VolunteerProfile(user_id=current_user.id, availability_status=payload.availability_status)
        db.add(vp)
    else:
        current_user.volunteer_profile.availability_status = payload.availability_status
    db.commit()
    return {"status": "success", "availability_status": payload.availability_status}

@router.get("/recommended-requests")
def get_recommended_requests_for_volunteer(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vp = current_user.volunteer_profile
    v_lat = vp.latitude if vp and vp.latitude else 16.5062
    v_lon = vp.longitude if vp and vp.longitude else 80.6480
    v_skills = vp.skills if vp and vp.skills else ["flood_rescue"]
    v_med = vp.medical_certified if vp else False

    emergencies = db.query(EmergencyRequest).filter(EmergencyRequest.status.in_(["SUBMITTED", "AI_PRIORITIZED"])).all()
    results = []
    for req in emergencies:
        score, breakdown = HybridMatchingEngine.score_volunteer(
            req_lat=req.latitude,
            req_lon=req.longitude,
            disaster_type=req.disaster_type,
            medical_need=req.medical_need,
            vol_lat=v_lat,
            vol_lon=v_lon,
            vol_skills=v_skills,
            vol_availability="AVAILABLE",
            vol_medical=v_med,
            vol_workload=vp.workload_count if vp else 0
        )
        dist = breakdown["distance_km"]
        results.append({
            "id": req.id,
            "disaster_type": req.disaster_type,
            "people_count": req.people_count,
            "medical_need": req.medical_need,
            "evacuation_required": req.evacuation_required,
            "priority": req.priority,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "address_text": req.address_text,
            "distance_km": dist,
            "match_score": score,
            "score_breakdown": breakdown,
            "created_at": req.created_at.isoformat()
        })
    results.sort(key=lambda x: (x["priority"] == "CRITICAL", x["match_score"]), reverse=True)
    return results
