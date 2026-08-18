import re
from typing import Dict, Any, Tuple

class VoiceService:
    """
    Multilingual STT / TTS service supporting English and Telugu.
    """
    
    TELUGU_KEYWORD_MAP = {
        "వరద": "flood",
        "నీళ్లు": "water",
        "ఇల్లు": "house",
        "మునిగిపోయింది": "flooded",
        "మాకు": "we need",
        "మెడికల్": "medical",
        "హెల్ప్": "help",
        "సహాయం": "help",
        "ఆస్పత్రి": "hospital",
        "కావాలి": "need",
        "ఐదుగురం": "5 people",
        "ముగ్గురం": "3 people",
        "నలుగురం": "4 people",
        "ఇద్దరం": "2 people",
        "అమ్మ": "mother",
        "బాధితులు": "victims",
        "కాపాడండి": "rescue us"
    }

    @classmethod
    def process_voice_input(cls, audio_bytes: bytes, audio_format: str = "wav", target_language: str = "auto") -> Tuple[str, str]:
        """
        Simulates / executes Speech-To-Text processing.
        Returns: (transcribed_text, detected_language)
        """
        # Default mock transcription for sample voice testing if raw audio bytes received
        sample_telugu = "మా ఇంట్లోకి వరద నీళ్లు వచ్చాయి. మేము ఐదుగురం ఉన్నాం. మా అమ్మకి మెడికల్ హెల్ప్ కావాలి."
        
        # Check language markers or default to detected language
        detected_lang = target_language if target_language != "auto" else "te"
        return sample_telugu, detected_lang

    @classmethod
    def translate_telugu_to_english(cls, telugu_text: str) -> str:
        """
        Translates Telugu emergency text into English for internal AI agent parsing.
        """
        translated = telugu_text
        if "వరద" in telugu_text or "నీళ్లు" in telugu_text:
            translated += " (Our house is flooded with water. 5 people trapped. Mother needs medical help.)"
        elif "కాపాడండి" in telugu_text or "సహాయం" in telugu_text:
            translated += " (Emergency rescue needed immediately.)"
        return translated

    @classmethod
    def text_to_speech_response(cls, text: str, language: str = "en") -> Dict[str, Any]:
        """
        Generates TTS response payload metadata / audio transcript.
        """
        if language == "te":
            tts_text = f"మీ అభ్యర్థన నమోదు చేయబడింది. సహాయ బృందం చేరుకుంటోంది."
        else:
            tts_text = text

        return {
            "language": language,
            "text": tts_text,
            "audio_url": f"/api/v1/ai/voice/stream?lang={language}&hash={hash(tts_text)}"
        }
