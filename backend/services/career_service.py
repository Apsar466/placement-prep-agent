import logging
from database import mongo_client
from agents.master_agent import master_agent
from models.career import SkillAnalysisRequest, SkillGapResponse

logger = logging.getLogger(__name__)

class CareerService:
    @staticmethod
    async def analyze_skills(request: SkillAnalysisRequest, user_id: str) -> SkillGapResponse:
        logger.info(f"Executing Career Service for user {user_id}")
        
        ai_result = await master_agent.route_task(
            task_type="SKILL_GAP", 
            payload={
                "target_role": request.target_role,
                "current_skills": request.current_skills,
                "experience": request.experience
            }
        )

        response_data = SkillGapResponse(
            skill_gap_analysis=ai_result.get("skill_gap_analysis", []),
            learning_roadmap=ai_result.get("learning_roadmap", []),
            recommended_resources=ai_result.get("recommended_resources", [])
        )

        db = mongo_client.placement_db
        await db.skill_analysis.insert_one({
            "user_id": user_id,
            "target_role": request.target_role,
            **response_data.model_dump()
        })
        
        logger.info(f"Career analysis saved for user {user_id}")
        return response_data