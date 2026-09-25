import { useState } from "react";

function CourseForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    course_name: initialData?.course_name || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "Medium",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: "1.25rem" }}>
          {initialData ? "Edit Course" : "Add New Course"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="course_name">Course Name *</label>
            <input
              id="course_name"
              type="text"
              name="course_name"
              className="form-input"
              value={formData.course_name}
              onChange={handleChange}
              placeholder="e.g. CS101: Intro to Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Syllabus, topics covered, or notes..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Course Difficulty (used by Planner)</label>
            <select
              id="difficulty"
              name="difficulty"
              className="form-select"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy (Low urgency multiplier)</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard (High urgency multiplier)</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                className="form-input"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                className="form-input"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseForm;