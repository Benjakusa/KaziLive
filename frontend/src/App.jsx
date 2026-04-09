import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Employer pages
import EmployerLogin from './pages/EmployerLogin.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';
import EmployerProfileView from './pages/EmployerProfileView.jsx';
import EmployerContact from './pages/EmployerContact.jsx';

// Jobseeker pages
import JobseekerLogin from './pages/JobseekerLogin.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to KaziLive</h1>} />

        {/* Jobseeker Routes */}
        <Route path="/jobseeker/login" element={<JobseekerLogin />} />
        <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
        <Route path="/jobseeker/profile/:id" element={<JobseekerProfile />} />

        {/* Employer Routes */}
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/search" element={<EmployerSearch />} />
        <Route path="/employer/profile/:id" element={<EmployerProfileView />} />
        <Route path="/employer/contact/:id" element={<EmployerContact />} />
      </Routes>
    </Router>
  );
}

export default App;