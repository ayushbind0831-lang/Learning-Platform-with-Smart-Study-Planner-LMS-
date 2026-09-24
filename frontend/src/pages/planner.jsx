import { useState } from "react";
import Navbar from "../components/Navbar";
import PlannerSlot from "../components/plannerslot";
import api from "../services/api";

function Planner() {
  const [availableHours, setAvailableHours] = useState(3);
  const [startTime, setStartTime] = useState("18:00");
  const [schedule, setSchedule] = useState(null); // null = not generated yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/planner/generate", {
        available_hours: Number(availableHours),
        start_time: startTime,
      });
      setSchedule(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: "Completed" });
      // remove it from the current schedule view immediately
      setSchedule((prev) => prev.filter((slot) => slot.task_id !== taskId));
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const totalAllocated = schedule
    ? schedule.reduce((sum, s) => sum + s.allocated_hours, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8">
        <h1 className="text-2xl font-bold mb-6">Today's Study Planner</h1>

        {/* Input panel */}
        <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">
              Available Hours Today
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={availableHours}
              onChange={(e) => setAvailableHours(e.target.value)}
              className="border rounded px-3 py-2 w-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate My Plan"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Results */}
        {schedule === null && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Enter your available hours and click "Generate My Plan" to see
            today's schedule.
          </div>
        )}

        {schedule && schedule.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No pending tasks to schedule. Add tasks first, or you're all
            caught up! 🎉
          </div>
        )}

        {schedule && schedule.length > 0 && (
          <>
            <div className="bg-blue-50 text-blue-700 rounded-lg p-3 mb-4 text-sm">
              {totalAllocated}h of {availableHours}h allocated across{" "}
              {schedule.length} task{schedule.length > 1 ? "s" : ""}.
            </div>
            <div className="flex flex-col gap-3">
              {schedule.map((slot) => (
                <PlannerSlot
                  key={slot.task_id}
                  slot={slot}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Planner;