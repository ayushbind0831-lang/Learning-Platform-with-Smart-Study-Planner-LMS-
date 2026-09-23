from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.router import auth, courses, tasks


Base.metadata.create_all(bind=engine)


app = FastAPI(title="StudySmart API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Auth"]
)


app.include_router(
    courses.router,
    prefix="/api/courses",
    tags=["Courses"]
)


app.include_router(
    tasks.router,
    prefix="/api/tasks",
    tags=["Tasks"]
)


@app.get("/")
def home():
    return {
        "message": "StudySmart is running"
    }
from app.router import auth, courses, tasks, planner

app.include_router(planner.router, prefix="/api/planner", tags=["Planner"])
from app.router import progress

app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
from app.router import reminders

app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])
from fastapi import FastAPI

from app.router import auth
from app.router import tasks
from app.router import reminders
from app.router import analytics

app = FastAPI(title="StudySmart API")

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    tasks.router,
    prefix="/api/tasks",
    tags=["Tasks"]
)

app.include_router(
    reminders.router,
    prefix="/api/reminders",
    tags=["Reminders"]
)
app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"]
)


@app.get("/")
def read_root():
    return {
        "message": "StudySmart is running"
    }
