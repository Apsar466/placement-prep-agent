import logging
from fastapi import APIRouter, HTTPException
from models.career import SkillAnalysisRequest, SkillGapResponse
from services.career_service import CareerService

router = APIRouter()
logger = logging.getLogger(__name__)

# Hardcoded user_id for development, replace with JWT auth extraction later
DEFAULT_USER_ID = "user_001"

@router.post("/skill/analyze", response_model=SkillGapResponse)
async def analyze_skill_gap(request: SkillAnalysisRequest):
    """
    Analyzes the gap between a user's current skills and their target role.
    Delegates to the Career Intelligence Agent via CareerService.
    """
    try:
        logger.info(f"Starting skill analysis for user {DEFAULT_USER_ID} targeting {request.target_role}")
        service = CareerService()
        result = await service.analyze_skills(request, DEFAULT_USER_ID)
        return result
    except ValueError as e:
        logger.warning(f"Validation error in skill analysis: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in skill analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze skills. Please try again later.")