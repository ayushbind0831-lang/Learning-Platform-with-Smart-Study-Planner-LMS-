from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.core.dependencies import get_current_user
from app.services.planner_service import build_schedule, assign_time_slots

router = APIRouter()

@router.post("/generate", response_model=List[schemas.ScheduleSlot])
def generate_plan(
    request: schemas.PlannerRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Get all incomplete tasks belonging to this user
    tasks = (
        db.query(models.Task)
        .join(models.Course)
        .filter(
            models.Course.user_id == current_user.id,
            models.Task.status != "Completed",
        )
        .all()
    )

    schedule = build_schedule(tasks, request.available_hours)
    schedule = assign_time_slots(schedule, request.start_time)

    return schedule