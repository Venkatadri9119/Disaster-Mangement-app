# Disaster AI — API Documentation

## Base URL
`http://localhost:8000/api/v1`

## Authentication (`/auth`)
- `POST /auth/request-otp` — Request 6-digit OTP for phone
- `POST /auth/verify-otp` — Verify OTP and receive JWT access token

## Users (`/users`)
- `GET /users/me` — Fetch current user profile & role permissions
- `POST /users/me/location` — Update real-time GPS coordinates

## Emergency Requests (`/emergencies`)
- `POST /emergencies` — Create new emergency request with automatic AI priority assessment
- `GET /emergencies` — List all emergencies with priority & status filters
- `GET /emergencies/{id}` — Fetch detailed request tracker status & assigned team
- `POST /emergencies/{id}/assign` — Dispatch volunteer to emergency
- `PATCH /emergencies/{id}/priority` — Admin manual priority override with audit log

## AI Engine (`/ai`)
- `POST /ai/chat` — Conversational assistant endpoint (handles English & Telugu text)
- `POST /ai/voice` — Multilingual Speech-to-Text & Text-to-Speech pipeline
- `POST /ai/analyze` — Computer vision image classification for damage assessment

## Admin Command Center (`/admin`)
- `GET /admin/dashboard` — Command center metrics, active emergencies, shelter occupancy
- `POST /admin/simulation/trigger` — Hackathon presentation demo mode (Flood, Cyclone, Fire, Earthquake)

## WebSockets
- `ws://localhost:8000/ws` — Real-time event channel for map markers, volunteer location movements, and status transitions.
