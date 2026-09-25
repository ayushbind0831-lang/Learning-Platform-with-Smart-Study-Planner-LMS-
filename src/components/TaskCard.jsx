function TaskCard({ task, onDelete }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      {task.description && (
        <p>{task.description}</p>
      )}

      {task.due_date && (
        <p>
          <strong>Due:</strong> {task.due_date}
        </p>
      )}

      {onDelete && (
        <button onClick={() => onDelete(task.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default TaskCard;