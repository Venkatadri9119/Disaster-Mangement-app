import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.session import Base, engine
from app.api.v1.endpoints import (
    auth, users, emergencies, volunteers, shelters, resources, ai_routes, admin_routes, websockets
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Disaster AI — Emergency Response Platform API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(emergencies.router, prefix=f"{settings.API_V1_STR}/emergencies", tags=["Emergencies"])
app.include_router(volunteers.router, prefix=f"{settings.API_V1_STR}/volunteers", tags=["Volunteers"])
app.include_router(shelters.router, prefix=f"{settings.API_V1_STR}/shelters", tags=["Shelters"])
app.include_router(resources.router, prefix=f"{settings.API_V1_STR}/resources", tags=["Resources"])
app.include_router(ai_routes.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Engine"])
app.include_router(admin_routes.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin Command Center"])
app.include_router(websockets.router, tags=["WebSockets"])

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "Tell us what happened. AI finds the right help.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
