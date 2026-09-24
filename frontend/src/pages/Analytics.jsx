import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [taskChart, setTaskChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, chartRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/task-completion"),
        ]);
        setSummary(summaryRes.data);
        setTaskChart(chartRes.data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const pieData = taskChart && {
    labels: taskChart.labels,
    datasets: [
      {
        data: taskChart.values,
        backgroundColor: ["#9CA3AF", "#3B82F6", "#22C55E"], // gray, blue, green
        borderWidth: 0,
      },
    ],
  };

  const barData = summary && {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        label: "Tasks",
        data: [
          summary.completed_tasks,
          summary.pending_tasks,
          summary.overdue_tasks,
        ],
        backgroundColor: ["#22C55E", "#FACC15", "#EF4444"], // green, yellow, red
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const statCards = summary && [
    { label: "Total Courses", value: summary.total_courses },
    { label: "Total Tasks", value: summary.total_tasks },
    { label: "Completed", value: summary.completed_tasks },
    { label: "Completion Rate", value: `${summary.completion_rate}%` },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        {loading && <p>Loading analytics...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && summary && (
          <>
            {/* Stat cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg shadow p-4 text-center"
                >
                  <p className="text-2xl font-bold text-blue-600">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold mb-4">Task Status Breakdown</h2>
                {pieData && <Pie data={pieData} />}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold mb-4">
                  Completed vs Pending vs Overdue
                </h2>
                {barData && <Bar data={barData} options={barOptions} />}
              </div>
            </div>

            {summary.total_tasks === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 mt-6">
                No tasks yet — analytics will populate once you start adding
                courses and tasks.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;