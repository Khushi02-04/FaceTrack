from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import date


class ShowStudent(BaseModel):
    id: int
    name: str
    email: Optional[str]
    mobile: Optional[str]
    father_name: Optional[str]
    mother_name: Optional[str]
    roll_no: Optional[str]
    class_id: Optional[int]
    tenant_id: Optional[int]
    is_face_registered: Optional[bool]
    confidence: Optional[float]

    class Config:
        from_attributes = True

class StudentUpdateRequest(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    mobile: Optional[str]
    father_name: Optional[str]
    mother_name: Optional[str]
    roll_no: Optional[str]
    class_id: Optional[int]

    class Config:
        from_attributes = True

class StudentUpdateResponse(BaseModel):
    id: int
    message: str


class StudentResponse(BaseModel):
    # Basic Info
    id: int
    name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    roll_no: Optional[str] = None

    # Academic / System
    class_id: Optional[int] = None
    tenant_id: Optional[int] = None
    is_face_registered: bool

    # Address Info
    address_line: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    # 10th Details
    tenth_school: Optional[str] = None
    tenth_percentage: Optional[float] = None
    tenth_board: Optional[str] = None
    tenth_year: Optional[int] = None

    # 12th Details
    twelfth_school: Optional[str] = None
    twelfth_percentage: Optional[float] = None
    twelfth_board: Optional[str] = None
    twelfth_year: Optional[int] = None

    # Academic Records (JSON based flexible)
    academic_records: Optional[List[Dict]] = None

    # Parent Info
    father_mobile: Optional[str] = None
    mother_mobile: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_occupation: Optional[str] = None

    # Guardian (optional)
    guardian_name: Optional[str] = None
    guardian_mobile: Optional[str] = None
    guardian_relation: Optional[str] = None

    # Sibling Info
    sibling_details: Optional[List[Dict]] = None

    # Identity
    aadhaar_number: Optional[str] = None
    university_prn: Optional[str] = None

    # Documents (stored as JSON → file URLs or metadata)
    documents: Optional[List[Dict]] = None

    # Face Embedding excluded intentionally
    # (security + performance)

    class Config:
        orm_mode = True


class StudentCreate(BaseModel):
    # Basic Info
    name: str
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    roll_no: Optional[str] = None

    class_id: int
    tenant_id: int

    university_prn: Optional[str] = None
    aadhaar_number: Optional[str] = None

    # Address
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None

    # Academic
    tenth_school: Optional[str] = None
    tenth_percentage: Optional[float] = None
    tenth_board: Optional[str] = None
    tenth_year: Optional[int] = None

    twelfth_school: Optional[str] = None
    twelfth_percentage: Optional[float] = None
    twelfth_board: Optional[str] = None
    twelfth_year: Optional[int] = None

    # Parents
    father_name: Optional[str] = None
    father_mobile: Optional[str] = None
    father_occupation: Optional[str] = None

    mother_name: Optional[str] = None
    mother_mobile: Optional[str] = None
    mother_occupation: Optional[str] = None

    # JSON
    sibling_info: Optional[List[Dict]] = None
    emergency_contacts: Optional[List[Dict]] = None
    documents: Optional[List[Dict]] = None

    profile_photo: Optional[str] = None