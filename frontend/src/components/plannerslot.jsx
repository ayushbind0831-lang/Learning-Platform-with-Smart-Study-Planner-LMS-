function PlannerSlot({ slot, onMarkComplete }) {
  const priorityColor = {
    High: "border-l-4 border-red-500",
    Medium: "border-l-4 border-yellow-500",
    Low: "border-l-4 border-green-500",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 flex justify-between items-center ${
        priorityColor[slot.priority] || "border-l-4 border-gray-300"
      }`}
    >
      <div>
        <p className="text-sm text-gray-500">
          {slot.start_time} – {slot.end_time}
        </p>
        <h3 className="font-semibold">{slot.title}</h3>
        {slot.course && (
          <p className="text-xs text-gray-400">{slot.course}</p>
        )}
        <p className="text-xs mt-1">
          {slot.allocated_hours}h allocated
          {!slot.fully_scheduled && (
            <span className="text-orange-500 font-medium">
              {" "}
              (partial — needs more time)
            </span>
          )}
        </p>
      </div>

      <button
        onClick={() => onMarkComplete(slot.task_id)}
        className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded hover:bg-green-100 whitespace-nowrap"
      >
        ✓ Mark Done
      </button>
    </div>
  );
}

export default PlannerSlot;