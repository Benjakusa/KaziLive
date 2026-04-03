import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobseekerProfile from "./pages/employer/JobseekerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/employer/profile/:id" element={<JobseekerProfile />} />
      </Routes>
    </Router>
  );
}

export default App; 