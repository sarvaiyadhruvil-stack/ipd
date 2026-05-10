from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SentenceAnalysis(BaseModel):
    sentence: str
    ai_probability: float
    human_probability: float
    risk_level: str
    reasons: List[str]

class SubmissionResult(BaseModel):
    submission_id: int
    file_name: str
    ai_probability: float
    human_probability: float
    confidence_level: str
    reliability_score: int
    explanations: List[str]
    prompt_leakage_flags: List[str]
    sentence_analysis: List[SentenceAnalysis]

class SubmissionHistoryResponse(BaseModel):
    id: int
    file_name: str
    ai_probability: float
    human_probability: float
    confidence_level: str
    created_at: datetime

    class Config:
        from_attributes = True
