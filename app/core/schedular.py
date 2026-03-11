from apscheduler.schedulers.background import BackgroundScheduler
from db.session import SessionLocal
from services.auto_lecture_service import AutoLectureService


def start_scheduler():  
    scheduler = BackgroundScheduler()

    def job():
        db = SessionLocal()
        try:
            AutoLectureService.generate_daily_lectures(db)
        finally:
            db.close()

    # Run every day at 10 AM
    scheduler.add_job(job, "cron", hour=10, minute=0)

    scheduler.start()
