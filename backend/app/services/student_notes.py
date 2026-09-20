from datetime import datetime, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.models.chapter import Chapter
from app.models.purchase import Purchase
from app.models.reading_session import ReadingSession
from app.models.user import User


def get_student_purchased_chapters(db: Session, user_id: int):
    purchases = db.query(Purchase).filter(
        Purchase.user_id == user_id,
        Purchase.status == "successful",
    ).all()

    results = []
    for purchase in purchases:
        chapter = db.query(Chapter).filter(Chapter.id == purchase.chapter_id).first()
        if chapter:
            results.append({
                "id": purchase.id,
                "chapter_id": chapter.id,
                "chapter_name": chapter.chapter_name,
                "class_name": chapter.subject.class_name if hasattr(chapter.subject, 'class_name') else None,
                "subject_name": chapter.subject.subject_name if chapter.subject else None,
                "amount": purchase.amount,
                "status": purchase.status,
                "purchased_at": purchase.purchased_at,
            })
    return results


def create_reading_session(db: Session, user: User, chapter_id: int, token_hash: str, ttl_minutes: int = 60) -> ReadingSession:
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise ValueError("Chapter not found")

    purchase = db.query(Purchase).filter(
        Purchase.user_id == user.id,
        Purchase.chapter_id == chapter_id,
        Purchase.status == "successful",
    ).first()
    if not purchase:
        raise PermissionError("Access denied")

    session = ReadingSession(
        user_id=user.id,
        chapter_id=chapter_id,
        session_token_hash=token_hash,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=ttl_minutes),
        last_activity=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
