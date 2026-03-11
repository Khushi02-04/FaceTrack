from pydantic import BaseModel
from datetime import date
from typing import Optional


class LectureBase(BaseModel):
    timetable_id: int
    date: date
    status: str
    tenant_id: int


class LectureCreate(LectureBase):
    pass


class LectureUpdate(BaseModel):
    status: Optional[str]


class LectureResponse(LectureBase):
    id: int

    class Config:
        from_attributes = True
