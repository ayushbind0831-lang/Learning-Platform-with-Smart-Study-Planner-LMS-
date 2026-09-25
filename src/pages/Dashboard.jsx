import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [meRes, summaryRes, remindersRes] = await Promise.allSettled([
          api.get("/auth/me"),
          api.get("/analytics/summary"),
          api.get("/reminders/"),
        ]);

        if (meRes.status === "fulfilled") setUser(meRes.value.data);
        if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
        if (remindersRes.status === "fulfilled") setReminders(remindersRes.value.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{user ? `Hello, ${user.name} 👋` : "Welcome to StudySmart"}</h1>
          <p>Here's what you need to focus on today.</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/courses" className="btn btn-secondary btn-sm">
            + New Course
          </Link>
          <Link to="/tasks" className="btn btn-secondary btn-sm">
            + Add Task
          </Link>
          <Link to="/planner" className="btn btn-gradient btn-sm">
            ⚡ Generate Plan
          </Link>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading your personalized study dashboard...
        </div>
      ) : (
        <>
          {/* Key Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-val">{summary?.total_courses ?? 0}</span>
              <span className="stat-label">Active Courses</span>
            </div>

            <div className="stat-card">
              <span className="stat-val">{summary?.total_tasks ?? 0}</span>
              <span className="stat-label">Total Tasks</span>
            </div>

            <div className="stat-card">
              <span className="stat-val" style={{ color: "var(--status-completed)" }}>
                {summary?.completed_tasks ?? 0}
              </span>
              <span className="stat-label">Tasks Completed</span>
            </div>

            <div className="stat-card">
              <span className="stat-val">
                {summary?.completion_rate !== undefined ? `${summary.completion_rate}%` : "0%"}
              </span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>

          {/* Quick Progress Bar */}
          <div className="glass-card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600" }}>Overall Academic Progress</span>
              <span style={{ color: "var(--accent-secondary)", fontWeight: "700" }}>
                {summary?.completion_rate ?? 0}%
              </span>
            </div>
            <div className="progress-track" style={{ height: "10px" }}>
              <div
                className="progress-fill"
                style={{ width: `${Math.min(summary?.completion_rate ?? 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Main Dashboard Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {/* Urgent Deadlines & Reminders */}
            <div className="glass-card">
              <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🔔</span> Urgent Reminders & Deadlines
              </h2>

              {reminders.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-dim)" }}>
                  🎉 No overdue or immediate deadlines!
                </div>
              ) : (
                reminders.slice(0, 5).map((rem, i) => (
                  <div key={i} className={`reminder-item ${rem.type || ""}`} style={{ marginBottom: "0.75rem" }}>
                    {rem.message}
                  </div>
                ))
              )}

              <div style={{ marginTop: "1rem" }}>
                <Link to="/tasks" style={{ fontSize: "0.85rem", color: "var(--accent-primary)", textDecoration: "none", fontWeight: "600" }}>
                  View all tasks & deadlines →
                </Link>
              </div>
            </div>

            {/* Smart Study Planner Banner */}
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ marginBottom: "0.75rem" }}>📅 Today's Study Planner</h2>
                <p style={{ marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Let StudySmart prioritize your tasks according to upcoming deadlines and course difficulty.
                </p>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  💡 Rule-based scheduling allocates your available hours to the highest-impact assignments first.
                </p>
              </div>

              <Link to="/planner" className="btn btn-primary" style={{ textAlign: "center" }}>
                Open Smart Planner
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;