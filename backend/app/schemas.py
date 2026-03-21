from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models import TaskStatus, NoteType


class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    created_at: datetime


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.todo
    assigned_to: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[int] = None

class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    created_by: int
    assigned_to: Optional[int]
    created_at: datetime


class NoteCreate(BaseModel):
    content: str
    note_type: Optional[NoteType] = NoteType.user

class NoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task_id: int
    content: str
    note_type: NoteType
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str