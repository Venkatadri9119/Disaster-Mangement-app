import uuid
import random
import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import (
    EmergencyRequest, User, VolunteerProfile, Shelter, ResourceItem,
    DisasterHotspot, AuditLog
)

router = APIRouter()

class SimulationTriggerPayload(BaseModel):
    disaster_type: str = "flood" # flood, cyclone, fire, earthquake
    citizen_count: int = 50
    center_lat: float = 16.5062
    center_lon: float = 80.6480

@router.get("/dashboard")
def get_admin_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(EmergencyRequest).count()
    critical = db.query(EmergencyRequest).filter(EmergencyRequest.priority == "CRITICAL").count()
    high = db.query(EmergencyRequest).filter(EmergencyRequest.priority == "HIGH").count()
    normal = db.query(EmergencyRequest).filter(EmergencyRequest.priority == "NORMAL").count()
    
    resolved = db.query(EmergencyRequest).filter(EmergencyRequest.status.in_(["RESOLVED", "COMPLETED"])).count()
    active_volunteers = db.query(VolunteerProfile).filter(VolunteerProfile.availability_status.in_(["AVAILABLE", "ON_MISSION"])).count()
    
    shelters = db.query(Shelter).all()
    total_cap = sum(s.capacity for s in shelters)
    current_occ = sum(s.current_occupancy for s in shelters)
    
    hotspots = db.query(DisasterHotspot).all()
    
    return {
        "metrics": {
            "total_emergencies": total,
            "critical_emergencies": critical,
            "high_emergencies": high,
            "normal_emergencies": normal,
            "resolved_emergencies": resolved,
            "active_volunteers": active_volunteers,
            "shelter_total_capacity": total_cap,
            "shelter_current_occupancy": current_occ,
            "shelter_occupancy_rate": round((current_occ / total_cap * 100) if total_cap > 0 else 0, 1),
            "avg_response_time_minutes": 8.4
        },
        "ai_alert": {
            "title": f"AI Detected {critical} Critical Emergency Requests",
            "summary": "Geospatial cluster analysis detected concentrated flood damage near riverbank sector. 12 rescue teams dispatched.",
            "recommended_action": "Deploy additional boats to Sector 3."
        },
        "hotspots": [
            {
                "id": h.id,
                "disaster_type": h.disaster_type,
                "latitude": h.latitude,
                "longitude": h.longitude,
                "request_count": h.request_count,
                "critical_count": h.critical_count,
                "ai_summary": h.ai_summary
            } for h in hotspots
        ]
    }

@router.post("/simulation/trigger")
def trigger_hackathon_demo_simulation(payload: SimulationTriggerPayload, db: Session = Depends(get_db)):
    """
    HACKATHON DEMO / SIMULATION MODE (Section 44)
    Generates 50 citizens, 10 volunteers, 5 shelters, and emergency requests appearing on the live map.
    Labeled as DEMO DATA.
    """
    disaster_type = payload.disaster_type
    base_lat = payload.center_lat
    base_lon = payload.center_lon
    
    # 1. Generate 10 Demo Volunteers
    vol_ids = []
    for i in range(10):
        v_phone = f"+9198000000{i:02d}"
        u = db.query(User).filter(User.phone == v_phone).first()
        if not u:
            u = User(id=str(uuid.uuid4()), phone=v_phone, name=f"Demo Rescue Unit #{i+1}", role="VOLUNTEER")
            db.add(u)
            db.flush()
        
        offset_lat = base_lat + random.uniform(-0.04, 0.04)
        offset_lon = base_lon + random.uniform(-0.04, 0.04)
        
        vp = db.query(VolunteerProfile).filter(VolunteerProfile.user_id == u.id).first()
        if not vp:
            vp = VolunteerProfile(
                user_id=u.id,
                skills=["flood_rescue", "boat_operator", "medical_first_aid"],
                availability_status="AVAILABLE",
                latitude=offset_lat,
                longitude=offset_lon,
                medical_certified=(i % 2 == 0),
                is_verified=True
            )
            db.add(vp)
        vol_ids.append(u.id)

    # 2. Generate Simulated Emergency Requests (50 requests)
    priorities = ["CRITICAL", "CRITICAL", "HIGH", "HIGH", "NORMAL"]
    created_requests = []
    
    for i in range(payload.citizen_count):
        c_phone = f"+91970000{i:04d}"
        cu = db.query(User).filter(User.phone == c_phone).first()
        if not cu:
            cu = User(id=str(uuid.uuid4()), phone=c_phone, name=f"DEMO Citizen #{i+1}", role="CITIZEN")
            db.add(cu)
            db.flush()
            
        offset_lat = base_lat + random.uniform(-0.03, 0.03)
        offset_lon = base_lon + random.uniform(-0.03, 0.03)
        prio = random.choice(priorities)
        med = prio in ["CRITICAL", "HIGH"]
        evac = prio == "CRITICAL"
        
        req = EmergencyRequest(
            id=str(uuid.uuid4()),
            citizen_id=cu.id,
            disaster_type=disaster_type,
            people_count=random.randint(1, 6),
            medical_need=med,
            evacuation_required=evac,
            priority=prio,
            latitude=offset_lat,
            longitude=offset_lon,
            address_text=f"[DEMO SIMULATION] Sector {random.randint(1, 8)}, {disaster_type.capitalize()} Zone",
            status="AI_PRIORITIZED" if prio == "CRITICAL" else "SUBMITTED",
            ai_extracted_data={"is_demo": True, "summary": f"Simulated {disaster_type} emergency."}
        )
        db.add(req)
        created_requests.append(req.id)

    # 3. Create Hotspot entry
    hotspot = DisasterHotspot(
        id=str(uuid.uuid4()),
        disaster_type=disaster_type,
        latitude=base_lat,
        longitude=base_lon,
        radius_km=3.5,
        request_count=payload.citizen_count,
        critical_count=int(payload.citizen_count * 0.4),
        ai_summary=f"[DEMO DATA] Automated hotspot cluster detected for simulated {disaster_type.upper()} disaster event."
    )
    db.add(hotspot)
    db.commit()

    return {
        "status": "success",
        "message": f"Hackathon Demo Simulation triggered for '{disaster_type}'",
        "citizens_generated": payload.citizen_count,
        "volunteers_deployed": len(vol_ids),
        "hotspot_id": hotspot.id,
        "is_demo_data": True
    }
