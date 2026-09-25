import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const [reminders, setReminders] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Sync token state on route change
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  // Fetch reminders if user is logged in
  const fetchReminders = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;

    try {
      const res = await api.get("/reminders/");
      setReminders(res.data);
    } catch (err) {
      // silently ignore if not authenticated or server down
    }
  };

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setReminders([]);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={token ? "/dashboard" : "/"} className="nav-brand">
          <div className="nav-brand-logo">🎓</div>
          <span>StudySmart</span>
        </Link>

        {/* Navigation links */}
        {token ? (
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/courses" className={`nav-link ${isActive("/courses") ? "active" : ""}`}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/tasks" className={`nav-link ${isActive("/tasks") ? "active" : ""}`}>
                Tasks
              </Link>
            </li>
            <li>
              <Link to="/planner" className={`nav-link ${isActive("/planner") ? "active" : ""}`}>
                Smart Planner
              </Link>
            </li>
            <li>
              <Link to="/progress" className={`nav-link ${isActive("/progress") ? "active" : ""}`}>
                Progress
              </Link>
            </li>
            <li>
              <Link to="/analytics" className={`nav-link ${isActive("/analytics") ? "active" : ""}`}>
                Analytics
              </Link>
            </li>
          </ul>
        ) : null}

        {/* Actions (Reminders + Auth) */}
        <div className="nav-actions" ref={dropdownRef}>
          {token ? (
            <>
              {/* Reminders Bell Button */}
              <button
                className="reminder-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Reminders"
              >
                <span>🔔</span>
                {reminders.length > 0 && (
                  <span className="reminder-badge">{reminders.length}</span>
                )}
              </button>

              {/* Reminders Dropdown Popup */}
              {showDropdown && (
                <div className="reminders-dropdown">
                  <h4>
                    <span>Notifications & Deadlines</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {reminders.length} active
                    </span>
                  </h4>
                  {reminders.length === 0 ? (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", padding: "0.5rem 0" }}>
                      🎉 You're all caught up! No urgent reminders.
                    </p>
                  ) : (
                    reminders.map((rem, idx) => (
                      <div
                        key={idx}
                        className={`reminder-item ${rem.type || ""}`}
                      >
                        {rem.message}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;