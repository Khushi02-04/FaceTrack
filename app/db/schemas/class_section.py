from pydantic import BaseModel
from typing import Optional


class ClassSectionBase(BaseModel):
    name: str
    semester: int
    department_id: int
    tenant_id: int


class ClassSectionCreate(ClassSectionBase):
    pass


class ClassSectionUpdate(BaseModel):
    name: Optional[str]
    semester: Optional[int]
    department_id: Optional[int]


class ClassSectionResponse(ClassSectionBase):
    id: int

    class Config:
        from_attributes = True
