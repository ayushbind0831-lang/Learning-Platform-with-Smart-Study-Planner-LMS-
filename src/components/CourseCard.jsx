function CourseCard({ course, onEdit, onDelete }) {
  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "badge-easy";
      case "hard": return "badge-hard";
      default: return "badge-medium";
    }
  };

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <h2>{course.course_name}</h2>
          <span className={`badge ${getDifficultyClass(course.difficulty)}`}>
            {course.difficulty || "Medium"}
          </span>
        </div>

        <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
          {course.description || "No description provided."}
        </p>

        {(course.start_date || course.end_date) && (
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "1.25rem" }}>
            {course.start_date && <span>📅 {course.start_date}</span>}
            {course.start_date && course.end_date && <span> → </span>}
            {course.end_date && <span>{course.end_date}</span>}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(course)}>
          ✏️ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(course.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default CourseCard;