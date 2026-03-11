
# 🎓 College ERP Backend – Face Recognition Attendance System

## 📌 Introduction

This project is a **scalable, multi-tenant College ERP backend** built with **FastAPI** and **SQLAlchemy**, designed to power:

* 🎓 Student Management
* 👨‍🏫 Teacher & Academic Management
* 📅 Timetable System
* 🎥 Face Recognition Attendance
* 📊 Role-Based Analytics Dashboard
* 🏢 Multi-College (Tenant) Support

The system is built as a modular SaaS-ready backend and supports future scaling into a full enterprise ERP platform.

---

### ⚙️ Tech Stack

* **Python 3.10+**
* **FastAPI**
* **SQLAlchemy**
* **PostgreSQL**
* **Alembic**
* **Pydantic**
* **Uvicorn**
* Face recognition integration ready
* JWT authentication ready

---

### 🖥 Supported Platforms

* macOS
* Linux
* Windows (WSL recommended)

---

# 🚀 Getting Started

Follow these essential steps to run the backend locally.

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/aniketArun/snjb-erp.git
cd snjb-erp
```

---

## 2️⃣ Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/college_erp
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 5️⃣ Setup Database

Migrate database:

```bash
cd app
alembic revision --autogenerate -m "init"
```

Run migrations:

```bash
alembic upgrade head
```
seed database:

```bash
python seed.py
```
---

## 6️⃣ Run Server

```bash
uvicorn app.main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

Swagger UI will be available for testing APIs.

---

# 📦 Latest Release

Latest stable release is available under:

```
GitHub → Releases section
```

For installing via packaging (future):

```
pip install snjb-erp
```

---

# 🔎 Example API Usage

### Create Student

```python
import requests

payload = {
    "name": "Rahul Patil",
    "class_id": 1,
    "tenant_id": 1
}

response = requests.post("http://127.0.0.1:8000/students/", json=payload)
print(response.json())
```

### Sample Output

```json
{
  "id": 1,
  "name": "Rahul Patil",
  "roll_no": null,
  "class_id": 1,
  "tenant_id": 1
}
```

---

# 🛠 Build Steps for Developers

If you are contributing or building from a fresh clone:

---

## Required Tools

* Python 3.10+
* PostgreSQL 14+
* Alembic
* pip
* Git

---

## Clean Build Steps

1. Clone repository
2. Create virtual environment
3. Install dependencies
4. Setup `.env`
5. Create PostgreSQL DB
6. Run migrations
7. Start server

---

## Run Tests

After build is successful:

```bash
pytest
```

For coverage:

```bash
pytest --cov=app
```

Developers should run tests before pushing changes to ensure nothing breaks.

---

# 🧪 Running Seed Data (Optional)

```bash
python app/seed.py
```

---

# 📂 Project Structure

```
app/
  services/
  api/
    v1/
  core/
  db/
    models/
    schemas/
    repository/
    seed/
  main.py
  seed.py   #database seeder
```

Architecture pattern:

* Router → Service → Repository → DB

---

# 🤝 Contributing

We welcome contributions!

---

## 🐞 Reporting Issues

Please open issues here:

```
GitHub → Issues
```

Include:

* Steps to reproduce
* Expected behavior
* Screenshots (if applicable)

---

## 💡 Feature Requests

Open a feature request with:

* Clear problem statement
* Suggested solution
* Use case scenario

---

## 🧑‍💻 Developer Guidelines

* Follow PEP8
* Use type hints
* Use service layer for business logic
* Write unit tests
* Do not commit secrets
* Keep multi-tenant structure intact
* Use migrations for DB changes

---

## Pull Request Rules

* Create feature branch
* Add tests
* Ensure lint passes
* Provide clear PR description

---

## 📜 License

This project is released under the **MIT License**.

See `LICENSE` file for full details.

---

# 📢 Community & Support

For help:

* Open GitHub Issue
* Contact maintainers
* Internal Slack / Discord (if applicable)

---

# 🚀 Roadmap

* Face recognition automation
* AI-based attendance prediction
* Parent portal
* Mobile API
* Notification engine
* SaaS billing integration
* Microservice migration

---


