from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

class Attendance(Base):
    __tablename__ = "attendance"
        
    id = Column(Integer, primary_key=True)

    lecture_id = Column(ForeignKey("lectures.id"))
    student_id = Column(ForeignKey("students.id"))

    status = Column(String)  # present, absent
    marked_at = Column(DateTime)

    tenant_id = Column(ForeignKey("tenants.id"))
