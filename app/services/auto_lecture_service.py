from datetime import datetime, date
from sqlalchemy.orm import Session

from db.repository.timetable_repository import TimetableRepository
from db.repository.lecture_repository import LectureRepository


class AutoLectureService:

    @staticmethod
    def generate_daily_lectures(db: Session):
        now = datetime.now()

        # Only after 10 AM
        if now.hour < 10:
            return "Too early, skipping"

        today = date.today()
        weekday = today.weekday()

        timetables = TimetableRepository.get_by_day(db, weekday)

        created = 0

        for tt in timetables:
            existing = LectureRepository.get_by_timetable_and_date(
                db,
                tt.id,
                today,
            )

            if not existing:
                LectureRepository.create(
                    db,
                    {
                        "timetable_id": tt.id,
                        "date": today,
                        "status": "scheduled",
                        "tenant_id": tt.tenant_id,
                    },
                )
                created += 1

        return f"{created} lectures generated"
