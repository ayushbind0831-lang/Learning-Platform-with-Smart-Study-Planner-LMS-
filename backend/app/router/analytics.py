from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.core.dependencies import get_current_user

router = APIRouter()
@router.get("/task-completion")
@router.get("/summary")

def generate_live_reminders(tasks):
    reminders = []
    today = date.today()

    for task in tasks:
        if task.deadline is None:
            continue

        deadline = (
            task.deadline.date()
            if hasattr(task.deadline, "date")
            else task.deadline
        )

        if deadline < today:
            reminders.append({
                "task_id": task.id,
                "message": f"Overdue: {task.title}"
            })

        elif deadline == today:
            reminders.append({
                "task_id": task.id,
                "message": f"Due today: {task.title}"
            })

    return reminders


@router.get("/")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = (
        db.query(models.Task)
        .join(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .all()
    )

    return generate_live_reminders(tasks)
