from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.class_section_repository import ClassSectionRepository


class ClassSectionService:

    @staticmethod
    def create_class(db: Session, data):
        return ClassSectionRepository.create(db, data.dict())

    @staticmethod
    def get_class(db: Session, class_id: int):
        class_section = ClassSectionRepository.get_by_id(db, class_id)

        if not class_section:
            raise HTTPException(status_code=404, detail="Class not found")

        return class_section

    @staticmethod
    def get_all_classes(db: Session, tenant_id: int):
        return ClassSectionRepository.get_all(db, tenant_id)

    @staticmethod
    def update_class(db: Session, class_id: int, data):
        class_section = ClassSectionRepository.get_by_id(db, class_id)

        if not class_section:
            raise HTTPException(status_code=404, detail="Class not found")

        return ClassSectionRepository.update(
            db, class_section, data.dict(exclude_unset=True)
        )

    @staticmethod
    def delete_class(db: Session, class_id: int):
        class_section = ClassSectionRepository.get_by_id(db, class_id)

        if not class_section:
            raise HTTPException(status_code=404, detail="Class not found")

        ClassSectionRepository.delete(db, class_section)
        return {"message": "Class deleted"}
