from db.base_class import Base
from sqlalchemy.orm import relationship
from datetime import datetime

from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, JSON, Boolean, Float

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)

    # ------------------
    # Basic Info
    # ------------------
    name = Column(String)
    email = Column(String)
    mobile = Column(String)
    roll_no = Column(String)

    class_id = Column(ForeignKey("class_sections.id"))
    tenant_id = Column(ForeignKey("tenants.id"))

    university_prn = Column(String, unique=True)
    aadhaar_number = Column(String, unique=True)

    # ------------------
    # Address
    # ------------------
    address_line1 = Column(String)
    address_line2 = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    country = Column(String)

    # ------------------
    # Academic (10th, 12th)
    # ------------------
    tenth_school = Column(String)
    tenth_percentage = Column(Float)
    tenth_board = Column(String)
    tenth_year = Column(Integer)

    twelfth_school = Column(String)
    twelfth_percentage = Column(Float)
    twelfth_board = Column(String)
    twelfth_year = Column(Integer)

    # ------------------
    # Parent Info
    # ------------------
    father_name = Column(String)
    father_mobile = Column(String)
    father_occupation = Column(String)

    mother_name = Column(String)
    mother_mobile = Column(String)
    mother_occupation = Column(String)

    # ------------------
    # Sibling Info
    # ------------------
    sibling_info = Column(JSON, nullable=True)
    # Example:
    # [{"name": "Rohit", "age": 15, "education": "10th"}]

    # ------------------
    # Emergency Contacts
    # ------------------
    emergency_contacts = Column(JSON, nullable=True)

    # ------------------
    # Documents
    # ------------------
    documents = Column(JSON, nullable=True)
    # Example:
    # [{"type": "aadhaar", "url": "..."}]

    profile_photo = Column(String)
    # ------------------
    # Face Recognition
    # ------------------
    face_embedding = Column(JSON, nullable=True)
    is_face_registered = Column(Boolean, default=False)

    # ------------------
    # Meta
    # ------------------
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
