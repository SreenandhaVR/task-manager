from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import TaskNote, Task
from app.schemas import NoteCreate, NoteOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["notes"])


@router.post("/{task_id}/notes/", response_model=NoteOut)
async def create_note(
    task_id: int,
    data: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    note = TaskNote(
        task_id=task_id,
        content=data.content,
        note_type=data.note_type
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note


@router.get("/{task_id}/notes/", response_model=list[NoteOut])
async def get_notes(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(TaskNote).where(TaskNote.task_id == task_id)
    )
    return result.scalars().all()