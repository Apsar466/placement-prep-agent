import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import init_db, close_db
from routers import health
from routers.resume_router import router as resume_router
from routers.skill_router import router as skill_router
from routers.company_router import router as company_router
from routers.interview_router import router as interview_router
from routers.roadmap_router import router as roadmap_router
from routers.dashboard_router import router as dashboard_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB connections
    logger.info("Starting Placement Agent Backend...")
    await init_db()
    yield
    # Shutdown: Close DB connections
    logger.info("Shutting down...")
    await close_db()

app = FastAPI(
    title="Placement Preparation Agent API",
    description="AI-Powered Multi-Agent Placement Mentor",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration for Spatial OS Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost"], # Add production URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(dashboard_router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(resume_router, prefix="/api/v1", tags=["Resume"])
app.include_router(skill_router, prefix="/api/v1", tags=["Skills"])
app.include_router(company_router, prefix="/api/v1", tags=["Company"])
app.include_router(interview_router, prefix="/api/v1", tags=["Interview"])
app.include_router(roadmap_router, prefix="/api/v1", tags=["Roadmap"])

@app.get("/")
async def root():
    return {"message": "Placement Preparation Agent API is running."}