from sqlalchemy.orm import Session
from db.models.subject import Subject


class SubjectRepository:

    @staticmethod
    def create(db: Session, data: dict):
        subject = Subject(**data)
        db.add(subject)
        db.commit()
        db.refresh(subject)
        return subject

    @staticmethod
    def get_by_id(db: Session, subject_id: int):
        return db.query(Subject).filter(
            Subject.id == subject_id
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(Subject).filter(
            Subject.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, subject, data: dict):
        for key, value in data.items():
            setattr(subject, key, value)

        db.commit()
        db.refresh(subject)
        return subject

    @staticmethod
    def delete(db: Session, subject):
        db.delete(subject)
        db.commit()
