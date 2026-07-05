from pydantic import BaseModel, Field
from typing import List, Optional

class SkillAnalysisRequest(BaseModel):
    target_role: str = Field(..., example="SDE-1")
    current_skills: List[str] = Field(..., example=["Python", "React", "Basic SQL"])
    experience: Optional[str] = Field("Fresher", example="Fresher / 6 months Internship")

class SkillGapResponse(BaseModel):
    skill_gap_analysis: List[dict] = Field(..., description="List of {skill, status: 'missing' | 'weak', priority: 'high' | 'medium'}")
    learning_roadmap: List[str] = Field(..., description="Step-by-step topics to learn in order")
    recommended_resources: List[str] = Field(..., description="Specific platforms or course types")