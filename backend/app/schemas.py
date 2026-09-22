from typing import Optional
from datetime import date, datetime

from pydantic import BaseModel, EmailStr


# =========================================================
# USER SCHEMAS
# =========================================================

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


# =========================================================
# COURSE SCHEMAS
# =========================================================

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


# =========================================================
# TASK SCHEMAS
# =========================================================

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
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: float
    priority: str
    status: str

    class Config:
        from_attributes = True


# =========================================================
# STUDY PLANNER SCHEMAS
# =========================================================

class PlannerRequest(BaseModel):
    available_hours: float
    start_time: Optional[str] = "18:00"


class ScheduleSlot(BaseModel):
    task_id: int
    title: str
    course: Optional[str] = None
    priority: str
    allocated_hours: float
    fully_scheduled: bool
    start_time: str
    end_time: str

class CourseProgress(BaseModel):
    total_tasks: int
    completed_tasks: int
    progress_percentage: float