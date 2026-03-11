from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, Date
class Lecture(Base):
    __tablename__ = "lectures"
    id = Column(Integer, primary_key=True)

    timetable_id = Column(ForeignKey("timetables.id"))

    date = Column(Date)
    status = Column(String)  # completed, cancelled

    tenant_id = Column(ForeignKey("tenants.id"))
