from pydantic import BaseModel
from datetime import time
from typing import Optional


class TimetableBase(BaseModel):
    class_id: int
    subject_id: int
    teacher_id: int
    day_of_week: int
    start_time: time
    end_time: time
    tenant_id: int


class TimetableCreate(TimetableBase):
    pass


class TimetableUpdate(BaseModel):
    class_id: Optional[int]
    subject_id: Optional[int]
    teacher_id: Optional[int]
    day_of_week: Optional[int]
    start_time: Optional[time]
    end_time: Optional[time]


class TimetableResponse(TimetableBase):
    id: int

    class Config:
        from_attributes = True
