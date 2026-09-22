from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.router import auth, courses, tasks


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(title="StudySmart API")


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Auth"]
)


# Course routes
app.include_router(
    courses.router,
    prefix="/api/courses",
    tags=["Courses"]
)


# Task routes
app.include_router(
    tasks.router,
    prefix="/api/tasks",
    tags=["Tasks"]
)


# Home route
@app.get("/")
def home():
    return {
        "message": "StudySmart is running"
    }
from app.router import auth, courses, tasks, planner

app.include_router(planner.router, prefix="/api/planner", tags=["Planner"])
from app.router import progress

app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])