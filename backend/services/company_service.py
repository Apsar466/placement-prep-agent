import logging
import database
from agents.master_agent import master_agent
from models.company import CompanyPrepRequest, CompanyPrepResponse

logger = logging.getLogger(__name__)

class CompanyPrepService:
    @staticmethod
    async def generate_prep_guide(request: CompanyPrepRequest) -> CompanyPrepResponse:
        logger.info(f"Executing Company Prep Service for {request.company_name}")
        
        ai_result = await master_agent.route_task(
            task_type="COMPANY_PREP", 
            payload={
                "company_name": request.company_name,
                "role": request.role
            }
        )

        response_data = CompanyPrepResponse(
            company_name=request.company_name,
            hiring_pattern=ai_result.get("hiring_pattern", ""),
            technical_focus=ai_result.get("technical_focus", []),
            sample_technical_questions=ai_result.get("sample_technical_questions", []),
            behavioral_focus=ai_result.get("behavioral_focus", []),
            preparation_strategy=ai_result.get("preparation_strategy", "")
        )

        if database.mongo_client:
            db = database.mongo_client.placement_db
            await db.company_preparation.update_one(
                {"company_name": request.company_name, "role": request.role},
                {"$set": response_data.model_dump()},
                upsert=True
            )
            logger.info(f"Company prep cached/saved for {request.company_name}")
        else:
            logger.warning("MongoDB client not connected, skipping caching.")
        
        return response_data