from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from services.timetable_service import TimetableService
from db.schemas.timetable import (
    TimetableCreate,
    TimetableUpdate,
    TimetableResponse,
)

router = APIRouter()


@router.post("/", response_model=TimetableResponse)
def create_timetable(
    data: TimetableCreate,
    db: Session = Depends(get_db),
):
    try:
        return TimetableService.create_timetable(db, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/{timetable_id}", response_model=TimetableResponse)
def get_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
):
    try:
        return TimetableService.get_timetable(db, timetable_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/", response_model=List[TimetableResponse])
def get_all_timetables(
    tenant_id: int,
    db: Session = Depends(get_db),
):
    try:
        return TimetableService.get_all_timetables(db, tenant_id)
    except Exception as e:
        raise HTTPException(500, str(e))


@router.put("/{timetable_id}", response_model=TimetableResponse)
def update_timetable(
    timetable_id: int,
    data: TimetableUpdate,
    db: Session = Depends(get_db),
):
    try:
        return TimetableService.update_timetable(db, timetable_id, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@router.delete("/{timetable_id}")
def delete_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
):
    try:
        return TimetableService.delete_timetable(db, timetable_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
