from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EmergencyExtraction(BaseModel):
    disaster_type: str = Field(description="Type of disaster, e.g., flood, fire, cyclone, earthquake, medical, building_collapse")
    people_count: int = Field(default=1, description="Estimated number of affected or trapped people")
    medical_need: bool = Field(default=False, description="Whether immediate medical assistance is needed")
    missing_person: bool = Field(default=False, description="Whether someone is reported missing")
    evacuation_required: bool = Field(default=False, description="Whether immediate evacuation or boat rescue is required")
    priority: str = Field(default="NORMAL", description="Assessed priority level: CRITICAL, HIGH, or NORMAL")
    location_required: bool = Field(default=True, description="Whether GPS location is still needed from user")
    required_resources: List[str] = Field(default_factory=list, description="List of required resources e.g. rescue_team, medical_support, food_water, shelter")
    missing_person_details: Optional[Dict[str, Any]] = Field(default=None, description="Details if reporting missing person")
    clarifying_question: Optional[str] = Field(default=None, description="Next minimal question to ask user if details are missing")

class ToolCallRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

class ToolCallResult(BaseModel):
    tool_name: str
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class ChatAgentResponse(BaseModel):
    reply: str
    language: str = "en"
    extraction: Optional[EmergencyExtraction] = None
    tool_calls_executed: List[ToolCallResult] = Field(default_factory=list)
    request_id: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
