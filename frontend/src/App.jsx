import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, Users, User, Search, Menu, X } from 'lucide-react';

import EmployerLogin from './pages/EmployerLogin.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';
import EmployerProfileView from './pages/EmployerProfileView.jsx';
import EmployerContact from './pages/EmployerContact.jsx';

import JobseekerLogin from './pages/JobseekerLogin.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
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
            <Link to="/jobseeker/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
              <Users size={18} />
              Profile
            </Link>
            <Link to="/employer/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              <User size={18} />
              Employer
            </Link>
            <Link to="/employer/search" className="nav-link" onClick={() => setMenuOpen(false)}>
              <Search size={18} />
              Find Talent
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="hero">
                <h1>Find Your Next Opportunity</h1>
                <p>Connect with top employers and kickstart your career journey</p>
              </div>
            } />

            <Route path="/jobseeker/login" element={<JobseekerLogin />} />
            <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
            <Route path="/jobseeker/profile/:id" element={<JobseekerProfile />} />

            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/employer/search" element={<EmployerSearch />} />
            <Route path="/employer/profile/:id" element={<EmployerProfileView />} />
            <Route path="/employer/contact/:id" element={<EmployerContact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
