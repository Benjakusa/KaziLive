import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  CheckCircle2
} from 'lucide-react';

import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import Chart from '../../components/shared/Chart';

import JobseekerProfileView from '../../components/dashboard/JobseekerProfileView';
import JobseekerDocumentsView from '../../components/dashboard/JobseekerDocumentsView';
import JobseekerApplicationsView from '../../components/dashboard/JobseekerApplicationsView';
import JobseekerNotificationsView from '../../components/dashboard/JobseekerNotificationsView';
import JobseekerSettingsView from '../../components/dashboard/JobseekerSettingsView';

import { useProfile } from '../../features/auth/useProfile';

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { profile: backendProfile } = useProfile();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/jobseeker/login');
  };

  // ✅ single source of truth (backend first, redux fallback)
  const userObj = backendProfile || user;

  const userName =
    userObj?.full_name ||
    userObj?.name ||
    userObj?.email?.split('@')[0] ||
    'Jobseeker';

  const userInitials = userName
    .split(' ')
    .map(n => n?.[0] || '')
    .join('')
    .toUpperCase();

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, id: 'Overview', onClick: () => setActiveTab('Overview') },
    { label: 'My Profile', icon: User, id: 'Profile', onClick: () => setActiveTab('Profile') },
    { label: 'My Documents', icon: FileText, id: 'Documents', onClick: () => setActiveTab('Documents') },
    { label: 'Application Status', icon: Briefcase, id: 'Status', onClick: () => setActiveTab('Status') },
    { label: 'Notifications', icon: Bell, id: 'Notifications', onClick: () => setActiveTab('Notifications') },
    { label: 'Settings', icon: Settings, id: 'Settings', onClick: () => setActiveTab('Settings') },
    { label: 'Logout', icon: LogOut, id: 'Logout', onClick: handleLogout },
  ];

  const chartData = [
    { name: 'Jan', apps: 0 },
    { name: 'Feb', apps: 0 },
    { name: 'Mar', apps: 0 },
    { name: 'Apr', apps: 0 },
  ];

  const offerColumns = [
    { header: 'Company', accessor: 'company' },
    { header: 'Position', accessor: 'position' },
    { header: 'Salary', accessor: 'salary' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      accessor: 'id',
      render: () => (
        <div className="table-actions">
          <button className="btn-table btn-accept">Accept</button>
          <button className="btn-table btn-decline">Decline</button>
        </div>
      )
    }
  ];

  const offersData = []; // 🔴 IMPORTANT: backend not wired yet

  const renderOverview = () => (
    <div className="dashboard-grid">

      <div className="stats-row">
        <div className="card profile-stat-card">
          <div className="flex items-center gap-4">
            <div className="profile-avatar-large">
              {userObj?.profile_picture
                ? <img src={userObj.profile_picture} alt="Profile" />
                : <span>{userInitials}</span>}
            </div>

            <div>
              <h3>Welcome, {userName}!</h3>
              <p className="text-muted small">
                Jobseeker ID: {userObj?.id || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <StatCard title="Profile Views" value="0" icon={Eye} />
        <StatCard title="Job Applications" value="0" icon={Briefcase} />
        <StatCard title="Active Offers" value="0" icon={TrendingUp} />
      </div>

      <div className="dashboard-main-grid">

        <div className="dashboard-left-col">

          <div className="card">
            <div className="card-header-flex">
              <h3>Profile Completion</h3>
              <span>0%</span>
            </div>

            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '0%' }} />
            </div>

            <button className="btn-outline-maroon mt-4">
              Edit Profile
            </button>
          </div>

          <div className="card mt-6">
            <h3>Application Analytics</h3>
            <Chart data={chartData} xKey="name" yKey="apps" />
          </div>

          <div className="card mt-6">
            <h3>Job Offers</h3>

            {offersData.length === 0 ? (
              <p className="text-muted">No offers yet</p>
            ) : (
              <DataTable columns={offerColumns} data={offersData} />
            )}
          </div>

        </div>

        <div className="dashboard-right-col">

          <div className="card">
            <h3>Verification Status</h3>

            <Badge variant="success">
              <CheckCircle2 size={14} />
              Verified
            </Badge>
          </div>

        </div>

      </div>
    </div>
  );

  return (
    <DashboardLayout
      menuItems={menuItems.map(item => ({
        ...item,
        isActive: activeTab === item.id
      }))}
      role="jobseeker"
    >
      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Profile' && <JobseekerProfileView user={userObj} />}
      {activeTab === 'Documents' && <JobseekerDocumentsView user={userObj} />}
      {activeTab === 'Status' && <JobseekerApplicationsView user={userObj} />}
      {activeTab === 'Notifications' && <JobseekerNotificationsView user={userObj} />}
      {activeTab === 'Settings' && <JobseekerSettingsView user={userObj} />}
    </DashboardLayout>
  );
};

export default JobseekerDashboard; 