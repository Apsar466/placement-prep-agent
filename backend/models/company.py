from pydantic import BaseModel, Field
from typing import List

class CompanyPrepRequest(BaseModel):
    company_name: str = Field(..., example="Amazon")
    role: str = Field("SDE-1", example="SDE-1")

class CompanyPrepResponse(BaseModel):
    company_name: str
    hiring_pattern: str
    technical_focus: List[str]
    sample_technical_questions: List[str]
    behavioral_focus: List[str]
    preparation_strategy: str