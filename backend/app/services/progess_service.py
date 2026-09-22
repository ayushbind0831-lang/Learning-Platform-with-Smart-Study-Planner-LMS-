from app import models
from sqlalchemy.orm import Session


def calculate_course_progress(db: Session, course_id: int):
    total = db.query(models.Task).filter(models.Task.course_id == course_id).count()
    completed = db.query(models.Task).filter(
        models.Task.course_id == course_id,
        models.Task.status == "Completed"
    ).count()

    percentage = round((completed / total) * 100, 1) if total > 0 else 0.0

    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "progress_percentage": percentage,
    }
from sqlalchemy.orm import Session

from app import models


def calculate_course_progress(
    db: Session,
    course_id: int
):
    total_tasks = (
        db.query(models.Task)
        .filter(
            models.Task.course_id == course_id
        )
        .count()
    )

    completed_tasks = (
        db.query(models.Task)
        .filter(
            models.Task.course_id == course_id,
            models.Task.status == "Completed"
        )
        .count()
    )

    if total_tasks == 0:
        progress_percentage = 0.0
    else:
        progress_percentage = (
            completed_tasks / total_tasks
        ) * 100

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "progress_percentage": progress_percentage
    }