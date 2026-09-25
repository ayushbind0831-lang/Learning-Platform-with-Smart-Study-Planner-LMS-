import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import api from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get("/courses/");
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err.response?.data?.detail || "Unable to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (courseData) => {
    try {
      setError("");

      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, courseData);
      } else {
        await api.post("/courses/", courseData);
      }

      setShowForm(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      setError(
        err.response?.data?.detail || "Unable to save course. Please try again."
      );
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? All associated tasks will also be affected.")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/courses/${courseId}`);
      await fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(
        err.response?.data?.detail || "Unable to delete course. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Courses</h1>
          <p>Manage your enrolled courses, syllabi, and difficulty weights.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
        >
          + Add Course
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Course Modal Form */}
      {showForm && (
        <CourseForm
          onSubmit={handleSubmit}
          initialData={editingCourse}
          onCancel={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Course Grid or Empty State */}
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading your courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-box">
          <h3>No courses created yet</h3>
          <p>Add your first course to begin scheduling tasks and generating study plans.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
          >
            + Add Your First Course
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;