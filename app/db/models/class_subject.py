from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

class ClassSubject(Base):
    __tablename__ = "class_subjects"
        
    id = Column(Integer, primary_key=True)
    class_id = Column(ForeignKey("class_sections.id"))
    subject_id = Column(ForeignKey("subjects.id"))
    tenant_id = Column(ForeignKey("tenants.id"))
