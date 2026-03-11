from pydantic import BaseModel
from typing import Optional


class TenantBase(BaseModel):
    name: str
    domain: Optional[str]


class TenantCreate(TenantBase):
    pass


class TenantUpdate(BaseModel):
    name: Optional[str]
    domain: Optional[str]


class TenantResponse(TenantBase):
    id: int

    class Config:
        from_attributes = True
