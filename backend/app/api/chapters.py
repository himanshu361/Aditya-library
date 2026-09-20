from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.chapter import Chapter

router = APIRouter()


@router.get("/subjects/{subject_id}/chapters")
def list_chapters(subject_id: int, db: Session = Depends(get_db)):
    chapters = db.query(Chapter).filter(Chapter.subject_id == subject_id).all()
    return [{
        "id": chapter.id,
        "subject_id": chapter.subject_id,
        "chapter_number": chapter.chapter_number,
        "chapter_name": chapter.chapter_name,
        "description": chapter.description,
        "google_drive_file_id": chapter.google_drive_file_id,
        "price": chapter.price,
        "status": chapter.status,
    } for chapter in chapters]


@router.get("/chapters/{chapter_id}")
def get_chapter(chapter_id: int, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {
        "id": chapter.id,
        "subject_id": chapter.subject_id,
        "chapter_number": chapter.chapter_number,
        "chapter_name": chapter.chapter_name,
        "description": chapter.description,
        "google_drive_file_id": chapter.google_drive_file_id,
        "price": chapter.price,
        "status": chapter.status,
    }
