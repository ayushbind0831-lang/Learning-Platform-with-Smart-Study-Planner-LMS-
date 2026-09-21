from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


# =========================
# User Model
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    # One User → Many Courses
    courses = relationship(
        "Course",
        back_populates="owner"
    )


# =========================
# Course Model
# =========================
class Course(Base):
    __tablename__ = "courses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    course_name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    difficulty = Column(
        String(20),
        default="Medium"
    )

    start_date = Column(
        Date,
        nullable=True
    )

    end_date = Column(
        Date,
        nullable=True
    )

    # Course belongs to User
    owner = relationship(
        "User",
        back_populates="courses"
    )

    # One Course → Many Tasks
    tasks = relationship(
        "Task",
        back_populates="course"
    )


# =========================
# Task Model
# =========================
class Task(Base):
    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    title = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    deadline = Column(
        DateTime,
        nullable=True
    )

    estimated_hours = Column(
        Float,
        default=1.0
    )

    priority = Column(
        String(20),
        default="Medium"
    )

    status = Column(
        String(20),
        default="Pending"
    )

    # Task belongs to Course
    course = relationship(
        "Course",
        back_populates="tasks"
    )