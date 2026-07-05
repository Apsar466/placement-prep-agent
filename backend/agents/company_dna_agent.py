import json
import logging
import google.generativeai as genai
from config import settings
from prompts.company_prompts import COMPANY_SYSTEM_PROMPT, COMPANY_USER_PROMPT

logger = logging.getLogger(__name__)

class CompanyDNAAgent:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=COMPANY_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )

    async def execute(self, payload: dict) -> dict:
        company_name = payload.get("company_name")
        role = payload.get("role", "SDE-1")
        rag_context = payload.get("rag_context", "No historical interview experiences found in database.")

        logger.info(f"Executing Company DNA Agent for: {company_name}")

        prompt = COMPANY_USER_PROMPT.format(
            company_name=company_name,
            role=role,
            context=rag_context
        )

        try:
            response = await self.model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Company DNA Agent execution failed: {e}")
            # Fallback mock data in case of failure or missing API key
            return {
                "company_name": company_name,
                "hiring_pattern": "Typically 3 rounds: Online Assessment, Technical Interview (DSA/Systems), and HM/HR round.",
                "technical_focus": ["Data Structures & Algorithms", "System Design (URL shortener, rate limiters)", "OOP & DB Design"],
                "sample_technical_questions": [
                    f"Explain graph traversals and implementation for {company_name}.",
                    f"Design a scalable API rate limiter for the {role} role."
                ],
                "behavioral_focus": ["STAR Method", "Company Culture Alignment", "Ownership & Team Collaboration"],
                "preparation_strategy": f"Practice DSA on LeetCode focusing on medium/hard topics. Build core CS fundamentals, and prepare behavioral stories using STAR."
            }
