from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    domain = Column(String)
