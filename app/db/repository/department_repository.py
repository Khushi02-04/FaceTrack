from sqlalchemy.orm import Session
from db.models.department import Department


class DepartmentRepository:

    @staticmethod
    def create(db: Session, data: dict):
        department = Department(**data)
        db.add(department)
        db.commit()
        db.refresh(department)
        return department

    @staticmethod
    def get_by_id(db: Session, department_id: int):
        return db.query(Department).filter(
            Department.id == department_id
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(Department).filter(
            Department.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, department, data: dict):
        for key, value in data.items():
            setattr(department, key, value)

        db.commit()
        db.refresh(department)
        return department

    @staticmethod
    def delete(db: Session, department):
        db.delete(department)
        db.commit()
