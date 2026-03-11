from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import get_db
from services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/student/{student_id}")
def student_dashboard(
    student_id: int,
    db: Session = Depends(get_db),
):
    try:
        return AnalyticsService.student_dashboard(
            db, student_id
        )
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/student/{student_id}/subjects")
def subject_wise(
    student_id: int,
    db: Session = Depends(get_db),
):
    try:
        return AnalyticsService.subject_wise(
            db, student_id
        )
    except Exception as e:
        raise HTTPException(500, str(e))
