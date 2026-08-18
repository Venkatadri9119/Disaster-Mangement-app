import math
from typing import List, Dict, Any, Tuple

class HybridMatchingEngine:
    """
    Calculates transparent match score (0-100%) between an Emergency Request and available Volunteers.
    """
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @classmethod
    def score_volunteer(
        cls,
        req_lat: float,
        req_lon: float,
        disaster_type: str,
        medical_need: bool,
        vol_lat: float,
        vol_lon: float,
        vol_skills: List[str],
        vol_availability: str,
        vol_medical: bool,
        vol_workload: int
    ) -> Tuple[float, Dict[str, float]]:
        
        if vol_availability != "AVAILABLE":
            return 0.0, {"distance_score": 0, "skill_score": 0, "availability_score": 0, "medical_score": 0, "workload_penalty": 0}

        # 1. Distance Score (Max 40 points): 0km = 40, 10km = 0
        dist_km = cls.haversine_distance_km(req_lat, req_lon, vol_lat, vol_lon) if (vol_lat and vol_lon) else 15.0
        distance_score = max(0.0, 40.0 * (1.0 - dist_km / 10.0))

        # 2. Skill Score (Max 30 points)
        skill_score = 10.0 # base skill
        req_skills_needed = []
        if disaster_type == "flood":
            req_skills_needed = ["flood_rescue", "boat_operator"]
        elif disaster_type == "fire":
            req_skills_needed = ["fire_rescue"]
        elif disaster_type in ["earthquake", "building_collapse"]:
            req_skills_needed = ["structural_rescue", "triage"]

        matching_skills = [s for s in req_skills_needed if s in vol_skills]
        if matching_skills:
            skill_score += 20.0

        # 3. Medical Score (Max 15 points)
        medical_score = 0.0
        if medical_need:
            if vol_medical or "medical_first_aid" in vol_skills:
                medical_score = 15.0
        else:
            medical_score = 10.0

        # 4. Workload Score (Max 15 points) - Penalize active workload
        workload_score = max(0.0, 15.0 - (vol_workload * 5.0))

        total_score = round(distance_score + skill_score + medical_score + workload_score, 1)

        breakdown = {
            "distance_km": round(dist_km, 2),
            "distance_score": round(distance_score, 1),
            "skill_score": round(skill_score, 1),
            "medical_score": round(medical_score, 1),
            "workload_score": round(workload_score, 1)
        }

        return min(100.0, total_score), breakdown
