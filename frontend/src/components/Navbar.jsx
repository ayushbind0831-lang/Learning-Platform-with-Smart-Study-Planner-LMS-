import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;