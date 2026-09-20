from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ChapterBase(BaseModel):
    chapter_number: int
    chapter_name: str = Field(..., max_length=150)
    description: str = ""
    google_drive_file_id: str = ""
    price: int = 269
    status: str = "active"


class ChapterCreate(ChapterBase):
    subject_id: int


class ChapterUpdate(BaseModel):
    chapter_number: Optional[int] = None
    chapter_name: Optional[str] = None
    description: Optional[str] = None
    google_drive_file_id: Optional[str] = None
    price: Optional[int] = None
    status: Optional[str] = None


class ChapterResponse(ChapterBase):
    id: int
    subject_id: int
    created_at: datetime
