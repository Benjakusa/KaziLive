import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, Users, User, Search, Menu, X } from 'lucide-react';

import EmployerLogin from './pages/EmployerLogin.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';
import EmployerProfileView from './pages/EmployerProfileView.jsx';
import EmployerContact from './pages/EmployerContact.jsx';

import JobseekerLogin from './pages/JobseekerLogin.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <Briefcase size={28} />
            <span>KaziLive</span>
          </Link>
          <div className="nav-links">
            <Link to="/jobseeker/login" className="nav-link">
              <User size={18} />
              Jobseeker
            </Link>
            <Link to="/jobseeker/profile" className="nav-link">
              <Users size={18} />
              Profile
            </Link>
            <Link to="/employer/login" className="nav-link">
              <User size={18} />
              Employer
            </Link>
            <Link to="/employer/search" className="nav-link">
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
