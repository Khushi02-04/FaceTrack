from sqlalchemy.orm import Session
from db.models.subject import Subject
from db.models.class_section import ClassSection
from db.models.attendence import Attendance
from db.models.class_subject import ClassSubject
from db.models.department import Department
from db.models.lecture import Lecture
from db.models.student import Student
from db.models.teacher import Teacher
from db.models.tenant import Tenant
from db.models.time_table import Timetable

from datetime import time
from .base_seed import Seeder

class ERPSeeder:
    def __init__(self, db: Session):
        self.db = db

    def seed(self):

        # -------------------------
        # 1️⃣ Tenant (College)
        # -------------------------
        tenant = Tenant(
            name="SNJB College of Engineering",
            domain="snjb.edu"
        )
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)

        # -------------------------
        # 2️⃣ Departments
        # -------------------------
        cse = Department(
            name="Computer Engineering",
            tenant_id=tenant.id
        )

        it = Department(
            name="Information Technology",
            tenant_id=tenant.id
        )

        self.db.add_all([cse, it])
        self.db.commit()
        self.db.refresh(cse)
        self.db.refresh(it)

        # -------------------------
        # 3️⃣ Class Sections
        # -------------------------
        fy_cse = ClassSection(
            name="FY CSE A",
            semester=1,
            department_id=cse.id,
            tenant_id=tenant.id
        )

        sy_cse = ClassSection(
            name="SY CSE A",
            semester=3,
            department_id=cse.id,
            tenant_id=tenant.id
        )

        self.db.add_all([fy_cse, sy_cse])
        self.db.commit()
        self.db.refresh(fy_cse)
        self.db.refresh(sy_cse)

        # -------------------------
        # 4️⃣ Teachers
        # -------------------------
        teacher1 = Teacher(
            name="Dr. Patil",
            email="patil@snjb.edu",
            department_id=cse.id,
            tenant_id=tenant.id
        )

        teacher2 = Teacher(
            name="Prof. Sharma",
            email="sharma@snjb.edu",
            department_id=cse.id,
            tenant_id=tenant.id
        )

        self.db.add_all([teacher1, teacher2])
        self.db.commit()
        self.db.refresh(teacher1)
        self.db.refresh(teacher2)

        # -------------------------
        # 5️⃣ Subjects
        # -------------------------
        python = Subject(
            name="Python Programming",
            code="CSE101",
            department_id=cse.id,
            tenant_id=tenant.id
        )

        ds = Subject(
            name="Data Structures",
            code="CSE201",
            department_id=cse.id,
            tenant_id=tenant.id
        )

        self.db.add_all([python, ds])
        self.db.commit()
        self.db.refresh(python)
        self.db.refresh(ds)

        # -------------------------
        # 6️⃣ Assign Subjects to Class (Auto Assignment)
        # -------------------------
        fy_python = ClassSubject(
            class_id=fy_cse.id,
            subject_id=python.id,
            tenant_id=tenant.id
        )

        sy_ds = ClassSubject(
            class_id=sy_cse.id,
            subject_id=ds.id,
            tenant_id=tenant.id
        )

        self.db.add_all([fy_python, sy_ds])
        self.db.commit()

        # -------------------------
        # 7️⃣ Timetable (Recurring Schedule)
        # -------------------------
        timetable1 = Timetable(
            class_id=fy_cse.id,
            subject_id=python.id,
            teacher_id=teacher1.id,
            day_of_week=0,  # Monday
            start_time=time(10, 0),
            end_time=time(11, 0),
            tenant_id=tenant.id
        )

        timetable2 = Timetable(
            class_id=sy_cse.id,
            subject_id=ds.id,
            teacher_id=teacher2.id,
            day_of_week=1,  # Tuesday
            start_time=time(11, 0),
            end_time=time(12, 0),
            tenant_id=tenant.id
        )

        self.db.add_all([timetable1, timetable2])
        self.db.commit()

        # -------------------------
        # 8 Students
        # -------------------------
        
        # Get first class (example: FY CSE A)
        class_section = self.db.query(ClassSection).first()

        if not class_section:
            print("❌ No class found. Run ERPSeeder first.")
            return

        students_data = [
            {
                "name": "Rahul Patil",
                "email": "rahul.patil@student.edu",
                "mobile": "9876543210",
                "roll_no": "FY001",
                "university_prn": "PRN001",
                "aadhaar_number": "123412341234",

                "address_line1": "Gandhi Nagar",
                "address_line2": "Near Bus Stand",
                "city": "Nashik",
                "state": "Maharashtra",
                "pincode": "422001",
                "country": "India",

                "tenth_school": "ABC High School",
                "tenth_percentage": 88.5,
                "tenth_board": "State",
                "tenth_year": 2020,

                "twelfth_school": "XYZ Junior College",
                "twelfth_percentage": 82.3,
                "twelfth_board": "State",
                "twelfth_year": 2022,

                "father_name": "Mahesh Patil",
                "father_mobile": "9876000001",
                "father_occupation": "Farmer",

                "mother_name": "Sunita Patil",
                "mother_mobile": "9876000002",
                "mother_occupation": "Housewife",

                "sibling_info": [
                    {"name": "Rohit", "age": 14, "education": "9th"}
                ],

                "emergency_contacts": [
                    {"name": "Uncle", "mobile": "9999999999"}
                ],

                "documents": [],
                "profile_photo": None,
            },

            {
                "name": "Amit Sharma",
                "email": "amit.sharma@student.edu",
                "mobile": "9876543211",
                "roll_no": "FY002",
                "university_prn": "PRN002",
                "aadhaar_number": "123412341235",

                "address_line1": "Shivaji Nagar",
                "address_line2": "",
                "city": "Pune",
                "state": "Maharashtra",
                "pincode": "411001",
                "country": "India",

                "tenth_school": "Modern School",
                "tenth_percentage": 90.0,
                "tenth_board": "CBSE",
                "tenth_year": 2020,

                "twelfth_school": "Modern Junior College",
                "twelfth_percentage": 85.4,
                "twelfth_board": "CBSE",
                "twelfth_year": 2022,

                "father_name": "Rakesh Sharma",
                "father_mobile": "9876000003",
                "father_occupation": "Business",

                "mother_name": "Neeta Sharma",
                "mother_mobile": "9876000004",
                "mother_occupation": "Teacher",

                "sibling_info": [],
                "emergency_contacts": [],
                "documents": [],
                "profile_photo": None,
            },
        ]
        students = []

        for data in students_data:
            student = Student(
                name=data["name"],
                email=data["email"],
                mobile=data["mobile"],
                roll_no=data["roll_no"],

                university_prn=data["university_prn"],
                aadhaar_number=data["aadhaar_number"],

                address_line1=data["address_line1"],
                address_line2=data["address_line2"],
                city=data["city"],
                state=data["state"],
                pincode=data["pincode"],
                country=data["country"],

                tenth_school=data["tenth_school"],
                tenth_percentage=data["tenth_percentage"],
                tenth_board=data["tenth_board"],
                tenth_year=data["tenth_year"],

                twelfth_school=data["twelfth_school"],
                twelfth_percentage=data["twelfth_percentage"],
                twelfth_board=data["twelfth_board"],
                twelfth_year=data["twelfth_year"],

                father_name=data["father_name"],
                father_mobile=data["father_mobile"],
                father_occupation=data["father_occupation"],

                mother_name=data["mother_name"],
                mother_mobile=data["mother_mobile"],
                mother_occupation=data["mother_occupation"],

                sibling_info=data.get("sibling_info"),
                emergency_contacts=data.get("emergency_contacts"),
                documents=data.get("documents"),

                profile_photo=data.get("profile_photo"),

                class_id=class_section.id,
                tenant_id=class_section.tenant_id,

                # Face empty for now
                is_face_registered=False,
                face_embedding=None,
            )

            students.append(student)

        self.db.add_all(students)
        self.db.commit()


        print("✅ ERP SaaS Seed Data Inserted Successfully!")