import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import EmployerLogin from './pages/EmployerLogin.jsx';
import EmployerRegister from './pages/EmployerRegister.jsx';
import EmployerSearch from './pages/EmployerSearch.jsx';
import EmployerProfileView from './pages/EmployerProfileView.jsx';
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';

import JobseekerLogin from './pages/JobseekerLogin.jsx';
import JobseekerRegister from './pages/JobseekerRegister.jsx';
import JobseekerProfile from './pages/JobseekerProfile.jsx';
import JobseekerDashboard from './pages/jobseeker/JobseekerDashboard.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <div className="app-container">
      {!isDashboard && <Navbar />}
      <main className={isDashboard ? 'dashboard-container-root' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/jobseeker/login" element={<JobseekerLogin />} />
          <Route path="/jobseeker/register" element={<JobseekerRegister />} />
          <Route path="/jobseeker/profile" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <JobseekerProfile />
            </ProtectedRoute>
          } />
          <Route path="/jobseeker/profile/:id" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <JobseekerProfile />
            </ProtectedRoute>
          } />
          <Route path="/jobseeker/dashboard" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <JobseekerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/search" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerSearch />
            </ProtectedRoute>
          } />
          <Route path="/employer/profile/:id" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerProfileView />
            </ProtectedRoute>
          } />
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
