from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.department_repository import DepartmentRepository


class DepartmentService:

    @staticmethod
    def create_department(db: Session, data):
        return DepartmentRepository.create(db, data.dict())

    @staticmethod
    def get_department(db: Session, department_id: int):
        department = DepartmentRepository.get_by_id(db, department_id)

        if not department:
            raise HTTPException(status_code=404, detail="Department not found")

        return department

    @staticmethod
    def get_all_departments(db: Session, tenant_id: int):
        return DepartmentRepository.get_all(db, tenant_id)

    @staticmethod
    def update_department(db: Session, department_id: int, data):
        department = DepartmentRepository.get_by_id(db, department_id)

        if not department:
            raise HTTPException(status_code=404, detail="Department not found")

        return DepartmentRepository.update(
            db, department, data.dict(exclude_unset=True)
        )

    @staticmethod
    def delete_department(db: Session, department_id: int):
        department = DepartmentRepository.get_by_id(db, department_id)

        if not department:
            raise HTTPException(status_code=404, detail="Department not found")

        DepartmentRepository.delete(db, department)
        return {"message": "Department deleted"}
