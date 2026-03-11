from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date
from db.repository.lecture_repository import LectureRepository
from db.repository.timetable_repository import TimetableRepository


class LectureService:

    @staticmethod
    def create_lecture(db: Session, data):
        # Validate timetable
        timetable = TimetableRepository.get_by_id(
            db,
            data.timetable_id
        )

        if not timetable:
            raise HTTPException(404, "Timetable not found")

        # Prevent duplicate lecture
        existing = LectureRepository.get_by_timetable_and_date(
            db,
            data.timetable_id,
            data.date,
        )

        if existing:
            raise HTTPException(
                400,
                "Lecture already created for this date"
            )

        # Validate day
        if data.date.weekday() != timetable.day_of_week:
            raise HTTPException(
                400,
                "Date does not match timetable day"
            )

        return LectureRepository.create(db, data.dict())

    @staticmethod
    def get_lecture(db: Session, lecture_id: int):
        obj = LectureRepository.get_by_id(db, lecture_id)

        if not obj:
            raise HTTPException(404, "Lecture not found")

        return obj

    @staticmethod
    def get_all_lectures(db: Session, tenant_id: int):
        return LectureRepository.get_all(db, tenant_id)

    @staticmethod
    def update_lecture(db: Session, lecture_id: int, data):
        obj = LectureRepository.get_by_id(db, lecture_id)

        if not obj:
            raise HTTPException(404, "Lecture not found")

        update_data = data.dict(exclude_unset=True)

        return LectureRepository.update(db, obj, update_data)

    @staticmethod
    def delete_lecture(db: Session, lecture_id: int):
        obj = LectureRepository.get_by_id(db, lecture_id)

        if not obj:
            raise HTTPException(404, "Lecture not found")

        LectureRepository.delete(db, obj)

        return {"message": "Lecture deleted"}
