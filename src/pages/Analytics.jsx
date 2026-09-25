import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import api from "../services/api";

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [taskChart, setTaskChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const [summaryRes, chartRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/task-completion"),
        ]);
        setSummary(summaryRes.data);
        setTaskChart(chartRes.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load study analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  const pieData = taskChart && {
    labels: taskChart.labels,
    datasets: [
      {
        data: taskChart.values,
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"], // yellow, blue, green
        borderColor: "rgba(17, 24, 39, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const barData = summary && {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        label: "Tasks Count",
        data: [
          summary.completed_tasks,
          summary.pending_tasks,
          summary.overdue_tasks,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], // green, yellow, red
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { family: "'Inter', sans-serif", size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#94a3b8", stepSize: 1 },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
    },
  };

  const statCards = summary && [
    { label: "Total Courses", value: summary.total_courses },
    { label: "Total Tasks", value: summary.total_tasks },
    { label: "Completed", value: summary.completed_tasks },
    { label: "Completion Rate", value: `${summary.completion_rate}%` },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Study Analytics</h1>
          <p>Visual breakdown of your productivity, deadlines, and task distribution.</p>
        </div>
      </div>

      {loading && (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading visual analytics...
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && summary && (
        <>
          {/* Stat Cards */}
          <div className="stat-grid">
            {statCards.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span className="stat-val">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="glass-card" style={{ height: "360px", display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                Task Status Breakdown
              </h2>
              <div style={{ flex: 1, position: "relative" }}>
                {pieData && <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />}
              </div>
            </div>

            <div className="glass-card" style={{ height: "360px", display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                Status Distribution
              </h2>
              <div style={{ flex: 1, position: "relative" }}>
                {barData && <Bar data={barData} options={chartOptions} />}
              </div>
            </div>
          </div>

          {summary.total_tasks === 0 && (
            <div className="empty-box">
              <h3>No tasks recorded yet</h3>
              <p>Add courses and tasks to see detailed productivity charts.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;