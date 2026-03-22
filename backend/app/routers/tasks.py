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
    # Fetch created_at from DB explicitly
    await db.execute(
        select(Task).where(Task.id == task.id)
    )
    await db.refresh(task)
    return task