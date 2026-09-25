from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.router import auth, courses, tasks, planner, progress, reminders, analytics


# Create all database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="StudySmart API")


# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Router registration ──────────────────────────────────────────────
app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(courses.router,   prefix="/api/courses",   tags=["Courses"])
app.include_router(tasks.router,     prefix="/api/tasks",     tags=["Tasks"])
app.include_router(planner.router,   prefix="/api/planner",   tags=["Planner"])
app.include_router(progress.router,  prefix="/api/progress",  tags=["Progress"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/")
def home():
    return {"message": "StudySmart is running"}
