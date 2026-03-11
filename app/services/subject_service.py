from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.subject_repository import SubjectRepository


class SubjectService:

    @staticmethod
    def create_subject(db: Session, data):
        return SubjectRepository.create(db, data.dict())

    @staticmethod
    def get_subject(db: Session, subject_id: int):
        subject = SubjectRepository.get_by_id(db, subject_id)

        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

        return subject

    @staticmethod
    def get_all_subjects(db: Session, tenant_id: int):
        return SubjectRepository.get_all(db, tenant_id)

    @staticmethod
    def update_subject(db: Session, subject_id: int, data):
        subject = SubjectRepository.get_by_id(db, subject_id)

        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

        return SubjectRepository.update(
            db, subject, data.dict(exclude_unset=True)
        )

    @staticmethod
    def delete_subject(db: Session, subject_id: int):
        subject = SubjectRepository.get_by_id(db, subject_id)

        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

        SubjectRepository.delete(db, subject)
        return {"message": "Subject deleted"}
