import logging
from database import mongo_client

logger = logging.getLogger(__name__)

class ReadinessService:
    @staticmethod
    async def calculate_pri(user_id: str = "user_001") -> dict:
        db = mongo_client.placement_db
        
        # 1. Resume Score (Latest)
        resume_doc = await db.resume_reports.find_one(
            {"user_id": user_id}, 
            sort=[("created_at", -1)]
        )
        resume_score = resume_doc.get("ats_score", 0) if resume_doc else 0

        # 2. Interview Average Score
        interview_pipeline = [
            {"$match": {"user_id": user_id, "final_report.overall_score": {"$exists": True}}},
            {"$group": {"_id": "$user_id", "avg_score": {"$avg": "$final_report.overall_score"}}}
        ]
        interview_agg = await db.interview_history.aggregate(interview_pipeline).to_list(1)
        interview_avg = interview_agg[0]["avg_score"] if interview_agg else 0

        # 3. Companies Prepared Count
        companies_prep = await db.company_preparation.distinct("company_name", {"user_id": user_id})
        companies_score = min(len(companies_prep) * 10, 100)

        # 4. Skills Analyzed Count
        skills_count = await db.skill_analysis.count_documents({"user_id": user_id})
        skills_score = min(skills_count * 10, 100)

        # 5. Calculate Proprietary PRI (Weighted Average)
        pri_score = (
            (resume_score * 0.30) + 
            (interview_avg * 0.40) + 
            (companies_score * 0.15) + 
            (skills_score * 0.15)
        )

        logger.info(f"Calculated PRI for {user_id}: {pri_score:.1f}")

        return {
            "placement_readiness_index": round(pri_score, 1),
            "resume_score": float(resume_score),
            "interview_avg_score": round(interview_avg, 1),
            "companies_prepared": len(companies_prep),
            "skills_analyzed": skills_count
        }