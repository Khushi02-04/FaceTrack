from datetime import date, timedelta
from db.repository.analytics_repository import AnalyticsRepository



class AnalyticsService:

    @staticmethod
    def student_dashboard(db, student_id: int):

        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        today_data = AnalyticsRepository.get_student_attendance(
            db, student_id, today, today
        )

        weekly_data = AnalyticsRepository.get_student_attendance(
            db, student_id, week_start, today
        )

        monthly_data = AnalyticsRepository.get_student_attendance(
            db, student_id, month_start, today
        )

        def percentage(records):
            if not records:
                return 0
            present = sum(1 for r in records if r.status == "present")
            return round((present / len(records)) * 100, 2)

        return {
            "today": percentage(today_data),
            "weekly": percentage(weekly_data),
            "monthly": percentage(monthly_data),
        }


    @staticmethod
    def subject_wise(db, student_id: int):
        data = AnalyticsRepository.get_stud_analytics(db=db, student_id = student_id)

        result = []

        for subject_id, total, present in data:
            result.append(
                {
                    "subject_id": subject_id,
                    "percentage": round((present / total) * 100, 2),
                }
            )

        return result
