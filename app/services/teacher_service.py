from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.teacher_repository import TeacherRepository


class TeacherService:

    @staticmethod
    def create_teacher(db: Session, data):
        # Prevent duplicate email
        existing = TeacherRepository.get_by_email(db, data.email)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Teacher with this email already exists"
            )

        return TeacherRepository.create(db, data.dict())

    @staticmethod
    def get_teacher(db: Session, teacher_id: int):
        teacher = TeacherRepository.get_by_id(db, teacher_id)

        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")

        return teacher

    @staticmethod
    def get_all_teachers(db: Session, tenant_id: int):
        return TeacherRepository.get_all(db, tenant_id)

    @staticmethod
    def update_teacher(db: Session, teacher_id: int, data):
        teacher = TeacherRepository.get_by_id(db, teacher_id)

        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")

        return TeacherRepository.update(
            db,
            teacher,
            data.dict(exclude_unset=True)
        )

    @staticmethod
    def delete_teacher(db: Session, teacher_id: int):
        teacher = TeacherRepository.get_by_id(db, teacher_id)

        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")

        TeacherRepository.delete(db, teacher)
        return {"message": "Teacher deleted"}
