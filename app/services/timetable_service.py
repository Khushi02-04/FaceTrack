from sqlalchemy.orm import Session
from fastapi import HTTPException
from db.repository.timetable_repository import TimetableRepository


class TimetableService:

    @staticmethod
    def create_timetable(db: Session, data):
        # Validate day
        if data.day_of_week < 0 or data.day_of_week > 6:
            raise HTTPException(400, "day_of_week must be between 0 and 6")

        # Validate time
        if data.start_time >= data.end_time:
            raise HTTPException(400, "Start time must be before end time")

        # Conflict check
        conflict = TimetableRepository.check_conflict(
            db,
            data.class_id,
            data.teacher_id,
            data.day_of_week,
            data.start_time,
            data.end_time,
        )

        if conflict:
            raise HTTPException(
                400,
                "Conflict: Teacher or Class already scheduled in this time slot"
            )

        return TimetableRepository.create(db, data.dict())

    @staticmethod
    def get_timetable(db: Session, timetable_id: int):
        obj = TimetableRepository.get_by_id(db, timetable_id)

        if not obj:
            raise HTTPException(404, "Timetable not found")

        return obj

    @staticmethod
    def get_all_timetables(db: Session, tenant_id: int):
        return TimetableRepository.get_all(db, tenant_id)

    @staticmethod
    def update_timetable(db: Session, timetable_id: int, data):
        obj = TimetableRepository.get_by_id(db, timetable_id)

        if not obj:
            raise HTTPException(404, "Timetable not found")

        update_data = data.dict(exclude_unset=True)

        return TimetableRepository.update(db, obj, update_data)

    @staticmethod
    def delete_timetable(db: Session, timetable_id: int):
        obj = TimetableRepository.get_by_id(db, timetable_id)

        if not obj:
            raise HTTPException(404, "Timetable not found")

        TimetableRepository.delete(db, obj)

        return {"message": "Timetable deleted"}
