from db.schemas.student import ShowStudent, StudentCreate
from db.repository.student_repository import StudentRepository
from deepface import DeepFace
from core.utils.face_utils import bytes_to_image
from sqlalchemy.orm import Session


class StudentService:

    @staticmethod
    async def recognize_student(image_bytes, db):
        image = bytes_to_image(image_bytes)

        embedding = DeepFace.represent(
            img_path=image,
            model_name="Facenet"
        )[0]["embedding"]

        student, score = StudentRepository.find_by_embedding(
            db=db,
            embedding=embedding
        )

        if not student:
            return {"message": "Student not found"}

        return student

    @staticmethod
    def update_student(db, student_id: int, data):
        update_data = data.model_dump(exclude_unset=True)

        # Security check
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

        # Convert Pydantic → dict
        data = payload.dict()

        # Aadhaar validation
        if data.get("aadhaar_number") and len(data["aadhaar_number"]) != 12:
            raise ValueError("Aadhaar must be 12 digits")

        # PRN validation
        if data.get("university_prn") and len(data["university_prn"]) < 5:
            raise ValueError("Invalid PRN")

        return StudentRepository.create(db, data)
        
    @staticmethod
    def get_student_by_id(db, student_id: int):
        return StudentRepository.get_by_id(db, student_id)

    @staticmethod
    def get_all_students(db):
        return StudentRepository.get_all(db)

    @staticmethod
    def delete_student(db, student_id: int):
        return StudentRepository.delete_student(db, student_id)