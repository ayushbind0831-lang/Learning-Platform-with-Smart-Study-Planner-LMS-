function CourseCard({ course, onEdit, onDelete }) {
  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{course.course_name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              difficultyColor[course.difficulty] || "bg-gray-100 text-gray-700"
            }`}
          >
            {course.difficulty}
          </span>
        </div>
        {course.description && (
          <p className="text-sm text-gray-600 mb-3">{course.description}</p>
        )}
        <p className="text-xs text-gray-400">
          {course.start_date || "No start date"} → {course.end_date || "No end date"}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 text-sm bg-blue-50 text-blue-600 py-1.5 rounded hover:bg-blue-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="flex-1 text-sm bg-red-50 text-red-600 py-1.5 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CourseCard;