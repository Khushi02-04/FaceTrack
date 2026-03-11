from db.repository.student_repository import StudentRepository
from core.utils.face_utils import bytes_to_image, generate_face_embedding
from fastapi import HTTPException


class StudentFaceService:

    def __init__(self, repo: StudentRepository):
        self.repo = repo

    async def register_face(self, student_id: int, file):

        student = self.repo.get_student_by_id(student_id)

        if not student:
            raise HTTPException(404, "Student not found")

        image_bytes = await file.read()
        image_np = bytes_to_image(image_bytes)

        embedding = generate_face_embedding(image_np)

        updated_student = self.repo.update_face_embedding(student, embedding)

        return {
            "message": "Face registered successfully",
            "student_id": updated_student.id,
            "is_face_registered": updated_student.is_face_registered
        }
