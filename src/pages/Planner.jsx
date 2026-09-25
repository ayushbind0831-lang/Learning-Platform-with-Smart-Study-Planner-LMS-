import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlannerSlot from "../components/PlannerSlot";
import api from "../services/api";

function Planner() {
  const [availableHours, setAvailableHours] = useState(4);
  const [startTime, setStartTime] = useState("09:00");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const generatePlanner = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/planner/generate", {
        available_hours: Number(availableHours),
        start_time: startTime,
      });

      setSchedule(response.data);
    } catch (err) {
      console.error("Planner error:", err);
      setError(
        err.response?.data?.detail || "Unable to generate study plan. Please ensure you have pending tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (taskId) => {
    try {
      setError("");

      // Backend expects status: "Completed"
      await api.put(`/tasks/${taskId}`, {
        status: "Completed",
      });

      setSchedule((previousSchedule) =>
        previousSchedule.map((item) =>
          (item.task_id === taskId || item.id === taskId)
            ? { ...item, status: "Completed", completed: true }
            : item
        )
      );
    } catch (err) {
      console.error("Error completing task:", err);
      setError(
        err.response?.data?.detail || "Unable to update task status."
      );
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Smart Study Planner</h1>
          <p>
            Generate an optimized daily study schedule prioritized by deadline urgency and course difficulty.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Planner Parameters Card */}
      <div className="glass-card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          ⚙️ Planner Configuration
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", alignItems: "flex-end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="availableHours">Available Study Hours</label>
            <input
              id="availableHours"
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              className="form-input"
              value={availableHours}
              onChange={(e) => setAvailableHours(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="startTime">Schedule Start Time</label>
            <input
              id="startTime"
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-gradient"
            onClick={generatePlanner}
            disabled={loading}
            style={{ height: "46px" }}
          >
            {loading ? "Generating Schedule..." : "⚡ Generate Study Plan"}
          </button>
        </div>
      </div>

      {/* Schedule Output */}
      <div>
        <h2 style={{ marginBottom: "1.25rem" }}>
          📋 Today's Prioritized Schedule
        </h2>

        {schedule.length === 0 ? (
          <div className="empty-box">
            <h3>No study schedule generated yet</h3>
            <p>
              Set your available hours and start time above, then click <strong>"Generate Study Plan"</strong>.
            </p>
          </div>
        ) : (
          <div>
            {schedule.map((item, index) => (
              <PlannerSlot
                key={item.task_id || index}
                item={item}
                onComplete={markComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Planner;