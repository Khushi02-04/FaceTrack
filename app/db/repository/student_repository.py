from sqlalchemy.orm import Session
from db.models.student import Student
import numpy as np


class StudentRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_student_by_id(self, student_id: int):
        return self.db.query(Student).filter(Student.id == student_id).first()

    def update_face_embedding(self, student: Student, embedding: list):
        student.face_embedding = embedding
        student.is_face_registered = True

        self.db.commit()
        self.db.refresh(student)

        return student
    
    @staticmethod
    def cosine_similarity(a, b):
        a = np.array(a)
        b = np.array(b)
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    @staticmethod
    def find_by_embedding(db:Session, embedding, threshold=0.6):
        students = db.query(Student).filter(
            Student.is_face_registered == True
        ).all()

        best_match = None
        best_score = 0

        for student in students:
            score = StudentRepository.cosine_similarity(
                student.face_embedding, embedding
            )

            if score > threshold and score > best_score:
                best_match = student
                best_score = score

        return best_match, best_score
    
    @staticmethod
    def update_student(db: Session, student_id: int, update_data: dict):
        student = db.query(Student).filter(Student.id == student_id).first()

        if not student:
            return None

        for key, value in update_data.items():
            setattr(student, key, value)

        db.commit()
        db.refresh(student)

        return student
    
    @staticmethod
    def create(db: Session, student_data: dict) -> Student:
        student = Student(**student_data)

        db.add(student)
        db.commit()
        db.refresh(student)

        return student
    
    @staticmethod
    def get_by_id(db: Session, student_id: int):
        return db.query(Student).filter(Student.id == student_id).first()

    @staticmethod
    def get_all(db: Session):
        return db.query(Student).all()

    @staticmethod
    def delete_student(db: Session, student_id: int):
        student = db.query(Student).filter(Student.id == student_id).first()

        if not student:
            return False

        db.delete(student)
        db.commit()
        return True