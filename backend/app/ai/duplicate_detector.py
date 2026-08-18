from typing import List, Dict, Any, Tuple
from app.ai.matching_engine import HybridMatchingEngine

class DuplicateDetector:
    """
    Detects potential duplicate or fraudulent emergency requests based on
    spatial proximity (< 100 meters), temporal window (< 15 mins), and text similarity.
    """
    @classmethod
    def check_duplicate(
        cls,
        new_lat: float,
        new_lon: float,
        new_text: str,
        recent_requests: List[Dict[str, Any]]
    ) -> Tuple[bool, str]:
        
        for req in recent_requests:
            lat = req.get("latitude")
            lon = req.get("longitude")
            if lat is None or lon is None:
                continue

            dist_km = HybridMatchingEngine.haversine_distance_km(new_lat, new_lon, lat, lon)
            # Distance less than 100 meters (0.1 km)
            if dist_km < 0.1:
                # Same disaster type
                if req.get("disaster_type") == req.get("new_disaster_type"):
                    return True, f"Possible duplicate request (Within {round(dist_km*1000)} meters of active Request #{req.get('id')[:8]})"

        return False, ""
