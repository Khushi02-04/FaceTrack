from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

    department_id = Column(ForeignKey("departments.id"))
    tenant_id = Column(ForeignKey("tenants.id"))
