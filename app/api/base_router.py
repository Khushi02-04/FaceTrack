from fastapi import APIRouter, UploadFile, File, Depends
from .v1 import (
    route_student, 
    route_user, 
    route_tenant, 
    route_department, 
    route_class_section,
    route_subject,
    route_teacher,
    route_timetable,
    route_lecture,
    route_analytics
    )


router = APIRouter()

router.include_router(prefix = "/students", router = route_student.router, tags = ['Student'])
router.include_router(prefix = "/tenant", router = route_tenant.router, tags = ['Tenant'])
router.include_router(prefix = "/departments", router = route_department.router, tags = ['Department'])
router.include_router(prefix = "/class-sections", router = route_class_section.router, tags = ['Class Sections'])
router.include_router(prefix = "/subjects", router = route_subject.router, tags = ['Subjects'])
router.include_router(prefix = "/teachers", router = route_teacher.router, tags = ['Teachers'])
router.include_router(prefix = "/timetables", router = route_timetable.router, tags = ['TimeTable'])
router.include_router(prefix = "/lectures", router = route_lecture.router, tags = ['Lecture'])
router.include_router(prefix = "/analytics", router = route_analytics.router, tags = ['Analytics'])





