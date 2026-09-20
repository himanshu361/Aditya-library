from datetime import datetime, timedelta
from hashlib import sha256

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models.chapter import Chapter
from app.models.purchase import Purchase
from app.models.reading_session import ReadingSession
from app.models.user import User
from app.services.google_drive_service import GoogleDriveService

router = APIRouter()


def _verify_student_purchase(db: Session, user_id: int, chapter_id: int):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    purchase = db.query(Purchase).filter(
        Purchase.user_id == user_id,
        Purchase.chapter_id == chapter_id,
        Purchase.status == "successful",
    ).first()
    if not purchase:
        raise HTTPException(status_code=403, detail="You do not have access to this chapter")

    if not chapter.google_drive_file_id:
        raise HTTPException(status_code=404, detail="Note not available")

    return chapter, purchase


@router.get("/notes/{chapter_id}")
def get_note(chapter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chapter, _ = _verify_student_purchase(db, current_user.id, chapter_id)
    drive_service = GoogleDriveService()
    return {
        "id": chapter.id,
        "chapter_name": chapter.chapter_name,
        "price": chapter.price,
        "status": "authorized",
        "viewer_url": f"/api/notes/{chapter_id}/viewer",
        "google_drive_file_id": chapter.google_drive_file_id,
        "google_drive_url": drive_service.build_file_url(chapter.google_drive_file_id),
        "watermark": {
            "name": current_user.name,
            "user_id": current_user.id,
        },
    }


@router.get("/student/notes")
def get_student_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    purchases = db.query(Purchase).filter(
        Purchase.user_id == current_user.id,
        Purchase.status == "successful",
    ).all()

    notes = []
    for purchase in purchases:
        chapter = db.query(Chapter).filter(Chapter.id == purchase.chapter_id).first()
        if chapter:
            notes.append({
                "id": chapter.id,
                "chapter_id": chapter.id,
                "chapter_name": chapter.chapter_name,
                "subject": chapter.subject.subject_name if chapter.subject else "General",
                "class_number": chapter.subject.school_class.class_number if chapter.subject and chapter.subject.school_class else None,
                "price": chapter.price,
                "status": "Purchased",
                "purchased_at": purchase.purchased_at.isoformat() if purchase.purchased_at else None,
            })
    return notes


@router.get("/student/notes/{chapter_id}")
def get_student_note(chapter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chapter, purchase = _verify_student_purchase(db, current_user.id, chapter_id)
    return {
        "id": chapter.id,
        "chapter_name": chapter.chapter_name,
        "subject": chapter.subject.subject_name if chapter.subject else "General",
        "class_number": chapter.subject.school_class.class_number if chapter.subject and chapter.subject.school_class else None,
        "status": "authorized",
        "purchase_status": purchase.status,
        "watermark": {
            "name": current_user.name,
            "user_id": current_user.id,
        },
        "google_drive_file_id": chapter.google_drive_file_id,
        "page_count": 25,
    }


@router.post("/student/notes/{chapter_id}/session")
def create_student_note_session(chapter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _verify_student_purchase(db, current_user.id, chapter_id)
    token = f"student:{current_user.id}:chapter:{chapter_id}:{datetime.utcnow().timestamp()}"
    token_hash = sha256(token.encode()).hexdigest()
    session = ReadingSession(
        user_id=current_user.id,
        chapter_id=chapter_id,
        session_token_hash=token_hash,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=60),
        last_activity=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {
        "session_id": session.id,
        "expires_at": session.expires_at.isoformat(),
        "token": token,
        "watermark": {
            "name": current_user.name,
            "user_id": current_user.id,
        },
    }


@router.post("/student/notes/{chapter_id}/heartbeat")
def heartbeat_student_note_session(chapter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(ReadingSession).filter(
        ReadingSession.user_id == current_user.id,
        ReadingSession.chapter_id == chapter_id,
    ).order_by(ReadingSession.created_at.desc()).first()
    if not session:
        raise HTTPException(status_code=404, detail="No active session")
    if session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired. Please login again to continue reading.")
    session.last_activity = datetime.utcnow()
    db.commit()
    return {"status": "active", "expires_at": session.expires_at.isoformat()}


@router.post("/student/notes/{chapter_id}/close")
def close_student_note_session(chapter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(ReadingSession).filter(
        ReadingSession.user_id == current_user.id,
        ReadingSession.chapter_id == chapter_id,
    ).order_by(ReadingSession.created_at.desc()).first()
    if session:
        db.delete(session)
        db.commit()
    return {"status": "closed"}
