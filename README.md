# College ERP System

This repository contains a college ERP project with:

- a `FastAPI` backend in `app/`
- a `Next.js` frontend in `Frontend/`
- attendance, timetable, analytics, and face-recognition related flows

The goal of this README is to explain the complete project flow in simple terms so a new developer can understand how the system is supposed to work end to end.

## Project Overview

The system is designed for college administration. It manages:

- students
- teachers
- subjects
- class sections
- timetable and lectures
- daily attendance
- face-recognition based student identification
- analytics and reports

At a high level, the expected flow is:

1. Admin uses the frontend dashboard.
2. Frontend sends API requests to the FastAPI backend.
3. Backend routes call service-layer logic.
4. Services use repository/database code to read or update data.
5. Data is stored in SQLite in the current local setup.
6. The frontend shows the result back in the dashboard.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- shadcn/ui components

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- Alembic files are present

### Database

- SQLite in the current local configuration
- database file: `app/test.db` by code configuration, though a `test.db` file also exists at the repo root

## Repository Structure

```text
.
├── app/                  # FastAPI backend
│   ├── api/              # API routers
│   ├── core/             # config, scheduler, utilities, face utilities
│   ├── db/               # models, schemas, repositories, seed data
│   ├── services/         # business logic
│   ├── alembic/          # migration-related files
│   ├── main.py           # backend entrypoint
│   └── seed.py           # seed script
├── Frontend/             # Next.js frontend
│   ├── app/              # app router pages
│   ├── components/       # UI and feature components
│   ├── contexts/         # auth, sidebar, tenant state
│   ├── hooks/            # frontend data hooks
│   ├── lib/              # API client, constants, demo data
│   └── types/            # TypeScript types
├── TODO.md
├── TODO2.md
└── README.md
```

## Backend Flow

The backend follows this structure:

`Route -> Service -> Repository -> Database`

### 1. App Startup

The backend starts from [app/main.py](/c:/project%20final/app/main.py).

On startup it:

- creates the FastAPI app
- creates database tables using `Base.metadata.create_all(bind=engine)`
- enables CORS for the frontend
- mounts all API routes under `/api/v1`
- redirects `/` to `/docs`

Main API base URL:

```text
http://localhost:8000/api/v1
```

Swagger docs:

```text
http://localhost:8000/docs
```

### 2. Router Layer

The main router is defined in [app/api/base_router.py](/c:/project%20final/app/api/base_router.py).

It includes modules for:

- `/students`
- `/attendance`
- `/tenant`
- `/departments`
- `/class-sections`
- `/subjects`
- `/teachers`
- `/timetables`
- `/lectures`
- `/analytics`

This layer receives the HTTP request and forwards the work to the service layer.

### 3. Service Layer

The service layer contains the business logic. Examples:

- `student_service.py`
- `student_face_service.py`
- `teacher_service.py`
- `timetable_service.py`
- `lecture_service.py`
- `analytics_service.py`

This layer is where the project decides:

- how student data is validated
- how student payloads are shaped
- how face embeddings are generated
- how attendance should be marked after recognition
- how related data like department and class section should be assembled

### 4. Repository Layer

The repository files inside `app/db/repository/` handle database reads and writes.

Typical responsibility of this layer:

- fetch rows by id
- list records
- insert new records
- update existing records
- delete records
- run custom matching logic like face-embedding lookup

### 5. Database Layer

The database session is configured in [app/db/session.py](/c:/project%20final/app/db/session.py).

Current local behavior:

- SQLAlchemy engine is created from `settings.SQLALCHEMY_DATABASE_URL`
- SQLite is used with `check_same_thread=False`
- `get_db()` provides one session per request

Configuration is defined in [app/core/config.py](/c:/project%20final/app/core/config.py).

Right now the code points to:

```text
sqlite:///.../app/test.db
```

## Frontend Flow

The frontend is a dashboard-style Next.js app inside [Frontend](/c:/project%20final/Frontend).

### 1. User Enters the App

Main routes include:

- `/`
- `/landing`
- `/login`
- `/admin`
- `/admin/students`
- `/admin/teachers`
- `/admin/timetable`
- `/admin/attendance`
- `/admin/attendance/face-recognition`
- `/admin/analytics`

### 2. Layout and Contexts

The frontend uses:

- root layout
- admin layout
- auth layout
- auth context
- sidebar context
- tenant context

These provide shared state and dashboard structure across pages.

### 3. API Client

The frontend API client is defined in [Frontend/lib/api.ts](/c:/project%20final/Frontend/lib/api.ts).

It uses Axios and wraps:

- `get`
- `post`
- `put`
- `delete`

The configured base URL is defined in [Frontend/lib/constants.ts](/c:/project%20final/Frontend/lib/constants.ts):

```text
NEXT_PUBLIC_API_BASE_URL || http://localhost:8000/api/v1
```

### 4. UI Data Flow

The intended frontend flow is:

1. page or hook calls `apiClient`
2. request is sent to backend
3. backend returns JSON
4. frontend maps backend response into UI-friendly shape
5. component renders the result

Example:

- [Frontend/hooks/useStudents.ts](/c:/project%20final/Frontend/hooks/useStudents.ts) fetches `/students`
- it maps backend student data to the frontend `Student` shape
- the students UI can then render names, roll numbers, department, and face status

## Core Functional Flows

## Student Management Flow

This is the most complete API-backed flow in the project.

### Create Student

1. Frontend collects student details.
2. Frontend sends `POST /students`.
3. Backend route calls `StudentService.create_student`.
4. Service validates data like Aadhaar and PRN length.
5. Repository creates the student record.
6. Service serializes the record before returning it.
7. Frontend updates the UI with the new student.

### Get Students

1. Frontend calls `GET /students`.
2. Route calls `StudentService.get_all_students`.
3. Service fetches all students from repository.
4. Service enriches each student with department and year information.
5. Frontend maps the response into dashboard rows/cards.

### Update Student

1. Frontend sends `PUT /students/{student_id}`.
2. Service removes restricted fields like `face_embedding`.
3. Repository updates the student record.
4. Backend returns success message and id.

### Delete Student

1. Frontend sends `DELETE /students/{student_id}`.
2. Service deletes the record through repository.
3. Backend returns a success message.

## Face Registration Flow

Face registration is handled through:

```text
POST /api/v1/students/{student_id}/face
```

Flow:

1. Admin selects a student and uploads an image.
2. Backend reads the uploaded image file.
3. `StudentFaceService` converts image bytes into an image object.
4. Face utilities generate a face embedding.
5. Repository stores the embedding for that student.
6. Student is marked as face-registered.
7. Backend returns confirmation.

Important backend file:

- [app/services/student_face_service.py](/c:/project%20final/app/services/student_face_service.py)

## Face Recognition Attendance Flow

This is the key smart flow in the project.

Recognition endpoint:

```text
POST /api/v1/students/recognize
```

Flow:

1. User opens the face-recognition page.
2. Browser camera captures an image.
3. Frontend converts the frame into `FormData`.
4. Frontend sends the image to `/students/recognize`.
5. Backend generates a face embedding from the uploaded image.
6. Repository compares the embedding with stored student embeddings.
7. If a match is found, the backend identifies the student.
8. `StudentService.mark_attendance_for_today` runs automatically.
9. The recognized student is returned to the frontend.
10. Frontend shows the recognized student and links to student or attendance pages.

What attendance marking currently does:

- finds all students for the same tenant
- marks the recognized student as `present`
- creates `absent` records for other students if no daily record exists yet
- stores those records in the attendance table for the current day

Important backend files:

- [app/services/student_service.py](/c:/project%20final/app/services/student_service.py)
- [app/services/student_face_service.py](/c:/project%20final/app/services/student_face_service.py)
- [app/api/v1/route_attendance.py](/c:/project%20final/app/api/v1/route_attendance.py)

Important frontend file:

- [Frontend/app/admin/attendance/face-recognition/page.tsx](/c:/project%20final/Frontend/app/admin/attendance/face-recognition/page.tsx)

## Attendance Reporting Flow

Attendance API:

```text
GET /api/v1/attendance/today
```

Flow:

1. Backend accepts an optional date.
2. It fetches attendance records for that date.
3. It joins each record with student details.
4. It counts present and absent records.
5. It returns summary totals plus detailed records.

This is meant to drive:

- attendance dashboard views
- day-wise review
- reporting and analytics

## Academic Flow

The academic side of the project is split across:

- departments
- class sections
- subjects
- teachers
- timetable
- lectures

The intended flow is:

1. Create department.
2. Create class section under department.
3. Create subjects.
4. Assign teachers.
5. Create timetable entries.
6. Generate or manage lectures.
7. Use those lecture definitions to support attendance and analytics.

Backend service files suggest this direction:

- `department_service.py`
- `class_section_service.py`
- `subject_service.py`
- `teacher_service.py`
- `timetable_service.py`
- `lecture_service.py`
- `auto_lecture_service.py`

## Analytics Flow

Analytics is exposed through the backend router and service layer.

The expected analytics flow is:

1. System collects student, attendance, timetable, and lecture data.
2. Analytics service aggregates this data.
3. Backend returns dashboard-friendly summaries.
4. Frontend displays cards, tables, or charts.

There is also a frontend analytics page under:

- [Frontend/app/admin/analytics/page.tsx](/c:/project%20final/Frontend/app/admin/analytics/page.tsx)

## Current Integration Status

This project is partly integrated and partly still using demo/mock frontend data.

### Backend-connected parts

- backend API structure
- student CRUD APIs
- face registration API
- student recognition API
- today attendance API
- frontend API client
- `useStudents` hook for backend student fetch/create/delete

### Demo-data-driven frontend parts

Some admin pages still use:

- [Frontend/lib/admin-demo-data.ts](/c:/project%20final/Frontend/lib/admin-demo-data.ts)

That means parts of the UI currently show local mock data instead of backend data, especially pages like:

- students overview page
- attendance dashboard page
- some analytics and academic screens

So the current practical flow is mixed:

- some features are real API flows
- some screens are still prototype/dashboard mock flows

## How To Run The Project

## Backend

From the backend folder:

```bash
cd app
python -m venv venv
venv\Scripts\activate
pip install -r requirement.txt
python main.py
```

Backend runs on:

```text
http://localhost:8000
```

## Frontend

From the frontend folder:

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

Optional environment variable for frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## End-to-End Example

A simple end-to-end project story looks like this:

1. Admin opens the frontend dashboard.
2. Admin creates a student.
3. Backend stores the student in the database.
4. Admin uploads that student's face.
5. Backend generates and stores the face embedding.
6. Admin opens the face-recognition page.
7. Camera captures the student image.
8. Frontend sends the image to the backend.
9. Backend recognizes the face.
10. Backend marks attendance for the day.
11. Attendance data becomes available for reports and analytics.

## Suggested Next Improvements

- connect all admin pages to real backend APIs
- standardize one database location and one config source
- add authentication and authorization
- add proper migrations and migration workflow
- add tests for student, attendance, and recognition flows
- connect analytics screens to real aggregated backend data
- document environment variables in one place

## Summary

This project already has a solid base architecture:

- frontend dashboard for ERP workflows
- backend with route/service/repository separation
- face-recognition attendance flow
- student and attendance core modules

The main thing still in progress is full frontend-to-backend integration across every module. The student and recognition flows give the clearest picture of how the final system is supposed to work.
