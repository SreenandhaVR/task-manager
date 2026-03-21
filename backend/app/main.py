from fastapi import FastAPI
from app.routers import auth, tasks, notes
from app.database import engine, Base
from app import models

app = FastAPI()

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(notes.router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {"message": "Task Manager API is running"}