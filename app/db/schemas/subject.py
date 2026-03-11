from pydantic import BaseModel
from typing import Optional


class SubjectBase(BaseModel):
    name: str
    code: str
    department_id: int
    tenant_id: int


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    name: Optional[str]
    code: Optional[str]
    department_id: Optional[int]


class SubjectResponse(SubjectBase):
    id: int

    class Config:
        from_attributes = True
