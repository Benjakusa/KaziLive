import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobseekerLogin from './pages/JobseekerLogin.jsx';
import EmployerLogin from './pages/EmployerLogin.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Job Portal</h1>} />
        <Route path="/jobseeker/login" element={<JobseekerLogin />} />
        <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/search" element={<EmployerSearch />} />
      </Routes>
    </Router>
  );
}

export default App;