import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";

<Route path="/courses" element={<Courses />} />
import Tasks from "./pages/Tasks";

<Route path="/tasks" element={<Tasks />} />
import Progress from "./pages/Progress";

// inside <Routes>
<Route path="/progress" element={<Progress />} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;