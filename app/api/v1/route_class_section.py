from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.class_section_service import ClassSectionService
from db.schemas.class_section import (
    ClassSectionCreate,
    ClassSectionUpdate,
    ClassSectionResponse
)

router = APIRouter()


@router.post("/", response_model=ClassSectionResponse)
def create_class(
    class_data: ClassSectionCreate,
    db: Session = Depends(get_db)
):
    return ClassSectionService.create_class(db, class_data)


@router.get("/{class_id}", response_model=ClassSectionResponse)
def get_class(
    class_id: int,
    db: Session = Depends(get_db)
):
    return ClassSectionService.get_class(db, class_id)


@router.get("/", response_model=List[ClassSectionResponse])
def get_all_classes(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    return ClassSectionService.get_all_classes(db, tenant_id)


@router.put("/{class_id}", response_model=ClassSectionResponse)
def update_class(
    class_id: int,
    class_data: ClassSectionUpdate,
    db: Session = Depends(get_db)
):
    return ClassSectionService.update_class(db, class_id, class_data)


@router.delete("/{class_id}")
def delete_class(
    class_id: int,
    db: Session = Depends(get_db)
):
    return ClassSectionService.delete_class(db, class_id)
