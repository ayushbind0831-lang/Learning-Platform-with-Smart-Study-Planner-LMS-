function PlannerSlot({ item, onComplete }) {
  if (!item) return null;

  const taskId = item.task_id || item.id;
  const isDone = item.status === "Completed" || item.completed;

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "badge-hard";
      case "low": return "badge-easy";
      default: return "badge-medium";
    }
  };

  return (
    <div
      className={`glass-card ${isDone ? "completed" : ""}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.85rem",
        padding: "1rem 1.25rem",
        opacity: isDone ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Time slot pill */}
        <div
          style={{
            background: "rgba(99, 102, 241, 0.15)",
            color: "var(--accent-secondary)",
            padding: "0.4rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            fontFamily: "monospace",
            fontWeight: "700",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
          }}
        >
          ⏰ {item.start_time} - {item.end_time}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <h4
              style={{
                fontSize: "1.05rem",
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {item.title}
            </h4>
            {item.course && (
              <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                {item.course}
              </span>
            )}
            <span className={`badge ${getPriorityClass(item.priority)}`}>
              {item.priority}
            </span>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Allocated: {item.allocated_hours} hrs {item.fully_scheduled ? "• Fully Scheduled" : "• Partial Slot"}
          </div>
        </div>
      </div>

      <div>
        {onComplete && !isDone && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onComplete(taskId)}
          >
            ✓ Mark Done
          </button>
        )}
        {isDone && (
          <span style={{ color: "var(--status-completed)", fontSize: "0.85rem", fontWeight: "600" }}>
            ✓ Completed
          </span>
        )}
      </div>
    </div>
  );
}

export default PlannerSlot;