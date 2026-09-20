from sqlalchemy.orm import Session

from app.models.subject import Subject


def get_subjects_for_class(db: Session, class_id: int):
    return db.query(Subject).filter(Subject.class_id == class_id).all()


def create_subject(db: Session, class_id: int, subject_name: str):
    subject = Subject(class_id=class_id, subject_name=subject_name)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject
