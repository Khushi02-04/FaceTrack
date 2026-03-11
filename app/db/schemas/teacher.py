from pydantic import BaseModel, EmailStr
from typing import Optional


class TeacherBase(BaseModel):
    name: str
    email: EmailStr
    department_id: int
    tenant_id: int


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    department_id: Optional[int]


class TeacherResponse(TeacherBase):
    id: int

    class Config:
        from_attributes = True
