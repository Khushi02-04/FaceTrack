from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, Time

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True)

    class_id = Column(ForeignKey("class_sections.id"))
    subject_id = Column(ForeignKey("subjects.id"))
    teacher_id = Column(ForeignKey("teachers.id"))

    day_of_week = Column(Integer)  # 0 = Monday
    start_time = Column(Time)
    end_time = Column(Time)

    tenant_id = Column(ForeignKey("tenants.id"))
