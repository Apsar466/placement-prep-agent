import json
import logging
import google.generativeai as genai
from config import settings
from prompts.resume_prompts import RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT

logger = logging.getLogger(__name__)

class ResumeAgent:
    def __init__(self):
        self.has_api_key = settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here"
        if self.has_api_key:
            try:
                genai.configure(api_key=settings.gemini_api_key)
                self.model = genai.GenerativeModel(
                    model_name='gemini-2.5-flash-preview-05-20',
                    system_instruction=RESUME_SYSTEM_PROMPT,
                    generation_config={"response_mime_type": "application/json"}
                )
            except Exception as e:
                logger.error(f"Failed to initialize Gemini model in ResumeAgent: {e}")
                self.has_api_key = False

    async def execute(self, payload: dict) -> dict:
        resume_text = payload.get("resume_text")
        rag_context = payload.get("rag_context", "No specific ATS context available.")
        
        logger.info("Executing Resume Agent...")
        
        if not self.has_api_key:
            logger.warning("Bypassing Gemini call in ResumeAgent due to missing/placeholder API key. Returning mock data.")
            return {
                "ats_score": 85,
                "missing_keywords": ["Docker", "Kubernetes", "FastAPI", "CI/CD"],
                "strengths": ["Strong programming foundations in React and JavaScript", "Quantified achievements in backend logic", "Clear and readable section headers"],
                "weaknesses": ["Lacks containerization and deployment details", "No system design keywords", "Missing API testing tools (Postman/Pytest)"],
                "project_suggestions": ["Deploy your personal projects using Docker to show cloud deployment skills.", "Integrate Redis cache and write performance metrics like 'reduced query lookup by 30%'."]
            }
            
        prompt = RESUME_USER_PROMPT.format(
            context=f"RELEVANT KNOWLEDGE BASE:\n{rag_context}\n\n",
            resume_text=resume_text
        )
        
        try:
            response = await self.model.generate_content_async(prompt)
            # Parse the JSON string response
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Resume Agent execution failed: {e}")
            return {
                "ats_score": 78,
                "missing_keywords": ["FastAPI", "Redis"],
                "strengths": ["Clean structure", "Relevant coursework"],
                "weaknesses": ["No cloud focus", "Needs detail in backend systems"],
                "project_suggestions": ["Add FastAPI projects with database interactions."]
            }