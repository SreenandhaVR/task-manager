from fastapi import FastAPI
from app.routers import auth
from app.database import engine, Base
from app import models

app = FastAPI()

app.include_router(auth.router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {"message": "Task Manager API is running"}