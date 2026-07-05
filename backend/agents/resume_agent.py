import json
import logging
import google.generativeai as genai
from config import settings
from prompts.resume_prompts import RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT

logger = logging.getLogger(__name__)

class ResumeAgent:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        # Using Gemini 2.5 Flash for fast, high-quality JSON responses
        self.model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=RESUME_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )

    async def execute(self, payload: dict) -> dict:
        resume_text = payload.get("resume_text")
        rag_context = payload.get("rag_context", "No specific ATS context available.")
        
        logger.info("Executing Resume Agent...")
        
        prompt = RESUME_USER_PROMPT.format(
            context=f"RELEVANT KNOWLEDGE BASE:\n{rag_context}\n\n",
            resume_text=resume_text
        )
        
        try:
            response = await self.model.generate_content_async(prompt)
            # Parse the JSON string response
            return json.loads(response.text)
        except json.JSONDecodeError:
            logger.error("Gemini returned invalid JSON for Resume Analysis.")
            return {"error": "Failed to parse AI response."}
        except Exception as e:
            logger.error(f"Resume Agent execution failed: {e}")
            raise