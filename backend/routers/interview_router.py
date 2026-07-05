import logging
from fastapi import APIRouter, HTTPException
from models.interview import StartInterviewRequest, EvaluateAnswerRequest, InterviewResponse
from services.interview_service import InterviewService

router = APIRouter()
logger = logging.getLogger(__name__)

interview_service = InterviewService()

@router.post("/interview/start", response_model=InterviewResponse)
async def start_interview_session(request: StartInterviewRequest):
    try:
        logger.info(f"Starting interview session for {request.company_name}")
        return await interview_service.start_interview(
            company=request.company_name,
            role=request.role,
            interview_type=request.interview_type
        )
    except Exception as e:
        logger.error(f"Failed to start interview: {e}")
        raise HTTPException(status_code=500, detail="Could not start interview session.")

@router.post("/interview/evaluate", response_model=InterviewResponse)
async def evaluate_interview_answer(request: EvaluateAnswerRequest):
    try:
        return await interview_service.evaluate_and_continue(
            session_id=request.session_id,
            user_answer=request.user_answer,
            finish=request.finish_interview
        )
    except ValueError as e:
        logger.warning(f"Interview session error: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to evaluate answer: {e}")
        raise HTTPException(status_code=500, detail="Error evaluating answer.")