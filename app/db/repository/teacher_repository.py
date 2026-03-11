from sqlalchemy.orm import Session
from db.models.teacher import Teacher


class TeacherRepository:

    @staticmethod
    def create(db: Session, data: dict):
        teacher = Teacher(**data)
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
        return teacher

    @staticmethod
    def get_by_id(db: Session, teacher_id: int):
        return db.query(Teacher).filter(
            Teacher.id == teacher_id
        ).first()

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(Teacher).filter(
            Teacher.email == email
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(Teacher).filter(
            Teacher.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, teacher, data: dict):
        for key, value in data.items():
            setattr(teacher, key, value)

        db.commit()
        db.refresh(teacher)
        return teacher

    @staticmethod
    def delete(db: Session, teacher):
        db.delete(teacher)
        db.commit()
