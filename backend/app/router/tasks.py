from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.core.dependencies import get_current_user

router = APIRouter()

def get_owned_course(course_id: int, db: Session, current_user: models.User):
    """Helper: confirms this course belongs to the logged-in user."""
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# CREATE
@router.post("/", response_model=schemas.TaskOut)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    get_owned_course(task.course_id, db, current_user)  # ownership check
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# READ ALL (optionally filtered by course)
@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Task).join(models.Course).filter(
        models.Course.user_id == current_user.id
    )
    if course_id:
        query = query.filter(models.Task.course_id == course_id)
    return query.all()

# READ ONE
@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).join(models.Course).filter(
        models.Task.id == task_id,
        models.Course.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# UPDATE (also used to mark tasks Completed)
@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(
    task_id: int,
    updates: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).join(models.Course).filter(
        models.Task.id == task_id,
        models.Course.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in updates.dict(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

# DELETE
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).join(models.Course).filter(
        models.Task.id == task_id,
        models.Course.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}