from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.services.progess_service import calculate_course_progress
from app.router.auth import get_current_user


router = APIRouter()


# =========================================================
# GET ALL COURSES
# =========================================================

@router.get("/")
def get_courses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    courses = (
        db.query(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .all()
    )

    return courses


# =========================================================
# GET COURSE PROGRESS
# =========================================================

@router.get(
    "/{course_id}/progress",
    response_model=schemas.CourseProgress
)
def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = (
        db.query(models.Course)
        .filter(
            models.Course.id == course_id,
            models.Course.user_id == current_user.id
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return calculate_course_progress(db, course_id)


# =========================================================
# GET SINGLE COURSE
# =========================================================

@router.get("/{course_id}")
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = (
        db.query(models.Course)
        .filter(
            models.Course.id == course_id,
            models.Course.user_id == current_user.id
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


# =========================================================
# CREATE COURSE
# =========================================================

@router.post("/", response_model=schemas.CourseOut)
def create_course(
    course: schemas.CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_course = models.Course(
        user_id=current_user.id,
        course_name=course.course_name,
        description=course.description,
        difficulty=course.difficulty,
        start_date=course.start_date,
        end_date=course.end_date
    )

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course


# =========================================================
# UPDATE COURSE
# =========================================================

@router.put("/{course_id}", response_model=schemas.CourseOut)
def update_course(
    course_id: int,
    course_data: schemas.CourseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = (
        db.query(models.Course)
        .filter(
            models.Course.id == course_id,
            models.Course.user_id == current_user.id
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    update_data = course_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)

    return course


# =========================================================
# DELETE COURSE
# =========================================================

@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = (
        db.query(models.Course)
        .filter(
            models.Course.id == course_id,
            models.Course.user_id == current_user.id
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    db.delete(course)
    db.commit()

    return {
        "message": "Course deleted successfully"
    }