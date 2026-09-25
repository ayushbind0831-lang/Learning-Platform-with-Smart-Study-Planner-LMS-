import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // New task form state
  const [formData, setFormData] = useState({
    course_id: "",
    title: "",
    description: "",
    deadline: "",
    estimated_hours: 1.5,
    priority: "Medium",
  });

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [coursesRes, tasksRes] = await Promise.all([
        api.get("/courses/"),
        api.get("/tasks/"),
      ]);

      setCourses(coursesRes.data);
      setTasks(tasksRes.data);

      if (coursesRes.data.length > 0 && !formData.course_id) {
        setFormData((prev) => ({ ...prev, course_id: coursesRes.data[0].id }));
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks or courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.course_id) {
      alert("Please provide a task title and choose a course.");
      return;
    }

    try {
      setError("");
      await api.post("/tasks/", {
        ...formData,
        course_id: Number(formData.course_id),
        estimated_hours: Number(formData.estimated_hours),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      });

      setShowModal(false);
      setFormData({
        course_id: courses[0]?.id || "",
        title: "",
        description: "",
        deadline: "",
        estimated_hours: 1.5,
        priority: "Medium",
      });

      await loadData();
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.response?.data?.detail || "Failed to create task.");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await api.put(`/tasks/${task.id}`, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update task status.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Could not delete task.");
    }
  };

  const filteredTasks =
    courseFilter === "all"
      ? tasks
      : tasks.filter((t) => String(t.course_id) === String(courseFilter));

  const getCourseName = (courseId) => {
    const c = courses.find((course) => course.id === courseId);
    return c ? c.course_name : `Course #${courseId}`;
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "badge-hard";
      case "low": return "badge-easy";
      default: return "badge-medium";
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Tasks & Assignments</h1>
          <p>Track homework, labs, exams, and readings across all courses.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (courses.length === 0) {
              alert("Please create a course before adding tasks.");
              navigate("/courses");
              return;
            }
            setShowModal(true);
          }}
        >
          + Add Task
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Filter Row */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Filter by Course:</label>
        <select
          className="form-select"
          style={{ width: "auto", minWidth: "200px" }}
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="all">All Courses ({tasks.length})</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.course_name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: "1.25rem" }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="course_id">Course *</label>
                <select
                  id="course_id"
                  className="form-select"
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chapter 4 Quiz or Lab 2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Details / Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Requirements, links, or notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="High">High (Urgent/Important)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="estimated_hours">Est. Hours</label>
                  <input
                    id="estimated_hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="20"
                    className="form-input"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Deadline Date & Time</label>
                <input
                  id="deadline"
                  type="datetime-local"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-box">
          <h3>No tasks found</h3>
          <p>
            {courses.length === 0
              ? "You need to add a course before creating tasks."
              : "Click the button below to add your first task."}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (courses.length === 0) navigate("/courses");
              else setShowModal(true);
            }}
          >
            {courses.length === 0 ? "Go to Courses" : "+ Add Task"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="glass-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: task.status === "Completed" ? 0.65 : 1,
                padding: "1.1rem 1.4rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                {/* Status Toggle Checkbox */}
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={() => handleToggleStatus(task)}
                  style={{ width: "20px", height: "20px", marginTop: "3px", cursor: "pointer" }}
                  title="Mark as Completed"
                />

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        textDecoration: task.status === "Completed" ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </h3>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                      {getCourseName(task.course_id)}
                    </span>
                    <span className={`badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span
                      className={`badge ${
                        task.status === "Completed" ? "badge-completed" : "badge-pending"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    <span>⏱️ {task.estimated_hours} hrs</span>
                    {task.deadline && (
                      <span>
                        📅 Due: {new Date(task.deadline).toLocaleDateString()} at{" "}
                        {new Date(task.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteTask(task.id)}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;