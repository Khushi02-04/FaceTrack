from sqlalchemy.orm import Session
from db.models.lecture import Lecture


class LectureRepository:

    @staticmethod
    def create(db: Session, data: dict):
        obj = Lecture(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_id(db: Session, lecture_id: int):
        return db.query(Lecture).filter(
            Lecture.id == lecture_id
        ).first()

    @staticmethod
    def get_by_timetable_and_date(
        db: Session,
        timetable_id: int,
        lecture_date,
    ):
        return db.query(Lecture).filter(
            Lecture.timetable_id == timetable_id,
            Lecture.date == lecture_date,
        ).first()

    @staticmethod
    def get_all(db: Session, tenant_id: int):
        return db.query(Lecture).filter(
            Lecture.tenant_id == tenant_id
        ).all()

    @staticmethod
    def update(db: Session, lecture, data: dict):
        for key, value in data.items():
            setattr(lecture, key, value)

        db.commit()
        db.refresh(lecture)
        return lecture

    @staticmethod
    def delete(db: Session, lecture):
        db.delete(lecture)
        db.commit()
