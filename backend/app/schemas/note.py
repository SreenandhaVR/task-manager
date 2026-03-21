from pydantic import BaseModel
from datetime import datetime
from app.models.note import NoteType

class NoteCreate(BaseModel):
    note_type: NoteType
    content: str

class NoteOut(BaseModel):
    id: int
    task_id: int
    note_type: NoteType
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
