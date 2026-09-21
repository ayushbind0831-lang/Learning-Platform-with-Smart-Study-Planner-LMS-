from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def auth_home():
    return {
        "message": "Authentication API is working"
    }


@router.post("/register")
def register():
    return {
        "message": "Registration endpoint is working"
    }


@router.post("/login")
def login():
    return {
        "message": "Login endpoint is working"
    }