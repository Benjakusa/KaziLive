import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import JobseekerDashboard from "./pages/jobseeker/JobseekerDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobseekerProfile from "./pages/employer/JobseekerProfile";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/employer/profile/:id" element={<JobseekerProfile />} />
      </Routes>
    </Router>
  );
}

export default App; 