from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routers import auth, tasks, notes
from app.database import engine, Base
from app import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(notes.router)


@app.get("/")
async def root():
    return {"message": "Task Manager API is running"}