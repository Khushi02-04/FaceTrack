from datetime import datetime

from sqlalchemy.orm import Session

from core.utils.face_utils import bytes_to_image, generate_face_embedding
from db.models.attendence import Attendance
from db.models.student import Student
from db.repository.class_section_repository import ClassSectionRepository
from db.repository.department_repository import DepartmentRepository
from db.repository.student_repository import StudentRepository
from db.schemas.student import ShowStudent, StudentCreate


class StudentService:
    @staticmethod
    def _extract_student_meta(student: Student):
        documents = student.documents or []
        meta_document = next(
            (
                document
                for document in documents
                if isinstance(document, dict) and document.get("type") == "student_meta"
            ),
            {},
        )

        return {
            "department": meta_document.get("department"),
            "year_of_study": meta_document.get("year_of_study"),
        }

    @staticmethod
    def serialize_student(db: Session, student: Student):
        class_section = (
            ClassSectionRepository.get_by_id(db, student.class_id)
            if student.class_id is not None
            else None
        )
        department = (
            DepartmentRepository.get_by_id(db, class_section.department_id)
            if class_section and class_section.department_id is not None
            else None
        )
        meta = StudentService._extract_student_meta(student)

        return {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "mobile": student.mobile,
            "father_name": student.father_name,
            "mother_name": student.mother_name,
            "roll_no": student.roll_no,
            "class_id": student.class_id,
            "tenant_id": student.tenant_id,
            "is_face_registered": bool(student.is_face_registered),
            "department": meta.get("department") or (department.name if department else None),
            "year_of_study": meta.get("year_of_study"),
            "address_line": student.address_line1,
            "address_line1": student.address_line1,
            "city": student.city,
            "state": student.state,
            "pincode": student.pincode,
            "tenth_school": student.tenth_school,
            "tenth_percentage": student.tenth_percentage,
            "tenth_board": student.tenth_board,
            "tenth_year": student.tenth_year,
            "twelfth_school": student.twelfth_school,
            "twelfth_percentage": student.twelfth_percentage,
            "twelfth_board": student.twelfth_board,
            "twelfth_year": student.twelfth_year,
            "academic_records": None,
            "father_mobile": student.father_mobile,
            "mother_mobile": student.mother_mobile,
            "father_occupation": student.father_occupation,
            "mother_occupation": student.mother_occupation,
            "guardian_name": None,
            "guardian_mobile": None,
            "guardian_relation": None,
            "sibling_details": student.sibling_info,
            "aadhaar_number": student.aadhaar_number,
            "university_prn": student.university_prn,
            "documents": student.documents or [],
        }

    @staticmethod
    def mark_attendance_for_today(db: Session, recognized_student: Student):
        now = datetime.utcnow()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

        todays_records = (
            db.query(Attendance)
            .filter(
                Attendance.tenant_id == recognized_student.tenant_id,
                Attendance.marked_at >= start_of_day,
                Attendance.marked_at <= end_of_day,
                Attendance.lecture_id.is_(None),
            )
            .all()
        )

        attendance_by_student = {record.student_id: record for record in todays_records}
        tenant_students = db.query(Student).filter(Student.tenant_id == recognized_student.tenant_id).all()

        for student in tenant_students:
            existing_record = attendance_by_student.get(student.id)

            if student.id == recognized_student.id:
                if existing_record:
                    existing_record.status = "present"
                    existing_record.marked_at = now
                else:
                    db.add(
                        Attendance(
                            lecture_id=None,
                            student_id=student.id,
                            status="present",
                            marked_at=now,
                            tenant_id=student.tenant_id,
                        )
                    )
                continue

            if existing_record is None:
                db.add(
                    Attendance(
                        lecture_id=None,
                        student_id=student.id,
                        status="absent",
                        marked_at=now,
                        tenant_id=student.tenant_id,
                    )
                )

        db.commit()

    @staticmethod
    async def recognize_student(image_bytes, db):
        image = bytes_to_image(image_bytes)
        try:
            embedding = generate_face_embedding(image)
        except Exception as exc:
            raise ValueError(
                "No clear face was detected. Please capture a clear, front-facing image."
            ) from exc

        student, score = StudentRepository.find_by_embedding(
            db=db,
            embedding=embedding
        )

        if not student:
            raise LookupError(
                "No registered student matched this face. Register the student's face first or capture a clearer image."
            )

        StudentService.mark_attendance_for_today(db, student)
        return StudentService.serialize_student(db, student)

    @staticmethod
    def update_student(db, student_id: int, data):
        update_data = data.model_dump(exclude_unset=True)

        if "face_embedding" in update_data:
            update_data.pop("face_embedding")

        student = StudentRepository.update_student(
            db=db,
            student_id=student_id,
            update_data=update_data
        )

        return student

    @staticmethod
    def create_student(db: Session, payload: StudentCreate):
        data = payload.dict()

        if data.get("aadhaar_number") and len(data["aadhaar_number"]) != 12:
            raise ValueError("Aadhaar must be 12 digits")

        if data.get("university_prn") and len(data["university_prn"]) < 5:
            raise ValueError("Invalid PRN")

        student = StudentRepository.create(db, data)
        return StudentService.serialize_student(db, student)

    @staticmethod
    def get_student_by_id(db, student_id: int):
        student = StudentRepository.get_by_id(db, student_id)
        if not student:
            return None
        return StudentService.serialize_student(db, student)

    @staticmethod
    def get_all_students(db):
        return [
            StudentService.serialize_student(db, student)
            for student in StudentRepository.get_all(db)
        ]

    @staticmethod
    def delete_student(db, student_id: int):
        return StudentRepository.delete_student(db, student_id)
