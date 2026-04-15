import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle
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
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { profile: backendProfile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (backendProfile) {
      console.log('DEBUG: Backend profile loaded:', backendProfile);
    }
  }, [backendProfile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/jobseeker/login');
  };

  const userObj = backendProfile?.raw || user;
  const userName = userObj?.name || userObj?.full_name || 'Jobseeker';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();


  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '#', id: 'Overview', onClick: () => setActiveTab('Overview') },
    { label: 'My Profile', icon: User, path: '#', id: 'Profile', onClick: () => setActiveTab('Profile') },
    { label: 'My Documents', icon: FileText, path: '#', id: 'Documents', onClick: () => setActiveTab('Documents') },
    { label: 'Application Status', icon: Briefcase, path: '#', id: 'Status', onClick: () => setActiveTab('Status') },
    { label: 'Notifications', icon: Bell, path: '#', id: 'Notifications', onClick: () => setActiveTab('Notifications') },
    { label: 'Settings', icon: Settings, path: '#', id: 'Settings', onClick: () => setActiveTab('Settings') },
    { label: 'Logout', icon: LogOut, path: '#', id: 'Logout', onClick: handleLogout },
  ];


  const offersData = [
    { id: 1, company: 'Tech Corp', position: 'Frontend Developer', salary: 'KSh 120,000', date: '2024-04-10', status: 'Pending' },
    { id: 2, company: 'Innovate Solutions', position: 'React Specialist', salary: 'KSh 150,000', date: '2024-04-12', status: 'Pending' },
  ];

  const offerColumns = [
    { header: 'Company', accessor: 'company' },
    { header: 'Position', accessor: 'position' },
    { header: 'Salary', accessor: 'salary' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="table-actions">
          <button className="btn-table btn-accept">Accept</button>
          <button className="btn-table btn-decline">Decline</button>
        </div>
      )
    }
  ];

  const chartData = [
    { name: 'Jan', apps: 4 },
    { name: 'Feb', apps: 7 },
    { name: 'Mar', apps: 5 },
    { name: 'Apr', apps: 12 },
  ];

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div className="stats-row">
        <div className="card profile-stat-card">
          <div className="flex items-center gap-4">
            <div className="profile-avatar-large">
              {userObj?.profile_picture ? <img src={userObj.profile_picture} alt="Profile" className="avatar-img" /> : <span>{userInitials}</span>}
            </div>
            <div>
              <h3 className="m-0">Welcome, {userName}!</h3>
              <p className="text-muted small">Jobseeker ID: KZI-{user?._id?.substring(0, 6) || 'N/A'}</p>
            </div>
          </div>
        </div>
        <StatCard title="Profile Views" value="124" icon={Eye} trend="up" trendValue="12" />
        <StatCard title="Job Applications" value="18" icon={Briefcase} trend="up" trendValue="5" />
        <StatCard title="Active Offers" value="2" icon={TrendingUp} color="maroon" />
      </div>


      <div className="dashboard-main-grid">
        <div className="dashboard-left-col">
          <div className="card profile-completion-card">
            <div className="card-header-flex">
              <h3>Profile Completion</h3>
              <span className="completion-text">85%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '85%' }}></div>
            </div>
            <p className="card-note">Complete your profile to increase visibility by 40%</p>
            <button className="btn-outline-maroon mt-4">Edit Profile</button>
          </div>

          <div className="card mt-6">
            <div className="card-header-flex">
              <h3>Application Analytics</h3>
              <Badge variant="maroon">Last 4 Months</Badge>
            </div>
            <div className="mt-4">
              <Chart data={chartData} xKey="name" yKey="apps" />
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h3>Job Offers</h3>
            </div>
            <DataTable
              columns={offerColumns}
              data={offersData}
              title="Recent Offers"
            />
          </div>
        </div>


        <div className="dashboard-right-col">
          <div className="card status-card">
            <h3>Verification Status</h3>
            <div className="status-badge-area mt-4">
              <Badge variant="success" size="lg">
                <CheckCircle2 size={16} className="mr-2" />
                Verified
              </Badge>
            </div>
            <p className="mt-4 text-muted small">Your documents have been verified by the KaziLive team.</p>
          </div>

          <div className="card mt-6">
            <h3>Availability</h3>
            <div className="toggle-wrapper mt-4">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">Available for Work</span>
            </div>
          </div>

          <div className="card mt-6 promo-card">
            <h3>Boost Your Profile</h3>
            <p className="mt-2 text-white-muted">Get 5x more views by promoting your profile to top employers.</p>
            <button className="btn-yellow mt-4">Boost My Profile</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout menuItems={menuItems.map(item => ({ ...item, isActive: activeTab === item.id }))} role="jobseeker">
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