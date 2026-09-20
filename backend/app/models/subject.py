from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id"), nullable=False)
    subject_name: Mapped[str] = mapped_column(String(80), nullable=False)

    school_class: Mapped["SchoolClass"] = relationship(back_populates="subjects")
    chapters: Mapped[list["Chapter"]] = relationship(back_populates="subject")
