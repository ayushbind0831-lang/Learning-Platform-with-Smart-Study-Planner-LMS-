from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    courses = (
        db.query(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .all()
    )
    tasks = (
        db.query(models.Task)
        .join(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .all()
    )

    today = date.today()
    total_courses = len(courses)
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "Completed")
    pending_tasks = sum(1 for t in tasks if t.status != "Completed")

    overdue_tasks = 0
    for t in tasks:
        if t.status != "Completed" and t.deadline:
            d = t.deadline.date() if hasattr(t.deadline, "date") else t.deadline
            if d < today:
                overdue_tasks += 1

    completion_rate = (
        round((completed_tasks / total_tasks) * 100, 1) if total_tasks > 0 else 0.0
    )

    return {
        "total_courses": total_courses,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "overdue_tasks": overdue_tasks,
        "completion_rate": completion_rate,
    }


@router.get("/task-completion")
def get_task_completion_distribution(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = (
        db.query(models.Task)
        .join(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .all()
    )

    statuses = {"Pending": 0, "In Progress": 0, "Completed": 0}
    for t in tasks:
        if t.status in statuses:
            statuses[t.status] += 1
        else:
            statuses["Pending"] += 1

    return {
        "labels": list(statuses.keys()),
        "values": list(statuses.values()),
    }
