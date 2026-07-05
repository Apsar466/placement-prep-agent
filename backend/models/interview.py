from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StartInterviewRequest(BaseModel):
    company_name: str = Field(..., example="Google")
    role: str = Field("SDE-1", example="SDE-1")
    interview_type: str = Field("TECHNICAL_DSA", example="TECHNICAL_DSA")

class EvaluateAnswerRequest(BaseModel):
    session_id: str = Field(..., description="The active interview session ID")
    user_answer: str = Field(..., min_length=1)
    finish_interview: bool = Field(False, description="Set to true to end the interview and get the final report")

class InterviewResponse(BaseModel):
    is_finished: bool
    session_id: str
    question: Optional[str] = None
    difficulty: Optional[str] = None
    hints: Optional[List[str]] = None
    final_report: Optional[Dict[str, Any]] = None