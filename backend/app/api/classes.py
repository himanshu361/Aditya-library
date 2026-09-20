from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.class_model import SchoolClass
from app.models.subject import Subject

router = APIRouter()


@router.get("/classes")
def list_classes(db: Session = Depends(get_db)):
    classes = db.query(SchoolClass).all()
    return [{"id": c.id, "class_number": c.class_number, "class_name": c.class_name} for c in classes]


@router.get("/classes/{class_id}")
def get_class(class_id: int, db: Session = Depends(get_db)):
    cls = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"id": cls.id, "class_number": cls.class_number, "class_name": cls.class_name}


@router.get("/classes/{class_id}/subjects")
def list_subjects(class_id: int, db: Session = Depends(get_db)):
    subjects = db.query(Subject).filter(Subject.class_id == class_id).all()
    return [{"id": s.id, "class_id": s.class_id, "subject_name": s.subject_name} for s in subjects]
