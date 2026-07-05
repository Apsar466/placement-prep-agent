import json
import logging
import google.generativeai as genai
from config import settings
from prompts.career_prompts import CAREER_SYSTEM_PROMPT, CAREER_USER_PROMPT

logger = logging.getLogger(__name__)

class CareerAgent:
    def __init__(self):
        self.has_api_key = settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here"
        if self.has_api_key:
            try:
                genai.configure(api_key=settings.gemini_api_key)
                self.model = genai.GenerativeModel(
                    model_name='gemini-2.5-flash-preview-05-20',
                    system_instruction=CAREER_SYSTEM_PROMPT,
                    generation_config={"response_mime_type": "application/json"}
                )
            except Exception as e:
                logger.error(f"Failed to initialize Gemini model in CareerAgent: {e}")
                self.has_api_key = False

    async def execute(self, payload: dict) -> dict:
        target_role = payload.get("target_role")
        current_skills = ", ".join(payload.get("current_skills", []))
        experience = payload.get("experience", "Fresher")
        rag_context = payload.get("rag_context", "")
        
        logger.info(f"Executing Career Agent for role: {target_role}")
        
        if not self.has_api_key:
            logger.warning("Bypassing Gemini call in CareerAgent due to missing/placeholder API key. Returning mock data.")
            return {
                "skill_gap_analysis": [
                    {"skill": "System Design & Scalability", "status": "missing", "priority": "high"},
                    {"skill": "Docker Containerization", "status": "missing", "priority": "medium"},
                    {"skill": "Relational DB Indexing & Joins", "status": "weak", "priority": "medium"}
                ],
                "learning_roadmap": [
                    "1. Master System Design fundamentals (Load Balancers, Caching, CDN).",
                    "2. Build Docker containers for multi-service apps.",
                    "3. Practice writing optimized query joins on LeetCode SQL 50."
                ],
                "recommended_resources": [
                    "System Design Primer (GitHub Repository)",
                    "Docker & Kubernetes Complete Guide (Udemy)",
                    "LeetCode Database Practice Sheet"
                ]
            }
            
        prompt = CAREER_USER_PROMPT.format(
            target_role=target_role,
            experience=experience,
            current_skills=current_skills,
            context=f"CONTEXT:\n{rag_context}"
        )
        
        try:
            response = await self.model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Career Agent execution failed: {e}")
            return {
                "skill_gap_analysis": [
                    {"skill": "System Design", "status": "missing", "priority": "high"}
                ],
                "learning_roadmap": [
                    "1. Master system design basics."
                ],
                "recommended_resources": [
                    "System Design Primer"
                ]
            }