from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.database import get_db
from app.models.chapter import Chapter
from app.models.class_model import SchoolClass
from app.models.payment import PaymentTransaction
from app.models.subject import Subject
from app.models.user import User

router = APIRouter()


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return [{
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at,
    } for user in db.query(User).all()]


@router.get("/payments")
def list_payments(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return [{
        "id": payment.id,
        "user_id": payment.user_id,
        "chapter_id": payment.chapter_id,
        "transaction_reference": payment.transaction_reference,
        "amount": payment.amount,
        "status": payment.status,
        "created_at": payment.created_at,
    } for payment in db.query(PaymentTransaction).all()]


@router.post("/classes")
def create_admin_class(payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    cls = SchoolClass(class_number=payload["class_number"], class_name=payload["class_name"])
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return {"id": cls.id, "status": "created"}


@router.post("/subjects")
def create_admin_subject(payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    subject = Subject(class_id=payload["class_id"], subject_name=payload["subject_name"])
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return {"id": subject.id, "status": "created"}


@router.post("/chapters")
def create_admin_chapter(payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    chapter = Chapter(**payload)
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return {"id": chapter.id, "status": "created"}


@router.put("/chapters/{chapter_id}")
def update_admin_chapter(chapter_id: int, payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    for key, value in payload.items():
        setattr(chapter, key, value)
    db.commit()
    return {"status": "updated"}


@router.delete("/chapters/{chapter_id}")
def delete_admin_chapter(chapter_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    db.delete(chapter)
    db.commit()
    return {"status": "deleted"}
