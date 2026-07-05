from pydantic import BaseModel, Field
from typing import List

class ResumeAnalysisRequest(BaseModel):
    pass # Handled via Form data (file upload)

class ResumeAnalysisResponse(BaseModel):
    raw_text: str = Field(..., description="Extracted text from resume")
    ats_score: int = Field(..., description="ATS compatibility score 0-100")
    missing_keywords: List[str] = Field(..., description="Critical ATS keywords missing")
    strengths: List[str] = Field(..., description="Strong points of the resume")
    weaknesses: List[str] = Field(..., description="Areas needing improvement")
    project_suggestions: List[str] = Field(..., description="Actionable ideas to improve projects section")