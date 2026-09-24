import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reminders, setReminders] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchReminders = async () => {
    try {
      const response = await api.get("/reminders/");
      setReminders(response.data);
    } catch (err) {
      // fail silently — reminders aren't critical enough to show an error banner
    }
  };

  useEffect(() => {
    fetchReminders();
    // refresh every 60 seconds while the app is open
    const interval = setInterval(fetchReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  // close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  const reminderIcon = {
    overdue: "🔴",
    due_today: "🟠",
    due_soon: "🟡",
    high_priority_pending: "⚡",
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-blue-600">StudySmart</h1>

      <div className="flex gap-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
        <Link to="/courses" className={linkClass("/courses")}>Courses</Link>
        <Link to="/tasks" className={linkClass("/tasks")}>Tasks</Link>
        <Link to="/planner" className={linkClass("/planner")}>Planner</Link>
        <Link to="/progress" className={linkClass("/progress")}>Progress</Link>
        <Link to="/analytics" className={linkClass("/analytics")}>Analytics</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Reminders bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="relative text-xl px-2 py-1 rounded hover:bg-gray-100"
          >
            🔔
            {reminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {reminders.length > 9 ? "9+" : reminders.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-50">
              <div className="px-4 py-2 border-b font-semibold text-sm">
                Reminders
              </div>
              {reminders.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">
                  You're all caught up! 🎉
                </p>
              ) : (
                reminders.map((r, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 border-b last:border-0 text-sm flex gap-2 hover:bg-gray-50"
                  >
                    <span>{reminderIcon[r.type] || "🔔"}</span>
                    <span>{r.message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;