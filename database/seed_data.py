import os
import sys
import uuid
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.db.session import Base
from app.db.models import (
    User, CitizenProfile, VolunteerProfile, NGO,
    EmergencyRequest, Shelter, ResourceItem, MissingPersonReport, DisasterHotspot
)
from app.config import settings

def seed_database():
    print("[+] Initializing Database Seeds for Disaster AI...")
    
    # Use SQLite fallback or configured DB
    db_url = settings.DATABASE_URL
    if "sqlite" in db_url or not os.getenv("POSTGRES_SERVER"):
        db_url = "sqlite:///./disaster_ai.db"
    
    engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # Clear existing demo data
    try:
        db.query(EmergencyRequest).delete()
        db.query(VolunteerProfile).delete()
        db.query(CitizenProfile).delete()
        db.query(ResourceItem).delete()
        db.query(Shelter).delete()
        db.query(NGO).delete()
        db.query(User).delete()
        db.commit()
    except Exception as e:
        print(f"Warning clearing tables: {e}")
        db.rollback()

    # 1. Users & Roles
    # Admin
    admin_user = User(
        id=str(uuid.uuid4()),
        phone="+919900000001",
        email="admin@disasterai.org",
        hashed_password="hashed_admin_pass", # Demo auth
        name="District Disaster Commander",
        role="ADMIN",
        preferred_language="en"
    )
    db.add(admin_user)

    # NGO
    ngo_user = User(
        id=str(uuid.uuid4()),
        phone="+919900000002",
        email="contact@redcross-ap.org",
        name="Red Cross AP Operations",
        role="NGO",
        preferred_language="en"
    )
    db.add(ngo_user)
    db.flush()

    ngo_org = NGO(
        id=str(uuid.uuid4()),
        user_id=ngo_user.id,
        organization_name="Red Cross Emergency Response Team",
        contact_phone="+919900000002",
        service_areas=["Vijayawada", "Guntur", "Krishna District"],
        is_verified=True
    )
    db.add(ngo_org)
    db.flush()

    # Volunteers
    volunteers_data = [
        {"name": "Ravi Kumar", "phone": "+919876543210", "skills": ["flood_rescue", "boat_operator", "first_aid"], "lat": 16.5062, "lon": 80.6480, "med": True},
        {"name": "Priya Sharma", "phone": "+919876543211", "skills": ["medical_first_aid", "triage"], "lat": 16.5120, "lon": 80.6320, "med": True},
        {"name": "Suresh Reddy", "phone": "+919876543212", "skills": ["fire_rescue", "evacuation"], "lat": 16.4980, "lon": 80.6550, "med": False},
        {"name": "Lakshmi Narayana", "phone": "+919876543213", "skills": ["boat_operator", "supply_distribution"], "lat": 16.5180, "lon": 80.6200, "med": False},
    ]

    for v in volunteers_data:
        u = User(
            id=str(uuid.uuid4()),
            phone=v["phone"],
            name=v["name"],
            role="VOLUNTEER",
            preferred_language="te" if "Ravi" in v["name"] else "en"
        )
        db.add(u)
        db.flush()

        vp = VolunteerProfile(
            user_id=u.id,
            ngo_id=ngo_org.id,
            skills=v["skills"],
            availability_status="AVAILABLE",
            latitude=v["lat"],
            longitude=v["lon"],
            medical_certified=v["med"],
            workload_count=0,
            is_verified=True
        )
        db.add(vp)

    # Citizens
    citizens_data = [
        {"name": "Venkat Rao", "phone": "+919123456789", "lang": "te", "lat": 16.5080, "lon": 80.6410},
        {"name": "Anitha Chary", "phone": "+919123456788", "lang": "te", "lat": 16.5150, "lon": 80.6350},
        {"name": "Srinivas Raju", "phone": "+919123456787", "lang": "en", "lat": 16.4950, "lon": 80.6500},
    ]

    citizen_users = []
    for c in citizens_data:
        u = User(
            id=str(uuid.uuid4()),
            phone=c["phone"],
            name=c["name"],
            role="CITIZEN",
            preferred_language=c["lang"]
        )
        db.add(u)
        db.flush()
        cp = CitizenProfile(
            user_id=u.id,
            emergency_contact="+919000000000",
            latitude=c["lat"],
            longitude=c["lon"]
        )
        db.add(cp)
        citizen_users.append(u)

    # 2. Shelters
    shelters_data = [
        {
            "name": "Vijayawada Central Relief Shelter",
            "lat": 16.5030,
            "lon": 80.6400,
            "capacity": 500,
            "occupancy": 120,
            "facilities": ["food", "clean_water", "medical_bay", "power_generator"],
            "phone": "+918662450001"
        },
        {
            "name": "Auto Nagar Emergency Safe Shelter",
            "lat": 16.5180,
            "lon": 80.6620,
            "capacity": 300,
            "occupancy": 45,
            "facilities": ["food", "sleeping_mats", "first_aid"],
            "phone": "+918662450002"
        },
        {
            "name": "Kanaka Durga Shelter Center",
            "lat": 16.5140,
            "lon": 80.6050,
            "capacity": 400,
            "occupancy": 210,
            "facilities": ["food", "clean_water", "infant_care"],
            "phone": "+918662450003"
        }
    ]

    shelter_objs = []
    for s in shelters_data:
        sh = Shelter(
            id=str(uuid.uuid4()),
            name=s["name"],
            latitude=s["lat"],
            longitude=s["lon"],
            capacity=s["capacity"],
            current_occupancy=s["occupancy"],
            facilities=s["facilities"],
            contact_phone=s["phone"],
            is_active=True
        )
        db.add(sh)
        db.flush()
        shelter_objs.append(sh)

        # Resources for each shelter
        res1 = ResourceItem(
            id=str(uuid.uuid4()),
            shelter_id=sh.id,
            resource_type="food_kits",
            quantity=250,
            unit="kits",
            status="AVAILABLE"
        )
        res2 = ResourceItem(
            id=str(uuid.uuid4()),
            shelter_id=sh.id,
            resource_type="water_bottles",
            quantity=1200,
            unit="liters",
            status="AVAILABLE"
        )
        res3 = ResourceItem(
            id=str(uuid.uuid4()),
            shelter_id=sh.id,
            resource_type="medical_kits",
            quantity=50,
            unit="boxes",
            status="AVAILABLE"
        )
        db.add_all([res1, res2, res3])

    # 3. Active Emergency Requests
    emergencies_data = [
        {
            "citizen_idx": 0,
            "disaster_type": "flood",
            "people": 5,
            "med": True,
            "evac": True,
            "prio": "CRITICAL",
            "lat": 16.5085,
            "lon": 80.6420,
            "address": "House #12, Krishna Riverbank Colony, Vijayawada",
            "status": "AI_PRIORITIZED",
            "ai_data": {
                "summary": "5 people trapped in 4ft floodwater. Mother requires immediate insulin/medical attention.",
                "disaster_type": "flood",
                "people_count": 5,
                "medical_need": True,
                "evacuation_required": True,
                "priority": "critical"
            }
        },
        {
            "citizen_idx": 1,
            "disaster_type": "building_collapse",
            "people": 3,
            "med": True,
            "evac": True,
            "prio": "CRITICAL",
            "lat": 16.5160,
            "lon": 80.6360,
            "address": "Plot 45, Near Old Bus Stand, Vijayawada",
            "status": "SUBMITTED",
            "ai_data": {
                "summary": "Wall collapse due to severe rains. 3 citizens injured under debris.",
                "disaster_type": "building_collapse",
                "people_count": 3,
                "medical_need": True,
                "evacuation_required": True,
                "priority": "critical"
            }
        },
        {
            "citizen_idx": 2,
            "disaster_type": "cyclone",
            "people": 2,
            "med": False,
            "evac": False,
            "prio": "NORMAL",
            "lat": 16.4960,
            "lon": 80.6510,
            "address": "Sector 4, Auto Nagar",
            "status": "AI_PRIORITIZED",
            "ai_data": {
                "summary": "Roof damaged due to high wind speeds. Requesting plastic tarpaulins.",
                "disaster_type": "cyclone",
                "people_count": 2,
                "medical_need": False,
                "evacuation_required": False,
                "priority": "normal"
            }
        }
    ]

    for em in emergencies_data:
        req = EmergencyRequest(
            id=str(uuid.uuid4()),
            citizen_id=citizen_users[em["citizen_idx"]].id,
            disaster_type=em["disaster_type"],
            people_count=em["people"],
            medical_need=em["med"],
            evacuation_required=em["evac"],
            priority=em["prio"],
            latitude=em["lat"],
            longitude=em["lon"],
            address_text=em["address"],
            status=em["status"],
            ai_extracted_data=em["ai_data"]
        )
        db.add(req)

    # 4. Disaster Hotspot Cluster
    hotspot = DisasterHotspot(
        id=str(uuid.uuid4()),
        disaster_type="flood",
        latitude=16.5090,
        longitude=80.6400,
        radius_km=1.5,
        request_count=12,
        critical_count=8,
        ai_summary="High priority flood hotspot detected near Krishna Riverbank. Heavy inundation affecting 150+ households."
    )
    db.add(hotspot)

    db.commit()
    print("[SUCCESS] Seed data populated successfully!")

if __name__ == "__main__":
    seed_database()
