from app import models
from fastapi import FastAPI

app = FastAPI(title="StudySmart API")

@app.get("/")
def read_root():
    return {"message": "StudySmart backend is running"}
from fastapi import FastAPI
from app.database import engine, Base
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StudySmart API")

@app.get("/")
def read_root():
    return {"message": "StudySmart backend is running"}