from typing import Optional
from datetime import date

from pydantic import BaseModel, EmailStr
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CourseCreate(BaseModel):
    course_name: str
    description: Optional[str] = None
    difficulty: Optional[str] = "Medium"
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CourseOut(BaseModel):
    id: int
    course_name: str
    description: Optional[str] = None
    difficulty: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        from_attributes = True