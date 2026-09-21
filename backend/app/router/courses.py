from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_courses():
    return {
        "message": "Courses API is working"
    }


@router.get("/{course_id}")
def get_course(course_id: int):
    return {
        "course_id": course_id,
        "message": "Course found"
    }


@router.post("/")
def create_course():
    return {
        "message": "Course created successfully"
    }