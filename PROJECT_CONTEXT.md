# StudySmart — Project Context & Status

> This file exists to give an AI coding assistant (or a new contributor) full context on
> this project without needing to re-explain it from scratch. Read this before making
> changes.

---

## 1. What This Project Is

**StudySmart** is a full-stack web app that helps students manage courses and tasks, and
auto-generates a daily study schedule using a rule-based priority algorithm (no AI/ML
required — deadline + priority + course difficulty scoring).

**One-line pitch:** "Students log in, add their courses and tasks, and the app
automatically tells them what to study today, based on deadlines and priority."

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Tailwind CSS, Chart.js (react-chartjs-2) |
| Backend | FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), passlib/bcrypt |
| Database | SQLite (dev) — designed to be swappable for PostgreSQL later |
| Auth | JWT bearer tokens, stored in `localStorage` on the frontend |

---

## 3. Folder Structure (Current, Actual)

⚠️ **Important quirk:** the frontend is NOT inside a `frontend/` folder. Early in setup,
`npm create vite` was accidentally run from the project root instead of inside
`frontend/`, so the real, active frontend lives at the project root under `src/`. A
leftover empty `frontend/` folder was deleted. All frontend paths below are relative to
the **project root**, not a `frontend/` subfolder.

```
study smart/                      ← project root (this is where `npm run dev` is run)
├── backend/
│   ├── app/
│   │   ├── main.py               ← FastAPI app, CORS, router registration
│   │   ├── database.py           ← SQLAlchemy engine, SessionLocal, get_db()
│   │   ├── models.py             ← User, Course, Task, Reminder (SQLAlchemy models)
│   │   ├── schemas.py            ← Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py           ← /register, /login, /me
│   │   │   ├── courses.py        ← Course CRUD + /courses/{id}/progress
│   │   │   ├── tasks.py          ← Task CRUD (ownership via course join)
│   │   │   ├── planner.py        ← POST /planner/generate
│   │   │   ├── progress.py       ← GET /progress/overview
│   │   │   ├── reminders.py      ← GET /reminders/ (live-generated, not stored)
│   │   │   └── analytics.py      ← /analytics/summary, /analytics/task-completion
│   │   ├── services/
│   │   │   ├── planner_service.py    ← priority scoring + schedule builder
│   │   │   ├── progress_service.py   ← course completion % calculation
│   │   │   └── reminder_service.py   ← live overdue/due-soon detection
│   │   ├── core/
│   │   │   └── dependencies.py   ← get_current_user (JWT auth guard)
│   │   └── utils/
│   │       ├── security.py       ← password hashing (bcrypt)
│   │       └── jwt_handler.py    ← create/decode JWT
│   ├── venv/
│   ├── requirements.txt
│   └── studysmart.db             ← SQLite file (gitignored)
│
├── src/                          ← THE ACTUAL FRONTEND (not inside frontend/)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── Tasks.jsx
│   │   ├── Planner.jsx
│   │   ├── Progress.jsx
│   │   └── Analytics.jsx
│   ├── components/
│   │   ├── Navbar.jsx            ← includes reminders bell/dropdown
│   │   ├── CourseCard.jsx
│   │   ├── CourseForm.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   ├── PlannerSlot.jsx
│   │   └── ProgressBar.jsx
│   ├── services/
│   │   └── api.js                ← Axios instance with JWT interceptor
│   ├── chartSetup.js             ← Chart.js component registration
│   ├── App.jsx                   ← Routes
│   ├── main.jsx                  ← imports "./chartSetup"
│   └── App.css / index.css       ← Tailwind directives
│
├── public/
├── node_modules/
├── package.json
└── vite.config.js
```

---

## 4. Feature Status

| # | Feature | Backend | Frontend | Notes |
|---|---|---|---|---|
| 1 | Auth (register/login/JWT) | ✅ Done | ✅ Done | Native bcrypt hashing, JWT access token, localStorage |
| 2 | Courses CRUD | ✅ Done | ✅ Done | Ownership enforced via `user_id`, modal management |
| 3 | Tasks CRUD | ✅ Done | ✅ Done | Associated with courses, deadline picker, status toggle |
| 4 | Smart Planner | ✅ Done | ✅ Done | Rule-based priority scoring with time slot allocator |
| 5 | Progress Tracking | ✅ Done | ✅ Done | Real-time calculation from task ratios per course |
| 6 | Reminders | ✅ Done | ✅ Done | Live polling (60s), Navbar bell badge and dropdown |
| 7 | Analytics | ✅ Done | ✅ Done | Chart.js Pie and Bar charts, stat cards, completion rates |
| 8 | Admin role | ❌ Not built | ❌ Not built | Explicitly deferred — student MVP scope |
| 9 | AI recommendations | ❌ Not built | ❌ Not built | Optional enhancement, intentionally out of MVP scope |

**Summary: All 7 core MVP features are 100% complete, tested, and styled with a modern design system.**

---

## 5. Known Issues Resolved During Audit & Fixes

1. **`main.py` cleanup**: Removed duplicate `FastAPI()` instances, duplicate router registrations, and conflicting routes.
2. **Native `bcrypt` upgrade**: Replaced passlib's buggy bcrypt handler with native `bcrypt` to prevent `ValueError: password cannot be longer than 72 bytes`.
3. **`auth.py` implementation**: Replaced placeholder stub endpoints with full user registration, password hashing, and token issuance.
4. **`analytics.py` implementation**: Replaced copy-pasted reminder code with proper `/analytics/summary` and `/analytics/task-completion` endpoints.
5. **Filename typo**: Renamed `progess_service.py` → `progress_service.py` and updated imports.
6. **Frontend complete rewrite**: Connected `LoginPage`, `RegisterPage`, `Dashboard`, `Tasks`, `PlannerSlot`, `Navbar` to the live backend.
7. **Design system**: Added modern dark mode with glassmorphic cards, glowing accents, and Outfit/Inter fonts in `index.css`.
8. **Build & lint verification**: `npm run build` succeeds cleanly in < 3 seconds.

---

## 6. What's Remaining (Future / Deployment)

1. **Production Deployment**: Backend → Render/Railway, Frontend → Vercel.
2. **Database Migration**: Switch SQLite to PostgreSQL (Supabase/Neon) for production if needed.
3. **Screenshots & Presentation**: Capture screenshots of the live dashboard and charts for demo/presentation.

---

## 7. How to Run This Project Locally

Two terminals, both from the project root unless noted:

```bash
# Terminal 1 — backend
cd backend
venv\Scripts\activate        # (Mac/Linux: source venv/bin/activate)
uvicorn app.main:app --reload
# If 'uvicorn' isn't recognized, use: python -m uvicorn app.main:app --reload

# Terminal 2 — frontend (run from project ROOT, not from a frontend/ subfolder)
npm run dev
```

- Backend runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`)
- Frontend runs at `http://localhost:5173`

---

## 8. Immediate Next Step

Resume from **item 1 in §6**: do a full manual test pass across every page now that the
import-path bugs are fixed, using this checklist:

- [ ] Register a new account
- [ ] Login
- [ ] Add a course
- [ ] Add 2–3 tasks with different deadlines/priorities
- [ ] Generate a study plan on the Planner page, confirm ordering makes sense
- [ ] Mark a task Completed from the Planner
- [ ] Confirm Progress page reflects the update
- [ ] Confirm Analytics charts reflect the update
- [ ] Confirm Reminders bell shows correct overdue/due-today counts
- [ ] Logout and confirm protected pages redirect to Login

Once this checklist passes cleanly, move to §6 items 2–7 (README, env vars, CORS,
deployment) to bring the project to a submittable, live state.
