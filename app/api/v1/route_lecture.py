from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.lecture_service import LectureService
from db.schemas.lecture import (
    LectureCreate,
    LectureUpdate,
    LectureResponse,
)

router = APIRouter()


@router.post("/", response_model=LectureResponse)
def create_lecture(
    data: LectureCreate,
    db: Session = Depends(get_db),
):
    try:
        return LectureService.create_lecture(db, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/{lecture_id}", response_model=LectureResponse)
def get_lecture(
    lecture_id: int,
    db: Session = Depends(get_db),
):
    try:
        return LectureService.get_lecture(db, lecture_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/", response_model=List[LectureResponse])
def get_all_lectures(
    tenant_id: int,
    db: Session = Depends(get_db),
):
    try:
        return LectureService.get_all_lectures(db, tenant_id)
    except Exception as e:
        raise HTTPException(500, str(e))


@router.put("/{lecture_id}", response_model=LectureResponse)
def update_lecture(
    lecture_id: int,
    data: LectureUpdate,
    db: Session = Depends(get_db),
):
    try:
        return LectureService.update_lecture(db, lecture_id, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.delete("/{lecture_id}")
def delete_lecture(
    lecture_id: int,
    db: Session = Depends(get_db),
):
    try:
        return LectureService.delete_lecture(db, lecture_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
