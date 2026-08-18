from typing import Optional, Dict
from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User
from app.api.deps import get_current_user
from app.ai.agent import DisasterAIAgent
from app.ai.voice_service import VoiceService

router = APIRouter()

class ChatRequestPayload(BaseModel):
    message: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    language: Optional[str] = "en"

@router.post("/chat")
def chat_with_agent(
    payload: ChatRequestPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    agent = DisasterAIAgent(db, current_user.id, language=payload.language or current_user.preferred_language)
    loc = None
    if payload.latitude and payload.longitude:
        loc = {"latitude": payload.latitude, "longitude": payload.longitude}

    res = agent.process_message(payload.message, current_location=loc)
    return res

@router.post("/voice")
async def voice_to_text_and_chat(
    file: Optional[UploadFile] = File(None),
    language: str = Form("auto"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Process speech to text
    audio_content = b""
    if file:
        audio_content = await file.read()
        
    transcribed_text, detected_lang = VoiceService.process_voice_input(audio_content, target_language=language)
    
    agent = DisasterAIAgent(db, current_user.id, language=detected_lang)
    loc = {"latitude": latitude, "longitude": longitude} if (latitude and longitude) else None
    
    chat_response = agent.process_message(transcribed_text, current_location=loc)
    tts_data = VoiceService.text_to_speech_response(chat_response.reply, language=detected_lang)

    return {
        "transcribed_text": transcribed_text,
        "detected_language": detected_lang,
        "chat_response": chat_response,
        "tts": tts_data
    }

@router.post("/analyze")
def analyze_disaster_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Mock vision analysis with safety warning
    return {
        "file_name": file.filename,
        "detected_disaster": "Possible severe flood inundation",
        "confidence": 0.89,
        "recommended_priority": "CRITICAL",
        "disclaimer": "AI Assessment — requires human verification by disaster authority."
    }
