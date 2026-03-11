from sqlalchemy.orm import Session
from db.models.class_section import ClassSection


class ClassSectionRepository:

    @staticmethod
    def create(db: Session, data: dict):
        class_section = ClassSection(**data)
        db.add(class_section)
        db.commit()
        db.refresh(class_section)
        return class_section

    @staticmethod
    def get_by_id(db: Session, class_id: int):
        return db.query(ClassSection).filter(
            ClassSection.id == class_id
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(ClassSection).filter(
            ClassSection.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, class_section, data: dict):
        for key, value in data.items():
            setattr(class_section, key, value)

        db.commit()
        db.refresh(class_section)
        return class_section

    @staticmethod
    def delete(db: Session, class_section):
        db.delete(class_section)
        db.commit()
