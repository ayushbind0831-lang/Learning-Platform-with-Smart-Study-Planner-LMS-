import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

<Navbar />

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        // token missing or expired — kick back to login
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
  <div className="min-h-screen bg-gray-100">
    <Navbar />
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600">
        This is your dashboard. Courses, Tasks, Planner, Progress and
        Analytics will appear here next.
      </p>
    </div>
  </div>
);
}

export default Dashboard;