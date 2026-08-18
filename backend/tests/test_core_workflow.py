import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
os.environ["USE_IN_MEMORY_DB"] = "true"

from fastapi.testclient import TestClient
from app.main import app
from app.ai.priority_engine import PriorityEngine
from app.ai.matching_engine import HybridMatchingEngine

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "Disaster AI"

def test_otp_auth_flow():
    req_res = client.post("/api/v1/auth/request-otp", json={"phone": "+919900000001"})
    assert req_res.status_code == 200
    
    verify_res = client.post("/api/v1/auth/verify-otp", json={
        "phone": "+919900000001",
        "code": "123456",
        "name": "Test Commander",
        "role": "ADMIN"
    })
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"

def test_priority_engine():
    ext = {
        "disaster_type": "flood",
        "people_count": 5,
        "medical_need": True,
        "evacuation_required": True
    }
    prio, reason = PriorityEngine.calculate_priority(ext, "Our house is flooded with 4ft water. Mother needs medical help!")
    assert prio == "CRITICAL"
    assert "Immediate medical assistance required" in reason

def test_hybrid_matching_engine():
    score, breakdown = HybridMatchingEngine.score_volunteer(
        req_lat=16.5080,
        req_lon=80.6410,
        disaster_type="flood",
        medical_need=True,
        vol_lat=16.5062,
        vol_lon=80.6480,
        vol_skills=["flood_rescue", "medical_first_aid"],
        vol_availability="AVAILABLE",
        vol_medical=True,
        vol_workload=0
    )
    assert score > 70.0
    assert breakdown["distance_km"] < 2.0

def test_hackathon_demo_simulation_endpoint():
    res = client.post("/api/v1/admin/simulation/trigger", json={
        "disaster_type": "flood",
        "citizen_count": 10,
        "center_lat": 16.5062,
        "center_lon": 80.6480
    })
    assert res.status_code == 200
    data = res.json()
    assert data["citizens_generated"] == 10
    assert data["is_demo_data"] is True
