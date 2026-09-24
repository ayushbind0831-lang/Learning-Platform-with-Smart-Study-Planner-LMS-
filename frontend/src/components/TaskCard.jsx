function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const priorityColor = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const statusColor = {
    Pending: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "Completed";

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No deadline";

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColor[task.priority] || "bg-gray-100 text-gray-700"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      )}

      <p className={`text-xs mb-3 ${isOverdue ? "text-red-600 font-semibold" : "text-gray-400"}`}>
        {isOverdue ? "⚠ Overdue — " : "Due: "}
        {formattedDeadline} · {task.estimated_hours}h estimated
      </p>

      <div className="flex items-center justify-between">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${
            statusColor[task.status]
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;