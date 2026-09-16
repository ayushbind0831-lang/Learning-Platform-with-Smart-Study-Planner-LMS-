from fastapi import FastAPI
from app.router.auth import router as auth_router

app = FastAPI(title="StudySmart API")

app.include_router(auth_router)


@app.get("/")
def read_root():
    return {
        "message": "StudySmart backend is running"
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.router import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def home():
    return {"message": "StudySmart is running"}