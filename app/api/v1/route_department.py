from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.department_service import DepartmentService
from db.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse
)

router = APIRouter()


@router.post("/", response_model=DepartmentResponse)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):
    return DepartmentService.create_department(db, department)


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    return DepartmentService.get_department(db, department_id)


@router.get("/", response_model=List[DepartmentResponse])
def get_all_departments(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    return DepartmentService.get_all_departments(db, tenant_id)


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db)
):
    return DepartmentService.update_department(
        db, department_id, department
    )


@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    return DepartmentService.delete_department(db, department_id)
