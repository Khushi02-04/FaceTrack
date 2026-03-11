from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)

    department_id = Column(ForeignKey("departments.id"))
    tenant_id = Column(ForeignKey("tenants.id"))
