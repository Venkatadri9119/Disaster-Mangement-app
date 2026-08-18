from typing import Dict, Any, Tuple

class PriorityEngine:
    """
    Evaluates emergency priority using deterministic criteria + AI signals.
    Output: 'CRITICAL', 'HIGH', or 'NORMAL'
    """
    @staticmethod
    def calculate_priority(extraction: Dict[str, Any], user_text: str = "") -> Tuple[str, str]:
        reasons = []
        score = 0

        disaster_type = extraction.get("disaster_type", "").lower()
        people_count = extraction.get("people_count", 1)
        medical_need = extraction.get("medical_need", False)
        evacuation_required = extraction.get("evacuation_required", False)
        missing_person = extraction.get("missing_person", False)
        
        # High impact keywords in text
        text_lower = user_text.lower()
        critical_keywords = ["trapped", "drowning", "bleeding", "unconscious", "heart attack", "collapsed", "pregnant", "infant", "baby", "elderly", "rising water", "fire", "smoke"]
        
        for kw in critical_keywords:
            if kw in text_lower:
                score += 3
                reasons.append(f"Trigger keyword detected: '{kw}'")

        if medical_need:
            score += 4
            reasons.append("Immediate medical assistance required")

        if evacuation_required:
            score += 3
            reasons.append("Immediate evacuation or boat rescue required")

        if disaster_type in ["flood", "fire", "building_collapse"] and people_count >= 3:
            score += 3
            reasons.append(f"Multiple victims ({people_count} people) in severe disaster type ({disaster_type})")

        if missing_person:
            score += 2
            reasons.append("Missing person report attached")

        # Determine Priority
        if score >= 5:
            priority = "CRITICAL"
        elif score >= 2:
            priority = "HIGH"
        else:
            priority = "NORMAL"

        explanation = "; ".join(reasons) if reasons else "Standard assistance request"
        return priority, explanation
