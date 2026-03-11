from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.teacher_service import TeacherService
from db.schemas.teacher import (
    TeacherCreate,
    TeacherUpdate,
    TeacherResponse
)

router = APIRouter()


@router.post("/", response_model=TeacherResponse)
def create_teacher(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db)
):
    try:
        return TeacherService.create_teacher(db, teacher_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    try:
        return TeacherService.get_teacher(db, teacher_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[TeacherResponse])
def get_all_teachers(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    try:
        return TeacherService.get_all_teachers(db, tenant_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(
    teacher_id: int,
    teacher_data: TeacherUpdate,
    db: Session = Depends(get_db)
):
    try:
        return TeacherService.update_teacher(
            db,
            teacher_id,
            teacher_data
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    try:
        return TeacherService.delete_teacher(db, teacher_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
