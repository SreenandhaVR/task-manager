# Task Manager — Full Stack App

A full-stack Task & Notes Management System built with **FastAPI + PostgreSQL** (backend) and **React + Vite + Zustand** (frontend).

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | FastAPI, SQLAlchemy (async), PostgreSQL, Alembic, JWT |
| Frontend | React, Vite, Zustand, Axios, React Router, Tailwind CSS |
| Testing | Pytest (backend), React Testing Library + Vitest (frontend) |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── tasks.py
│   │       └── notes.py
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── 0001_initial.py
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_tasks.py
│   ├── .env
│   ├── alembic.ini
│   ├── pytest.ini
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── store/authStore.js
    │   ├── store/taskStore.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── TaskDetail.jsx
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── CreateTaskModal.jsx
    │   ├── tests/
    │   │   ├── setup.js
    │   │   ├── TaskList.test.jsx
    │   │   └── AddTask.test.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/taskmanager
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> Replace `postgres`, `password`, and `taskmanager` with your actual PostgreSQL credentials and database name.

---

## Backend Setup

### 1. Create and activate virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create the PostgreSQL database

```bash
psql -U postgres
CREATE DATABASE taskmanager;
\q
```

### 4. Run Alembic migrations

```bash
# Run initial migration (creates all tables with correct ENUMs)
alembic upgrade head
```

### 5. Start the backend server

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
Swagger UI: `http://localhost:8000/docs`

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Migration Steps (Alembic)

```bash
cd backend

# Create a new migration (after model changes)
alembic revision --autogenerate -m "describe your change"

# Apply all pending migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1

# View migration history
alembic history
```

> **Important:** The initial migration handles PostgreSQL ENUMs (`taskstatus`, `notetype`) correctly using native `sa.Enum` with `create_type=True`.

---

## Running Tests

### Backend tests (Pytest)

```bash
cd backend
pytest -v
```

Tests cover:
- Task creation
- Task filtering by status
- Note creation

Uses an in-memory **SQLite** test database — no PostgreSQL required for tests.

### Frontend tests (Vitest + React Testing Library)

```bash
cd frontend
npm run test:run
```

Tests cover:
- Task list rendering (renders all tasks, correct count, empty state)
- Add task flow (form renders, onSubmit called with correct data)

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks/` | Create task |
| GET | `/tasks/` | Get all tasks (filter: `?status=` `?assigned_to=`) |
| GET | `/tasks/{id}` | Get task by ID |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks/{id}/notes/` | Add note to task |
| GET | `/tasks/{id}/notes/` | Get all notes for task |

---

## Git Branch Strategy

```
main              ← stable, submission-ready
feature/backend   ← backend development
feature/frontend  ← frontend development
feature/tests     ← test additions
```

---

## Screenshots

| Page | Description |
|------|-------------|
| Login | Auth page with register/login toggle |
| Dashboard | Kanban board with Todo / In Progress / Done columns |
| Task Detail | Task info, status update, notes (User + AI) |
| Create Task | Modal with title, description, status, assign user |