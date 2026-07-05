import logging
from database import mongo_client
from agents.master_agent import master_agent
from utils.pdf_extractor import PDFExtractor
from models.resume import ResumeAnalysisResponse

logger = logging.getLogger(__name__)

class ResumeService:
    @staticmethod
    async def analyze_resume(file_bytes: bytes, user_id: str) -> ResumeAnalysisResponse:
        # 1. Extract Text
        raw_text = PDFExtractor.extract_text_from_bytes(file_bytes)
        if not raw_text:
            raise ValueError("No text could be extracted from the PDF.")

        # 2. Call Master Agent (Which handles RAG context injection implicitly in Phase 2)
        # Note: We pass empty dict for company filter as resume analysis doesn't need company specific data
        ai_result = await master_agent.route_task(
            task_type="RESUME_ANALYSIS", 
            payload={"resume_text": raw_text}
        )

        # 3. Structure Response
        response_data = ResumeAnalysisResponse(
            raw_text=raw_text,
            ats_score=ai_result.get("ats_score", 0),
            missing_keywords=ai_result.get("missing_keywords", []),
            strengths=ai_result.get("strengths", []),
            weaknesses=ai_result.get("weaknesses", []),
            project_suggestions=ai_result.get("project_suggestions", [])
        )

        # 4. Save to MongoDB
        db = mongo_client.placement_db
        await db.resume_reports.insert_one({
            "user_id": user_id,
            **response_data.model_dump()
        })
        logger.info(f"Resume analysis saved for user {user_id}")

        return response_data