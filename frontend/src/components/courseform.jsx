import { useState, useEffect } from "react";

function CourseForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    difficulty: "Medium",
    start_date: "",
    end_date: "",
  });

  // If editing, pre-fill the form with the existing course's data
  useEffect(() => {
    if (initialData) {
      setFormData({
        course_name: initialData.course_name || "",
        description: initialData.description || "",
        difficulty: initialData.difficulty || "Medium",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 w-96"
      >
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Edit Course" : "Add Course"}
        </h2>

        <label className="block text-sm font-medium mb-1">Course Name</label>
        <input
          type="text"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block text-sm font-medium mb-1">Difficulty</label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;