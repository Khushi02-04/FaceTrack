from pydantic import BaseModel
from typing import Optional


class DepartmentBase(BaseModel):
    name: str
    tenant_id: int


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str]


class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True
