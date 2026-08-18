import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.ai.schemas import EmergencyExtraction, ChatAgentResponse, ToolCallResult
from app.ai.tools import AIToolExecutor
from app.ai.voice_service import VoiceService

class DisasterAIAgent:
    """
    Core AI Agent orchestrating emergency chat, intent recognition,
    structured extraction, tool calls, and response generation.
    """
    def __init__(self, db: Session, user_id: str, language: str = "en"):
        self.db = db
        self.user_id = user_id
        self.language = language
        self.tool_executor = AIToolExecutor(db, user_id)

    def process_message(self, user_message: str, current_location: Optional[Dict[str, float]] = None) -> ChatAgentResponse:
        # 1. Language Detection & Telugu translation
        is_telugu = any('\u0c00' <= char <= '\u0c7f' for char in user_message)
        lang = "te" if is_telugu else self.language

        proc_message = user_message
        if is_telugu:
            proc_message = VoiceService.translate_telugu_to_english(user_message)

        # 2. Extract Emergency Details
        extraction = self._extract_emergency_details(proc_message, user_message)

        executed_tools: List[ToolCallResult] = []
        request_id = None
        priority = extraction.priority
        status = "SUBMITTED"
        reply = ""

        # 3. Decision Logic & Tool Execution
        if extraction.missing_person and extraction.missing_person_details:
            tool_res = self.tool_executor.execute_tool("report_missing_person", extraction.missing_person_details)
            executed_tools.append(ToolCallResult(tool_name="report_missing_person", success=tool_res["success"], data=tool_res.get("data")))

        # Check if user needs immediate rescue or emergency creation
        if extraction.disaster_type or extraction.evacuation_required or extraction.medical_need:
            lat = current_location.get("latitude") if current_location else None
            lon = current_location.get("longitude") if current_location else None
            
            tool_res = self.tool_executor.execute_tool("create_emergency_request", {
                "disaster_type": extraction.disaster_type or "flood",
                "people_count": extraction.people_count,
                "medical_need": extraction.medical_need,
                "missing_person": extraction.missing_person,
                "evacuation_required": extraction.evacuation_required,
                "latitude": lat,
                "longitude": lon,
                "user_message": user_message
            })
            
            executed_tools.append(ToolCallResult(tool_name="create_emergency_request", success=tool_res["success"], data=tool_res.get("data")))

            if tool_res["success"]:
                data = tool_res["data"]
                request_id = data.get("request_id")
                priority = data.get("priority")
                status = data.get("status")
                assigned = data.get("assigned_volunteer")

                if lang == "te":
                    reply = f"మీ అభ్యర్థన అత్యవసర పరిధిలో ({priority}) నమోదు చేయబడింది. సమీపంలో ఉన్న రెస్క్యూ టీమ్‌ను అనుసంధానిస్తున్నాం."
                    if assigned and assigned.get("success"):
                        vdata = assigned.get("data", {})
                        reply += f"\nసహాయ బృందం {vdata.get('volunteer_name')} ({vdata.get('distance_km')} కి.మీ) అనుసంధానించబడింది. చేరుకోవడానికి సమయం: {vdata.get('eta_minutes')} నిమిషాలు."
                else:
                    reply = f"Your request has been logged as **{priority}** priority.\n"
                    if assigned and assigned.get("success"):
                        vdata = assigned.get("data", {})
                        reply += f"Rescue Team **{vdata.get('volunteer_name')}** is {vdata.get('distance_km')} km away and on the way.\nEstimated arrival: **{vdata.get('eta_minutes')} minutes**."
                    else:
                        reply += "Looking for nearest available rescue team and shelter support..."

        elif "shelter" in proc_message.lower():
            lat = current_location.get("latitude", 16.5062) if current_location else 16.5062
            lon = current_location.get("longitude", 80.6480) if current_location else 80.6480
            tool_res = self.tool_executor.execute_tool("find_nearby_shelters", {"latitude": lat, "longitude": lon})
            executed_tools.append(ToolCallResult(tool_name="find_nearby_shelters", success=tool_res["success"], data=tool_res.get("data")))
            
            if lang == "te":
                reply = "సమీపంలోని సురక్షిత పునరావాస కేంద్రాల వివరాలు సిద్ధంగా ఉన్నాయి."
            else:
                reply = "Here are the nearest available safe shelters in your area."
        else:
            if lang == "te":
                reply = "మీరు సురక్షిత ప్రాంతంలో ఉన్నారా? మీకు మెడికల్ సాయం గానీ ఆహారం, నీరు లేదా రెస్క్యూ అవసరమా?"
            else:
                reply = "I understand. Please tell me if anyone needs medical assistance or immediate evacuation."

        return ChatAgentResponse(
            reply=reply,
            language=lang,
            extraction=extraction,
            tool_calls_executed=executed_tools,
            request_id=request_id,
            priority=priority,
            status=status
        )

    def _extract_emergency_details(self, english_text: str, original_text: str) -> EmergencyExtraction:
        text = english_text.lower()
        
        # Disaster Type
        disaster_type = "flood"
        if "fire" in text or "smoke" in text:
            disaster_type = "fire"
        elif "cyclone" in text or "storm" in text or "wind" in text:
            disaster_type = "cyclone"
        elif "earthquake" in text or "quake" in text or "shaking" in text:
            disaster_type = "earthquake"
        elif "collapse" in text or "debris" in text or "building" in text:
            disaster_type = "building_collapse"
        elif "medical" in text or "hospital" in text or "doctor" in text:
            disaster_type = "medical"

        # People count extraction
        people_count = 1
        numbers = re.findall(r'\b\d+\b', text)
        if numbers:
            people_count = min(100, max(1, int(numbers[0])))
        elif "five" in text or "5" in text or "ఐదుగురం" in original_text:
            people_count = 5
        elif "three" in text or "3" in text or "ముగ్గురం" in original_text:
            people_count = 3
        elif "four" in text or "4" in text or "నలుగురం" in original_text:
            people_count = 4
        elif "two" in text or "2" in text or "ఇద్దరం" in original_text:
            people_count = 2

        medical_need = any(w in text for w in ["medical", "hospital", "doctor", "medicine", "mother", "pregnant", "injured", "bleeding", "sick", "మెడికల్", "ఆస్పత్రి"])
        missing_person = "missing" in text or "brother" in text or "family member" in text or "కోల్పోయాము" in original_text
        evacuation_required = any(w in text for w in ["trapped", "flooded", "boat", "evacuate", "rescue", "water", "వరద", "కాపాడండి"])

        resources = []
        if evacuation_required:
            resources.append("rescue_team")
        if medical_need:
            resources.append("medical_support")
        if "food" in text or "water" in text or "నీళ్లు" in original_text:
            resources.append("food_water")

        # Initial priority assessment
        prio = "NORMAL"
        if medical_need or (evacuation_required and people_count >= 3):
            prio = "CRITICAL"
        elif evacuation_required or missing_person:
            prio = "HIGH"

        return EmergencyExtraction(
            disaster_type=disaster_type,
            people_count=people_count,
            medical_need=medical_need,
            missing_person=missing_person,
            evacuation_required=evacuation_required,
            priority=prio,
            location_required=True,
            required_resources=resources
        )
