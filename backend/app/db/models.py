import uuid
import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="CITIZEN") # CITIZEN, VOLUNTEER, NGO, ADMIN
    preferred_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    citizen_profile = relationship("CitizenProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    volunteer_profile = relationship("VolunteerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    requests = relationship("EmergencyRequest", back_populates="citizen", foreign_keys="EmergencyRequest.citizen_id")

class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    emergency_contact = Column(String(20), nullable=True)
    medical_notes = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="citizen_profile")

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    organization_name = Column(String(150), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    service_areas = Column(JSON, default=list)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VolunteerProfile(Base):
    __tablename__ = "volunteer_profiles"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    ngo_id = Column(String(36), ForeignKey("ngos.id", ondelete="SET NULL"), nullable=True)
    skills = Column(JSON, default=list) # e.g. ["flood_rescue", "medical_first_aid", "boat_operator"]
    availability_status = Column(String(20), default="UNAVAILABLE") # AVAILABLE, UNAVAILABLE, ON_MISSION
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    medical_certified = Column(Boolean, default=False)
    workload_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="volunteer_profile")

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    citizen_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    disaster_type = Column(String(50), nullable=False) # flood, fire, cyclone, earthquake, medical, building_collapse
    people_count = Column(Integer, default=1)
    medical_need = Column(Boolean, default=False)
    missing_person = Column(Boolean, default=False)
    evacuation_required = Column(Boolean, default=False)
    priority = Column(String(20), default="NORMAL") # CRITICAL, HIGH, NORMAL
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address_text = Column(Text, nullable=True)
    status = Column(String(30), default="SUBMITTED") # SUBMITTED, AI_PRIORITIZED, VOLUNTEER_ASSIGNED, ON_THE_WAY, REACHED, COMPLETED, RESOLVED, CANCELLED
    ai_extracted_data = Column(JSON, default=dict)
    photo_url = Column(Text, nullable=True)
    flagged_fraud = Column(Boolean, default=False)
    fraud_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    citizen = relationship("User", back_populates="requests", foreign_keys=[citizen_id])
    assignments = relationship("RequestAssignment", back_populates="request", cascade="all, delete-orphan")

class RequestAssignment(Base):
    __tablename__ = "request_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("emergency_requests.id", ondelete="CASCADE"), nullable=False)
    volunteer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="ASSIGNED") # ASSIGNED, ACCEPTED, REJECTED, COMPLETED
    match_score = Column(Float, default=0.0)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    request = relationship("EmergencyRequest", back_populates="assignments")
    volunteer = relationship("User", foreign_keys=[volunteer_id])

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    citizen_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(10), nullable=False) # user, ai
    message = Column(Text, nullable=False)
    tool_calls = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, default=100)
    current_occupancy = Column(Integer, default=0)
    facilities = Column(JSON, default=list)
    contact_phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ResourceItem(Base):
    __tablename__ = "resources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    shelter_id = Column(String(36), ForeignKey("shelters.id", ondelete="CASCADE"), nullable=True)
    ngo_id = Column(String(36), ForeignKey("ngos.id", ondelete="CASCADE"), nullable=True)
    resource_type = Column(String(50), nullable=False)
    quantity = Column(Integer, default=0)
    unit = Column(String(20), default="units")
    status = Column(String(20), default="AVAILABLE")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class MissingPersonReport(Base):
    __tablename__ = "missing_person_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    citizen_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    person_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_text = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    photo_url = Column(Text, nullable=True)
    status = Column(String(20), default="SEARCHING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DisasterHotspot(Base):
    __tablename__ = "disaster_hotspots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    disaster_type = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=2.0)
    request_count = Column(Integer, default=0)
    critical_count = Column(Integer, default=0)
    ai_summary = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=True)
    target_id = Column(String(36), nullable=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
