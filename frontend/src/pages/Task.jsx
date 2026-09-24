import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, coursesRes] = await Promise.all([
        api.get("/tasks/"),
        api.get("/courses/"),
      ]);
      setTasks(tasksRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    if (courses.length === 0) {
      alert("Add a course first before creating tasks.");
      return;
    }
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        course_id: Number(formData.course_id),
        estimated_hours: Number(formData.estimated_hours),
        deadline: formData.deadline || null,
      };

      if (editingTask) {
        // course_id isn't part of TaskUpdate, only send editable fields
        const { course_id, ...updateFields } = payload;
        await api.put(`/tasks/${editingTask.id}`, updateFields);
      } else {
        await api.post("/tasks/", payload);
      }

      setShowForm(false);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {["All", "Pending", "In Progress", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-full ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && filteredTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No tasks found. Click "+ Add Task" to create one.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {showForm && (
          <TaskForm
            initialData={editingTask}
            courses={courses}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Tasks;