from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.note import TaskNote
from app.models.task import Task
from app.schemas.note import NoteCreate, NoteOut
from app.api.tasks import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=NoteOut)
async def create_note(task_id: int, data: NoteCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    note = TaskNote(**