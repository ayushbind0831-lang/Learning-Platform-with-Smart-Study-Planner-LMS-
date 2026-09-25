# StudySmart — Intelligent Study Planner & LMS

> A full-stack web application designed to help students streamline course management, track assignments, and automatically generate optimized daily study schedules based on deadlines, task priorities, and course difficulty.

---

## 🌟 Key Features

1. **Authentication & Security**: Secure registration and login using JWT bearer tokens and native `bcrypt` password hashing.
2. **Course Management (CRUD)**: Create, view, edit, and delete courses with customizable difficulty ratings (Easy, Medium, Hard) and academic terms.
3. **Task & Assignment Tracker**: Track deadlines, estimated hours, course associations, and toggle completion statuses. Filter tasks by course.
4. **Smart Study Planner**: Rule-based priority algorithm that automatically allocates available study hours to the most urgent tasks according to deadlines, priorities, and course difficulty.
5. **Real-time Progress Tracking**: Live calculated completion percentages and task ratios per course.
6. **Smart Reminders**: Live notifications in the navigation bar for overdue and due-today assignments (with 60-second polling).
7. **Visual Analytics**: Interactive Chart.js breakdown of task completion statuses and progress distributions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM 7, Axios, Chart.js, react-chartjs-2 |
| **Styling** | Modern Vanilla CSS Design System (Dark mode, Glassmorphism, Google Fonts Outfit & Inter) |
| **Backend** | FastAPI, SQLAlchemy, Pydantic v2, Python-JOSE (JWT), Native Bcrypt |
| **Database** | SQLite (development) — easily swappable with PostgreSQL via SQLAlchemy |

---

## 📂 Project Structure

```
study smart/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, middleware & router registration
│   │   ├── database.py           # SQLite connection & sessionmaker
│   │   ├── models.py             # User, Course, Task, Reminder SQLAlchemy models
│   │   ├── schemas.py            # Pydantic validation schemas
│   │   ├── core/
│   │   │   └── dependencies.py   # JWT authentication dependency (get_current_user)
│   │   ├── router/
│   │   │   ├── auth.py           # /register, /login, /me endpoints
│   │   │   ├── courses.py        # Course CRUD + progress endpoint
│   │   │   ├── tasks.py          # Task CRUD + status toggling
│   │   │   ├── planner.py        # Smart schedule generation endpoint
│   │   │   ├── progress.py       # Live course progress overview
│   │   │   ├── reminders.py      # Live notifications & deadlines
│   │   │   └── analytics.py      # Summary metrics & chart distributions
│   │   ├── services/
│   │   │   ├── planner_service.py    # Scoring & slot generation logic
│   │   │   ├── progress_service.py   # Percentage calculations
│   │   │   └── reminder_service.py   # Overdue & due-soon detection
│   │   └── utils/
│   │       ├── jwt_handler.py    # Token creation & decoding
│   │       └── security.py       # Native bcrypt password hashing
│   ├── .env                      # Secret keys & environment variables
│   ├── requirements.txt          # Python dependencies
│   └── studysmart.db             # SQLite database
│
├── src/                          # React Frontend
│   ├── pages/
│   │   ├── LoginPage.jsx         # Sign in with JWT persistence
│   │   ├── RegisterPage.jsx      # User account registration
│   │   ├── Dashboard.jsx         # Personalized study overview & quick actions
│   │   ├── Courses.jsx           # Course CRUD & modal management
│   │   ├── Tasks.jsx             # Task manager with filters and status toggles
│   │   ├── Planner.jsx           # Daily study plan generator
│   │   ├── Progress.jsx          # Academic progress visualization
│   │   └── Analytics.jsx         # Interactive charts & productivity metrics
│   ├── components/
│   │   ├── Navbar.jsx            # Responsive navigation & reminders dropdown
│   │   ├── CourseCard.jsx        # Glassmorphic course display card
│   │   ├── CourseForm.jsx        # Modal form for course creation/editing
│   │   ├── PlannerSlot.jsx       # Individual study interval slot
│   │   └── ProgressBar.jsx       # Glowing progress bar component
│   ├── services/
│   │   └── api.js                # Axios instance with Authorization interceptor
│   ├── chartSetup.js             # Chart.js element registration
│   ├── App.jsx                   # React Router routing
│   ├── index.css                 # Global theme & design system
│   └── main.jsx                  # React application root
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.10+)

### 1. Backend Setup

```bash
cd backend

# Create & activate a virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- API will be accessible at: `http://127.0.0.1:8000`
- Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

From the **project root directory** (where `package.json` resides):

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
- Frontend will be accessible at: `http://localhost:5173`

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new student account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/courses/` | List all user courses | Yes |
| `POST` | `/api/courses/` | Create a new course | Yes |
| `PUT` | `/api/courses/{id}` | Update course details | Yes |
| `DELETE`| `/api/courses/{id}` | Delete a course | Yes |
| `GET` | `/api/tasks/` | List tasks (optional filter by `course_id`) | Yes |
| `POST` | `/api/tasks/` | Create a new task | Yes |
| `PUT` | `/api/tasks/{id}` | Update task or toggle status | Yes |
| `DELETE`| `/api/tasks/{id}` | Delete a task | Yes |
| `POST` | `/api/planner/generate` | Generate prioritized study schedule | Yes |
| `GET` | `/api/progress/overview` | Course completion stats & percentages | Yes |
| `GET` | `/api/reminders/` | Urgent notifications & overdue alerts | Yes |
| `GET` | `/api/analytics/summary` | Summary stats (tasks, rate, overdue) | Yes |
| `GET` | `/api/analytics/task-completion` | Status distribution for charts | Yes |

---

## 🧠 Smart Planner Scheduling Algorithm

The study planner uses a deterministic priority algorithm to schedule tasks:
$$\text{Priority Score} = \text{Urgency Factor} \times \text{Course Difficulty Multiplier} \times \text{Task Priority Weight}$$

1. **Urgency**: Calculated using the time remaining until the assignment deadline.
2. **Course Difficulty**: Weights assigned to courses (Hard = 1.5, Medium = 1.0, Easy = 0.8).
3. **Task Priority**: Weights for High (1.5), Medium (1.0), and Low (0.7).
4. **Time Slot Allocation**: Available hours are partitioned starting at the requested start time, chunking study slots efficiently.

---

## 📄 License
MIT
