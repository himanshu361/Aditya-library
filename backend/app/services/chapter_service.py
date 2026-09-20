from sqlalchemy.orm import Session

from app.models.chapter import Chapter


def get_chapters_for_subject(db: Session, subject_id: int):
    return db.query(Chapter).filter(Chapter.subject_id == subject_id).all()


def get_chapter_by_id(db: Session, chapter_id: int):
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()


def create_chapter(db: Session, chapter_data: dict):
    chapter = Chapter(**chapter_data)
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter
