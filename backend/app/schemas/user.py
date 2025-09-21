from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    image_data: str  # Base64 encoded image


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecognitionRequest(BaseModel):
    image_data: str  # Base64 encoded image


class RecognitionResponse(BaseModel):
    user: Optional[UserResponse] = None
    confidence: Optional[float] = None
    message: str


class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
