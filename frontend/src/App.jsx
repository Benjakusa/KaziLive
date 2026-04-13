import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, User, Search, Menu, X, Shield } from 'lucide-react';

import Home from './pages/Home.jsx';
import EmployerLogin from './pages/EmployerLogin.jsx';
import EmployerRegister from './pages/EmployerRegister.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';
import EmployerProfileView from './pages/EmployerProfileView.jsx';
import EmployerContact from './pages/EmployerContact.jsx';
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';

import JobseekerLogin from './pages/JobseekerLogin.jsx';
import JobseekerRegister from './pages/JobseekerRegister.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';
import JobseekerDashboard from './pages/jobseeker/JobseekerDashboard.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="navbar-brand">
              <Briefcase size={28} style={{ color: "var(--accent)" }} />
              <div style={{ display: "flex", gap: "2px" }}>
                <span style={{ color: "#000000" }}>Kazi</span>
                <span style={{ color: "var(--accent)", fontWeight: "800" }}>Live</span>
              </div>
            </Link>

            <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
              <Link to="/jobseeker/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                <User size={18} />
                Jobseeker
              </Link>

              <Link to="/employer/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                <User size={18} />
                Employer
              </Link>
              <Link to="/employer/search" className="nav-link" onClick={() => setMenuOpen(false)}>
                <Search size={18} />
                Find Talent
              </Link>
              <Link to="/admin/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                <Shield size={18} />
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/jobseeker/login" element={<JobseekerLogin />} />
            <Route path="/jobseeker/register" element={<JobseekerRegister />} />
            <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
            <Route path="/jobseeker/profile/:id" element={<JobseekerProfile />} />
            <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />

            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/employer/register" element={<EmployerRegister />} />
            <Route path="/employer/search" element={<EmployerSearch />} />
            <Route path="/employer/profile/:id" element={<EmployerProfileView />} />
            <Route path="/employer/contact/:id" element={<EmployerContact />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
