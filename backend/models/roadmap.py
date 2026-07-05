from pydantic import BaseModel, Field
from typing import List, Optional

class RoadmapRequest(BaseModel):
    target_companies: List[str] = Field(..., example=["Google", "Microsoft"])
    hours_per_day: float = Field(4.0, example=4.0)
    focus_areas: Optional[List[str]] = Field([], example=["DSA", "System Design"])

class WeeklyPlan(BaseModel):
    week_number: int
    focus: str
    daily_tasks: List[str]

class RoadmapResponse(BaseModel):
    plan_title: str
    overall_strategy: str
    weeks: List[WeeklyPlan]