import json
import logging
import google.generativeai as genai
from config import settings
from prompts.career_prompts import CAREER_SYSTEM_PROMPT, CAREER_USER_PROMPT

logger = logging.getLogger(__name__)

class CareerAgent:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=CAREER_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )

    async def execute(self, payload: dict) -> dict:
        target_role = payload.get("target_role")
        current_skills = ", ".join(payload.get("current_skills", []))
        experience = payload.get("experience", "Fresher")
        rag_context = payload.get("rag_context", "")
        
        logger.info(f"Executing Career Agent for role: {target_role}")
        
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
            raise