from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Shelter
from app.ai.matching_engine import HybridMatchingEngine

router = APIRouter()

class ShelterCapacityUpdate(BaseModel):
    current_occupancy: int

@router.get("/nearby")
def get_nearby_shelters(latitude: float = 16.5062, longitude: float = 80.6480, radius_km: float = 15.0, db: Session = Depends(get_db)):
    shelters = db.query(Shelter).filter(Shelter.is_active == True).all()
    results = []
    for s in shelters:
        dist = HybridMatchingEngine.haversine_distance_km(latitude, longitude, s.latitude, s.longitude)
        if dist <= radius_km:
            results.append({
                "id": s.id,
                "name": s.name,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "capacity": s.capacity,
                "current_occupancy": s.current_occupancy,
                "available_capacity": s.capacity - s.current_occupancy,
                "facilities": s.facilities,
                "contact_phone": s.contact_phone,
                "distance_km": round(dist, 2)
            })
    results.sort(key=lambda x: x["distance_km"])
    return results

@router.patch("/{id}/occupancy")
def update_shelter_occupancy(id: str, payload: ShelterCapacityUpdate, db: Session = Depends(get_db)):
    shelter = db.query(Shelter).filter(Shelter.id == id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    shelter.current_occupancy = payload.current_occupancy
    db.commit()
    return {"status": "success", "id": shelter.id, "new_occupancy": shelter.current_occupancy}
