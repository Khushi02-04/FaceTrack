from sqlalchemy.orm import Session
from db.models.time_table import Timetable


class TimetableRepository:

    @staticmethod
    def create(db: Session, data: dict):
        obj = Timetable(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_id(db: Session, timetable_id: int):
        return db.query(Timetable).filter(
            Timetable.id == timetable_id
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(Timetable).filter(
            Timetable.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, timetable, data: dict):
        for key, value in data.items():
            setattr(timetable, key, value)

        db.commit()
        db.refresh(timetable)
        return timetable

    @staticmethod
    def delete(db: Session, timetable):
        db.delete(timetable)
        db.commit()

    @staticmethod
    def check_conflict(
        db: Session,
        class_id: int,
        teacher_id: int,
        day_of_week: int,
        start_time,
        end_time,
    ):
        return db.query(Timetable).filter(
            Timetable.day_of_week == day_of_week,
            (
                (Timetable.class_id == class_id)
                | (Timetable.teacher_id == teacher_id)
            ),
            Timetable.start_time < end_time,
            Timetable.end_time > start_time,
        ).first()

    @staticmethod
    def get_by_day(db: Session, day: int):
        return db.query(Timetable).filter(
            Timetable.day_of_week == day
        ).all()
