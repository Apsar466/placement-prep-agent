import logging
from database import mongo_client
from agents.master_agent import master_agent
from models.roadmap import RoadmapRequest, RoadmapResponse

logger = logging.getLogger(__name__)

class RoadmapService:
    @staticmethod
    async def generate_strategy_roadmap(request: RoadmapRequest, user_id: str = "user_001") -> RoadmapResponse:
        logger.info(f"Executing Roadmap Service for user {user_id}")
        
        ai_result = await master_agent.route_task(
            task_type="ROADMAP", 
            payload={
                "target_companies": request.target_companies,
                "hours_per_day": request.hours_per_day,
                "focus_areas": request.focus_areas
            }
        )

        response_data = RoadmapResponse(
            plan_title=ai_result.get("plan_title", "Custom Placement Roadmap"),
            overall_strategy=ai_result.get("overall_strategy", ""),
            weeks=ai_result.get("weeks", [])
        )

        db = mongo_client.placement_db
        await db.roadmaps.insert_one({
            "user_id": user_id,
            "target_companies": request.target_companies,
            **response_data.model_dump()
        })
        
        logger.info(f"Roadmap saved for user {user_id}")
        return response_data