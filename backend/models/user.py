from pydantic import BaseModel, Field
from typing import List, Optional

class UserCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: str = Field(..., regex=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    target_role: Optional[str] = "SDE-1"
    current_skills: Optional[List[str]] = []
    overall_readiness_score: Optional[float] = 0.0

    class Config:
        orm_mode = True