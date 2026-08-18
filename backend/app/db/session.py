import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Determine DB URL
DB_URL = "sqlite:///./disaster_ai.db"

if os.getenv("USE_POSTGRES", "false").lower() == "true":
    DB_URL = settings.DATABASE_URL
    engine = create_engine(DB_URL, pool_pre_ping=True)
else:
    engine = create_engine(DB_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
