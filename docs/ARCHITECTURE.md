# Disaster AI — System Architecture Specification

## Vision & Core Flow
Disaster AI provides an AI-first emergency response platform:
```
USER SPEAKS / TYPES (EN / TE) ──► STT & INTENT EXTRACTION ──► AI PRIORITY ENGINE ──► POSTGIS SPATIAL SEARCH ──► VOLUNTEER DISPATCH ──► LIVE COMMAND MAP
```

## User Roles & Access Control (RBAC)
1. **Citizen**: Conversational AI interface (ChatGPT-style), quick prompts, SOS instant trigger, multilingual voice, emergency tracker.
2. **Volunteer / NGO**: Duty status switcher (AVAILABLE/UNAVAILABLE), critical nearby requests feed, match score, turn-by-turn navigation.
3. **Admin / Disaster Authority**: Command Center Dashboard, PostGIS live geospatial map, AI hotspot clustering, priority override, resource/shelter management, Hackathon Demo simulation controller.

## AI Agent Guardrails & Controlled Tool Execution
The LLM engine generates structured tool call proposals. **No raw SQL or direct DB modifications are permitted by the LLM.**
Supported tools:
- `get_user_location()`
- `reverse_geocode(lat, lon)`
- `create_emergency_request(details)`
- `update_emergency_request(id, updates)`
- `find_nearby_shelters(lat, lon, radius_km)`
- `find_available_volunteers(lat, lon, skills)`
- `calculate_route(origin, destination)`
- `assign_volunteer(request_id, volunteer_id)`
- `report_missing_person(details)`

## Hybrid Matching Score Formula
$$\text{Score} = \text{DistanceScore} (40\%) + \text{SkillMatch} (30\%) + \text{Availability} (15\%) + \text{MedicalCert} (10\%) + \text{WorkloadPenalty} (5\%)$$
