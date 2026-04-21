from datetime import date as date_type, datetime, time

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.models.attendence import Attendance
from db.models.student import Student
from db.session import get_db
from services.student_service import StudentService

router = APIRouter()


@router.get("/today")
def get_today_attendance(date: date_type | None = None, db: Session = Depends(get_db)):
    requested_date = date or datetime.utcnow().date()
    start_of_day = datetime.combine(requested_date, time.min)
    end_of_day = datetime.combine(requested_date, time.max)

    records = (
        db.query(Attendance)
        .filter(
            Attendance.marked_at >= start_of_day,
            Attendance.marked_at <= end_of_day,
            Attendance.lecture_id.is_(None),
        )
        .order_by(Attendance.marked_at.desc())
        .all()
    )

    items = []
    present_count = 0
    absent_count = 0

    for record in records:
      student = db.query(Student).filter(Student.id == record.student_id).first()
      if not student:
          continue

      student_data = StudentService.serialize_student(db, student)

      if record.status == "present":
          present_count += 1
      elif record.status == "absent":
          absent_count += 1

      items.append(
          {
              "attendance_id": record.id,
              "student_id": record.student_id,
              "status": record.status,
              "marked_at": record.marked_at.isoformat() if record.marked_at else None,
              "student": {
                  "id": student_data["id"],
                  "name": student_data["name"],
                  "roll_no": student_data["roll_no"],
                  "department": student_data.get("department"),
                  "year_of_study": student_data.get("year_of_study"),
              },
          }
    )

    return {
        "date": requested_date.isoformat(),
        "present_count": present_count,
        "absent_count": absent_count,
        "total_count": len(items),
        "records": items,
    }
