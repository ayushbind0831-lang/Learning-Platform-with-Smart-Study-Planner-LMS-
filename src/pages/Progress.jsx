import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

function Progress() {
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/progress/overview");
        setCoursesProgress(res.data);
      } catch (err) {
        console.error("Error loading progress:", err);
        setError("Unable to load course progress overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [navigate]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Course Progress</h1>
          <p>Real-time completion tracking across each of your enrolled courses.</p>
        </div>

        <Link to="/courses" className="btn btn-secondary btn-sm">
          Manage Courses
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
          Calculating progress metrics...
        </div>
      ) : coursesProgress.length === 0 ? (
        <div className="empty-box">
          <h3>No courses found</h3>
          <p>Add a course and schedule tasks to start tracking your academic completion.</p>
          <Link to="/courses" className="btn btn-primary">
            Go to Courses
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {coursesProgress.map((item) => {
            const percentage = Math.round(item.progress_percentage || 0);

            return (
              <div key={item.course_id} className="glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <h2>{item.course_name}</h2>
                  <span
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "800",
                      fontFamily: "var(--font-heading)",
                      color: percentage === 100 ? "var(--status-completed)" : "var(--accent-secondary)",
                    }}
                  >
                    {percentage}%
                  </span>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <ProgressBar progress={percentage} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                  <span>Tasks Completed:</span>
                  <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
                    {item.completed_tasks} / {item.total_tasks}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Progress;