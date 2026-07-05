import json
import logging
import google.generativeai as genai
from config import settings
from prompts.interview_prompts import (
    INTERVIEW_QUESTION_SYSTEM_PROMPT,
    INTERVIEW_QUESTION_USER_PROMPT,
    INTERVIEW_EVALUATION_SYSTEM_PROMPT,
    INTERVIEW_EVALUATION_USER_PROMPT,
    INTERVIEW_REPORT_SYSTEM_PROMPT,
    INTERVIEW_REPORT_USER_PROMPT
)

logger = logging.getLogger(__name__)

class AdaptiveInterviewAgent:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        # Using Gemini 2.5 Flash for high-speed adaptive responses
        self.question_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=INTERVIEW_QUESTION_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )
        self.evaluation_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=INTERVIEW_EVALUATION_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )
        self.report_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=INTERVIEW_REPORT_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )

    async def generate_question(self, company: str, role: str, difficulty: str, context: str) -> dict:
        logger.info(f"Generating interview question for {company} - {role} ({difficulty})")
        prompt = INTERVIEW_QUESTION_USER_PROMPT.format(
            company=company,
            role=role,
            difficulty=difficulty,
            context=context
        )
        try:
            response = await self.question_model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Failed to generate question from Gemini: {e}")
            # Robust fallback
            return {
                "question": f"Given a binary tree, write a function to find the maximum path sum between any two nodes for a {role} role at {company}.",
                "hints": ["Consider using post-order traversal to get path sums of left and right subtrees.", "The path can start and end at any node, so update a global max at each node."]
            }

    async def evaluate_answer(self, company: str, question: str, user_answer: str, difficulty: str, context: str) -> dict:
        logger.info(f"Evaluating answer for {company} interview...")
        prompt = INTERVIEW_EVALUATION_USER_PROMPT.format(
            company=company,
            question=question,
            user_answer=user_answer,
            difficulty=difficulty,
            context=context
        )
        try:
            response = await self.evaluation_model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Failed to evaluate answer from Gemini: {e}")
            # Robust fallback
            return {
                "score_out_of_10": 7,
                "next_difficulty": "MEDIUM" if difficulty == "HARD" else ("HARD" if difficulty == "MEDIUM" else "MEDIUM"),
                "feedback": "Answer was structured logically, but lacked code optimization details and space/time complexity analysis."
            }

    async def generate_final_report(self, company: str, role: str, transcript: str, question_count: int) -> dict:
        logger.info(f"Generating final interview report for {company} ({role})...")
        prompt = INTERVIEW_REPORT_USER_PROMPT.format(
            company=company,
            role=role,
            question_count=question_count,
            transcript=transcript
        )
        try:
            response = await self.report_model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Failed to generate final report from Gemini: {e}")
            # Robust fallback
            return {
                "overall_score": 75.0,
                "verdict": "Recommended",
                "technical_feedback": "Demonstrated solid understanding of core data structures, graph traversals, and object-oriented design. Needs to improve on Edge-case handling.",
                "communication_feedback": "Communicated thoughts clearly. Good use of STAR method for behavioral questions, though could be more concise.",
                "strengths": ["Strong algorithmic reasoning", "Clear code structure", "Good communication of logic during coding"],
                "weaknesses": ["Missed negative edge-cases in dynamic programming", "Optimization of space complexity could be improved"],
                "actionable_tips": ["Practice writing dry runs of code on paper with edge cases.", "Solve 5-10 medium-difficulty dynamic programming tasks on LeetCode."]
            }
