from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.core.dependencies import get_current_user
from app.services.progress_service import calculate_course_progress

router = APIRouter()

@router.get("/overview")
def progress_overview(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    courses = db.query(models.Course).filter(models.Course.user_id == current_user.id).all()

    overview = []
    for course in courses:
        progress = calculate_course_progress(db, course.id)
        overview.append({
            "course_id": course.id,
            "course_name": course.course_name,
            **progress
        })

    return overview