from fastapi import FastAPI

app = FastAPI(title="StudySmart API")

@app.get("/")
def read_root():
    return {"message": "StudySmart backend is running"}