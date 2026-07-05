import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from services.roadmap_service import RoadmapService

router = APIRouter()
logger = logging.getLogger(__name__)

# --- Pydantic Schemas (Assuming models/roadmap.py might not be generated yet) ---
class RoadmapRequest(BaseModel):
    target_companies: List[str] = Field(..., example=["Google", "Microsoft"])
    hours_per_day: float = Field(4.0, example=4.0)
    focus_areas: Optional[List[str]] = Field([], example=["DSA", "System Design"])

class WeeklyPlan(BaseModel):
    week_number: int
    focus: str
    daily_tasks: List[str]

class RoadmapResponse(BaseModel):
    plan_title: str
    overall_strategy: str
    weeks: List[WeeklyPlan]
# ----------------------------------------------------------------------

@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """
    Generates a personalized 30-day placement preparation roadmap.
    Utilizes the Placement Strategy Agent.
    """
    try:
        logger.info(f"Generating roadmap for companies: {request.target_companies}")
        service = RoadmapService()
        result = await service.generate_strategy_roadmap(request)
        return result
    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate roadmap.")