from sqlalchemy.orm import Session

from app.models.class_model import SchoolClass


def get_all_classes(db: Session):
    return db.query(SchoolClass).all()


def get_class_by_id(db: Session, class_id: int):
    return db.query(SchoolClass).filter(SchoolClass.id == class_id).first()


def create_class(db: Session, class_number: int, class_name: str):
    cls = SchoolClass(class_number=class_number, class_name=class_name)
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return cls
