from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.database import get_db
from app.models import Task, TaskStatus
from app.schemas import TaskCreate, TaskUpdate, TaskOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskOut)
async def create_task(
    data: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = Task(
        title=data.title,
        description=data.description,
        status=data.status,
        assigned_to=data.assigned_to,
        created_by=current_user.id
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    await db.refresh(task)
    return task


@router.get("/", response_model=list[TaskOut])
async def get_tasks(
    status: Optional[TaskStatus] = None,
    assigned_to: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = select(Task)
    if status:
        query = query.where(Task.status == status)
    if assigned_to:
        query = query.where(Task.assigned_to == assigned_to)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{task_id}", response_model=TaskOut)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: int,
    data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task: