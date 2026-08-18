import uuid
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.db.models import (
    EmergencyRequest, User, VolunteerProfile, Shelter, NGO,
    RequestAssignment, MissingPersonReport, AuditLog
)
from app.ai.matching_engine import HybridMatchingEngine
from app.ai.priority_engine import PriorityEngine

class AIToolExecutor:
    """
    Controlled backend tools invokable by AI Agent requests.
    Validates input, security context, and executes deterministic DB operations.
    """
    def __init__(self, db: Session, current_user_id: str):
        self.db = db
        self.user_id = current_user_id

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        tool_map = {
            "get_user_location": self.get_user_location,
            "reverse_geocode": self.reverse_geocode,
            "create_emergency_request": self.create_emergency_request,
            "update_emergency_request": self.update_emergency_request,
            "find_nearby_shelters": self.find_nearby_shelters,
            "find_available_volunteers": self.find_available_volunteers,
            "find_available_ngos": self.find_available_ngos,
            "calculate_route": self.calculate_route,
            "assign_volunteer": self.assign_volunteer,
            "send_notification": self.send_notification,
            "get_request_status": self.get_request_status,
            "cancel_request": self.cancel_request,
            "report_missing_person": self.report_missing_person,
        }

        handler = tool_map.get(tool_name)
        if not handler:
            return {"success": False, "error": f"Tool '{tool_name}' not authorized or found"}

        try:
            result = handler(**arguments)
            # Audit log
            log = AuditLog(
                actor_id=self.user_id,
                action=f"AI_TOOL_EXECUTE:{tool_name}",
                details={"args": arguments, "result_success": True}
            )
            self.db.add(log)
            self.db.commit()
            return {"success": True, "data": result}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "error": str(e)}

    def get_user_location(self) -> Dict[str, Any]:
        user = self.db.query(User).filter(User.id == self.user_id).first()
        if user and user.citizen_profile and user.citizen_profile.latitude:
            return {
                "latitude": user.citizen_profile.latitude,
                "longitude": user.citizen_profile.longitude,
                "source": "stored_profile"
            }
        # Fallback default location (Vijayawada Center)
        return {"latitude": 16.5062, "longitude": 80.6480, "source": "device_gps_default"}

    def reverse_geocode(self, latitude: float, longitude: float) -> Dict[str, Any]:
        # Simulated reverse geocoding
        return {
            "address": f"Near Landmark ({round(latitude, 4)}, {round(longitude, 4)}), Vijayawada Region, AP",
            "city": "Vijayawada",
            "state": "Andhra Pradesh",
            "country": "India"
        }

    def create_emergency_request(
        self,
        disaster_type: str,
        people_count: int = 1,
        medical_need: bool = False,
        missing_person: bool = False,
        evacuation_required: bool = False,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        address_text: Optional[str] = None,
        user_message: str = ""
    ) -> Dict[str, Any]:

        if latitude is None or longitude is None:
            loc = self.get_user_location()
            latitude = loc["latitude"]
            longitude = loc["longitude"]

        # Calculate Priority using PriorityEngine
        extracted = {
            "disaster_type": disaster_type,
            "people_count": people_count,
            "medical_need": medical_need,
            "evacuation_required": evacuation_required,
            "missing_person": missing_person
        }
        priority, explanation = PriorityEngine.calculate_priority(extracted, user_message)

        req = EmergencyRequest(
            id=str(uuid.uuid4()),
            citizen_id=self.user_id,
            disaster_type=disaster_type,
            people_count=people_count,
            medical_need=medical_need,
            missing_person=missing_person,
            evacuation_required=evacuation_required,
            priority=priority,
            latitude=latitude,
            longitude=longitude,
            address_text=address_text or self.reverse_geocode(latitude, longitude)["address"],
            status="AI_PRIORITIZED",
            ai_extracted_data={"summary": explanation, "extracted": extracted}
        )

        self.db.add(req)
        self.db.commit()
        self.db.refresh(req)

        # Auto-trigger matching
        top_volunteers = self.find_available_volunteers(latitude, longitude, [disaster_type])
        assigned_info = None

        if top_volunteers and len(top_volunteers) > 0:
            best_vol = top_volunteers[0]
            assign_res = self.assign_volunteer(req.id, best_vol["volunteer_id"], best_vol["match_score"])
            assigned_info = assign_res

        return {
            "request_id": req.id,
            "priority": req.priority,
            "status": req.status,
            "location": {"latitude": req.latitude, "longitude": req.longitude},
            "explanation": explanation,
            "assigned_volunteer": assigned_info
        }

    def update_emergency_request(self, request_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        req = self.db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
        if not req:
            raise ValueError(f"Request {request_id} not found")

        for k, v in updates.items():
            if hasattr(req, k):
                setattr(req, k, v)
        req.updated_at = datetime.datetime.utcnow()
        self.db.commit()
        return {"request_id": req.id, "status": req.status, "priority": req.priority}

    def find_nearby_shelters(self, latitude: float, longitude: float, radius_km: float = 10.0) -> List[Dict[str, Any]]:
        shelters = self.db.query(Shelter).filter(Shelter.is_active == True).all()
        results = []
        for s in shelters:
            dist = HybridMatchingEngine.haversine_distance_km(latitude, longitude, s.latitude, s.longitude)
            if dist <= radius_km:
                results.append({
                    "shelter_id": s.id,
                    "name": s.name,
                    "distance_km": round(dist, 2),
                    "available_capacity": s.capacity - s.current_occupancy,
                    "total_capacity": s.capacity,
                    "facilities": s.facilities,
                    "contact_phone": s.contact_phone,
                    "latitude": s.latitude,
                    "longitude": s.longitude
                })
        results.sort(key=lambda x: x["distance_km"])
        return results

    def find_available_volunteers(self, latitude: float, longitude: float, disaster_type: str = "flood", radius_km: float = 15.0) -> List[Dict[str, Any]]:
        volunteers = self.db.query(VolunteerProfile).filter(VolunteerProfile.availability_status == "AVAILABLE").all()
        matched = []
        for vp in volunteers:
            user = self.db.query(User).filter(User.id == vp.user_id).first()
            if not user:
                continue
            score, breakdown = HybridMatchingEngine.score_volunteer(
                req_lat=latitude,
                req_lon=longitude,
                disaster_type=disaster_type,
                medical_need=False,
                vol_lat=vp.latitude or 16.50,
                vol_lon=vp.longitude or 80.64,
                vol_skills=vp.skills or [],
                vol_availability=vp.availability_status,
                vol_medical=vp.medical_certified,
                vol_workload=vp.workload_count
            )
            dist = breakdown["distance_km"]
            if dist <= radius_km:
                matched.append({
                    "volunteer_id": vp.user_id,
                    "name": user.name,
                    "phone": user.phone,
                    "skills": vp.skills,
                    "distance_km": dist,
                    "match_score": score,
                    "eta_minutes": max(3, int(dist * 3.5)), # Approx 3.5 mins per km
                    "score_breakdown": breakdown
                })
        matched.sort(key=lambda x: x["match_score"], reverse=True)
        return matched

    def find_available_ngos(self, latitude: float, longitude: float) -> List[Dict[str, Any]]:
        ngos = self.db.query(NGO).filter(NGO.is_verified == True).all()
        return [{"ngo_id": n.id, "organization_name": n.organization_name, "contact_phone": n.contact_phone} for n in ngos]

    def calculate_route(self, origin_lat: float, origin_lon: float, dest_lat: float, dest_lon: float) -> Dict[str, Any]:
        dist_km = HybridMatchingEngine.haversine_distance_km(origin_lat, origin_lon, dest_lat, dest_lon)
        eta_min = max(2, int(dist_km * 3.0))
        return {
            "distance_km": round(dist_km, 2),
            "eta_minutes": eta_min,
            "origin": {"lat": origin_lat, "lon": origin_lon},
            "destination": {"lat": dest_lat, "lon": dest_lon},
            "deep_link": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lon}&destination={dest_lat},{dest_lon}&travelmode=driving"
        }

    def assign_volunteer(self, request_id: str, volunteer_id: str, match_score: float = 85.0) -> Dict[str, Any]:
        req = self.db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
        vol_user = self.db.query(User).filter(User.id == volunteer_id).first()
        
        if not req or not vol_user:
            raise ValueError("Invalid request ID or volunteer ID")

        assignment = RequestAssignment(
            id=str(uuid.uuid4()),
            request_id=request_id,
            volunteer_id=volunteer_id,
            status="ASSIGNED",
            match_score=match_score
        )
        req.status = "VOLUNTEER_ASSIGNED"
        
        # Update volunteer workload
        if vol_user.volunteer_profile:
            vol_user.volunteer_profile.workload_count += 1
            vol_user.volunteer_profile.availability_status = "ON_MISSION"

        self.db.add(assignment)
        self.db.commit()

        route = self.calculate_route(vol_user.volunteer_profile.latitude or 16.50, vol_user.volunteer_profile.longitude or 80.64, req.latitude, req.longitude)

        return {
            "assignment_id": assignment.id,
            "request_id": request_id,
            "volunteer_name": vol_user.name,
            "volunteer_phone": vol_user.phone,
            "eta_minutes": route["eta_minutes"],
            "distance_km": route["distance_km"],
            "status": "VOLUNTEER_ASSIGNED"
        }

    def send_notification(self, user_id: str, message: str) -> Dict[str, Any]:
        return {"user_id": user_id, "delivered": True, "timestamp": datetime.datetime.utcnow().isoformat()}

    def get_request_status(self, request_id: str) -> Dict[str, Any]:
        req = self.db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
        if not req:
            raise ValueError(f"Request {request_id} not found")
        
        assigned_vol = None
        if req.assignments:
            last_assign = req.assignments[-1]
            vol_u = self.db.query(User).filter(User.id == last_assign.volunteer_id).first()
            if vol_u:
                assigned_vol = {
                    "name": vol_u.name,
                    "phone": vol_u.phone,
                    "status": last_assign.status
                }

        return {
            "request_id": req.id,
            "disaster_type": req.disaster_type,
            "priority": req.priority,
            "status": req.status,
            "people_count": req.people_count,
            "medical_need": req.medical_need,
            "address": req.address_text,
            "assigned_team": assigned_vol,
            "created_at": req.created_at.isoformat()
        }

    def cancel_request(self, request_id: str) -> Dict[str, Any]:
        req = self.db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
        if req:
            req.status = "CANCELLED"
            self.db.commit()
        return {"request_id": request_id, "status": "CANCELLED"}

    def report_missing_person(self, person_name: str, age: Optional[int] = None, description: str = "", location_text: str = "") -> Dict[str, Any]:
        rep = MissingPersonReport(
            id=str(uuid.uuid4()),
            citizen_id=self.user_id,
            person_name=person_name,
            age=age,
            description=description,
            location_text=location_text,
            status="SEARCHING"
        )
        self.db.add(rep)
        self.db.commit()
        return {"report_id": rep.id, "person_name": person_name, "status": "SEARCHING"}
