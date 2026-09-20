from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SchoolClass(Base):
    __tablename__ = "classes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    class_number: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    class_name: Mapped[str] = mapped_column(String(80), nullable=False)

    subjects: Mapped[list["Subject"]] = relationship(back_populates="school_class")
