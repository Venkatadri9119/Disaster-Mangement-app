from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ResourceItem, Shelter

router = APIRouter()

@router.get("")
def list_resources(db: Session = Depends(get_db)):
    items = db.query(ResourceItem).all()
    results = []
    for r in items:
        shelter_name = "Central Depot"
        if r.shelter_id:
            s = db.query(Shelter).filter(Shelter.id == r.shelter_id).first()
            if s:
                shelter_name = s.name
        results.append({
            "id": r.id,
            "resource_type": r.resource_type,
            "quantity": r.quantity,
            "unit": r.unit,
            "status": r.status,
            "shelter_id": r.shelter_id,
            "location_name": shelter_name
        })
    return results
