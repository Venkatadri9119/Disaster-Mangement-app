# Disaster AI — Production Deployment Guide

This guide provides step-by-step instructions to deploy the **Disaster AI** emergency response platform to production cloud environments.

---

## 🚀 Option 1: 1-Click Docker Deployment (Recommended for Single Server / AWS EC2 / DigitalOcean)

The platform includes a pre-configured Docker Compose file running **PostgreSQL/PostGIS**, **Redis**, **FastAPI Backend**, and **Next.js Web Command Center**.

### Steps:
1. **Clone the repository onto your server**:
   ```bash
   git clone https://github.com/your-org/disaster-ai.git
   cd disaster-ai
   ```

2. **Launch all production containers with Docker Compose**:
   ```bash
   cd infra
   docker-compose up -d --build
   ```

3. **Verify running services**:
   - Next.js Web Application: `http://<your-server-ip>:3001`
   - FastAPI Backend API: `http://<your-server-ip>:8000/docs`
   - PostGIS Database: `port 5432`

---

## 🌐 Option 2: Cloud Deployment (Vercel + Render / Railway)

### 1. Deploy Backend to Render or Railway (FastAPI)
1. Go to [Render](https://render.com) or [Railway](https://railway.app).
2. Create a new **Web Service** and connect your GitHub repository.
3. Set Root Directory: `backend`
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `DB_URL`: `sqlite:///./disaster_ai.db` (or your PostgreSQL database connection URL)
   - `OPENAI_API_KEY`: `your-openai-api-key`
7. Click **Deploy**. Note your live API URL (e.g. `https://disaster-ai-backend.onrender.com`).

### 2. Deploy Web App to Vercel (Next.js)
1. Go to [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. Set Framework Preset: **Next.js**
4. Set Root Directory: `admin`
5. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://disaster-ai-backend.onrender.com/api/v1`
6. Click **Deploy**. Your live app will be live at `https://disaster-ai.vercel.app`!

---

## 📱 Option 3: Build Android Mobile Application (APK)

To build the standalone Flutter mobile app for Android:

```bash
cd disaster-ai/mobile

# Get Flutter dependencies
flutter pub get

# Build Release APK
flutter build apk --release
```

The compiled APK will be generated at:
`mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## 🔐 Environment Variables Reference

| Variable Name | Default / Example Value | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Live FastAPI backend URL |
| `DB_URL` | `sqlite:///./disaster_ai.db` | PostGIS / SQLite connection string |
| `OPENAI_API_KEY` | `sk-...` | OpenAI LLM key for voice & triage agent |
| `SECRET_KEY` | `production-secret-key-2026` | JWT Auth secret key |
