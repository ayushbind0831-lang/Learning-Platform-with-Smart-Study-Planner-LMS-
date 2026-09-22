from typing import Optional
from datetime import date
from datetime import datetime
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
        from datetime import datetime

class TaskCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = 1.0
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    estimated_hours: float
    priority: str
    status: str

    class Config:
        from_attributes = True
class PlannerRequest(BaseModel):
    available_hours: float
    start_time: Optional[str] = "18:00"   # 24-hour format, e.g. "14:30"

class ScheduleSlot(BaseModel):
    task_id: int
    title: str
    course: Optional[str]
    priority: str
    allocated_hours: float
    fully_scheduled: bool
    start_time: str
    end_time: str