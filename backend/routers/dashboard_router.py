import logging
from fastapi import APIRouter, HTTPException
from services.readiness_service import ReadinessService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/dashboard/metrics")
async def get_dashboard_metrics(user_id: str = "user_001"):
    """
    Aggregates data from MongoDB to calculate the Placement Readiness Index (PRI)
    and retrieve historical metrics for the Dashboard OS.
    """
    try:
        metrics = await ReadinessService.calculate_pri(user_id)
        return metrics
    except Exception as e:
        logger.error(f"Failed to fetch dashboard metrics: {e}")
        raise HTTPException(status_code=500, detail="Error loading dashboard metrics.")