from db import session
from sqlalchemy.orm import Session
from datetime import date, timedelta
from db.models import Attendance, Lecture, Timetable
from sqlalchemy import func, case

class AnalyticsRepository:

    @staticmethod
    def get_student_attendance(
        db: Session,
        student_id: int,
        start_date,
        end_date,
    ):
        return (
            db.query(Attendance)
            .join(Lecture)
            .filter(
                Attendance.student_id == student_id,
                Lecture.date >= start_date,
                Lecture.date <= end_date,
            )
            .all()
        )



    @staticmethod
    def get_stud_analytics(
        db: Session,
        student_id: int
    ):
        data = (
            db.query(
                Timetable.subject_id,
                func.count(Attendance.id),
                func.sum(
                    case(
                        (Attendance.status == "present", 1),
                        else_=0
                    )
                ),
            )
            .join(Lecture, Lecture.timetable_id == Timetable.id)
            .join(Attendance, Attendance.lecture_id == Lecture.id)
            .filter(Attendance.student_id == student_id)
            .group_by(Timetable.subject_id)
            .all()
        )

        return data
