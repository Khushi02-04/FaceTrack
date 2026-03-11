from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.subject_service import SubjectService
from db.schemas.subject import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse
)

router = APIRouter()


@router.post("/", response_model=SubjectResponse)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db)
):
    try:
        return SubjectService.create_subject(db, subject_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    try:
        return SubjectService.get_subject(db, subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[SubjectResponse])
def get_all_subjects(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    try:
        return SubjectService.get_all_subjects(db, tenant_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db)
):
    try:
        return SubjectService.update_subject(db, subject_id, subject_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    try:
        return SubjectService.delete_subject(db, subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
