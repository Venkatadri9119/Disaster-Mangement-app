# Disaster AI - Emergency Response Platform

"Tell us what happened. AI finds the right help."

Disaster AI is a production-grade, AI-first disaster management and emergency response platform built for citizens, volunteers/NGOs, and disaster authorities.

## Monorepo Layout
- `/mobile` - Flutter application for Citizens & Volunteers (Web & Mobile compatible)
- `/admin` - Next.js 14 Web Command Center Dashboard
- `/backend` - FastAPI Python Service (REST, WebSockets, PostGIS geospatial engine)
- `/ai` - AI Agent Engine, Pydantic Structured Extractor, Multilingual STT/TTS
- `/database` - PostGIS Schema, Migrations, and Seed Data generator
- `/infra` - Docker Compose configuration & Deployment manifests
- `/docs` - Architecture documentation & API references
