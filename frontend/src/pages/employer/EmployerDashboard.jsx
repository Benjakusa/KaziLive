import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard,
  Users,
  Heart,
  Briefcase,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Zap,
  History,
  TrendingUp
} from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import Chart from '../../components/shared/Chart';
import EmployerSavedView from '../../components/dashboard/EmployerSavedView';
import EmployerJobsView from '../../components/dashboard/EmployerJobsView';
import EmployerPaymentsView from '../../components/dashboard/EmployerPaymentsView';
import EmployerSettingsView from '../../components/dashboard/EmployerSettingsView';
import EmployerSearch from '../EmployerSearch';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Overview');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/employer/login');
  };

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '#', id: 'Overview', onClick: () => setActiveTab('Overview') },
    { label: 'Browse Talent', icon: Search, path: '#', id: 'Talent', onClick: () => setActiveTab('Talent') },
    { label: 'Saved Profiles', icon: Heart, path: '#', id: 'Saved', onClick: () => setActiveTab('Saved') },
    { label: 'My Jobs', icon: Briefcase, path: '#', id: 'Jobs', onClick: () => setActiveTab('Jobs') },
    { label: 'Payment History', icon: History, path: '#', id: 'Payments', onClick: () => setActiveTab('Payments') },
    { label: 'Settings', icon: Settings, path: '#', id: 'Settings', onClick: () => setActiveTab('Settings') },
    { label: 'Logout', icon: LogOut, path: '#', id: 'Logout', onClick: handleLogout },
  ];


  const talentData = [
    { id: 1, name: 'John Doe', category: 'Frontend Developer', experience: '5 years', rating: '4.8', status: 'Available' },
    { id: 2, name: 'Jane Smith', category: 'UI/UX Designer', experience: '3 years', rating: '4.9', status: 'Available' },
    { id: 3, name: 'Samuel Waweru', category: 'Backend Engineer', experience: '7 years', rating: '4.7', status: 'In Interview' },
  ];

  const talentColumns = [
    { header: 'Talent Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Experience', accessor: 'experience' },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => (
        <Badge variant={status === 'Available' ? 'success' : 'yellow'}>{status}</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <button
          className="btn-table btn-view-profile"
          onClick={() => navigate(`/employer/profile/${id}`)}
        >
          View Profile
        </button>
      )
    }
  ];

  const chartData = [
    { name: 'Mon', views: 12 },
    { name: 'Tue', views: 19 },
    { name: 'Wed', views: 15 },
    { name: 'Thu', views: 22 },
    { name: 'Fri', views: 30 },
    { name: 'Sat', views: 10 },
    { name: 'Sun', views: 8 },
  ];

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div className="stats-row">
        <StatCard title="Credit Balance" value="450" icon={CreditCard} />
        <StatCard title="Profiles Viewed" value="28" icon={Users} trend="up" trendValue="15" />
        <StatCard title="Saved Talent" value="12" icon={Heart} />
        <StatCard title="Response Rate" value="94%" icon={TrendingUp} />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-col">
          <div className="card talent-search-card">
            <div className="card-header-flex">
              <h3>Quick Talent Search</h3>
              <Zap size={20} className="text-yellow" />
            </div>
            <div className="search-box-large mt-4">
              <Search size={24} className="search-icon-large" />
              <input type="text" className="form-input" placeholder="Search by skills, title, or location..." />
              <button className="btn-primary">Search</button>
            </div>
            <div className="tag-group mt-4">
              <span className="search-tag">React.js</span>
              <span className="search-tag">Python</span>
              <span className="search-tag">Product Manager</span>
              <span className="search-tag">Graphic Design</span>
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header-flex">
              <h3>Profile View Analytics</h3>
              <Badge variant="primary">This Week</Badge>
            </div>
            <div className="mt-4">
              <Chart type="bar" data={chartData} xKey="name" yKey="views" />
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h3>Recommended Matches (AI)</h3>
            </div>
            <DataTable
              columns={talentColumns}
              data={talentData}
              title="Talent matching your active jobs"
            />
          </div>
        </div>


        <div className="dashboard-right-col">
          <div className="card billing-card">
            <h3>Recent Billing</h3>
            <div className="billing-summary mt-4">
              <div className="billing-item">
                <span>Last Deposit (M-Pesa)</span>
                <span className="font-bold">KSh 5,000</span>
              </div>
              <div className="billing-item mt-2">
                <span>Last View Deducted</span>
                <span className="text-maroon font-bold">-10 Credits</span>
              </div>
            </div>
            <button className="btn-yellow-outline btn-block mt-6">Top Up Credits</button>
          </div>

          <div className="card mt-6 job-post-cta">
            <h3>Need to post a job?</h3>
            <p className="mt-2 small">Post a public job listing to reach more candidates.</p>
            <button className="btn-white-maroon mt-4">Post Public Job</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout menuItems={menuItems.map(item => ({ ...item, isActive: activeTab === item.id }))} role="employer">

      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Talent' && <EmployerSearch />}
      {activeTab === 'Saved' && <EmployerSavedView />}
      {activeTab === 'Jobs' && <EmployerJobsView />}
      {activeTab === 'Payments' && <EmployerPaymentsView />}
      {activeTab === 'Settings' && <EmployerSettingsView />}
    </DashboardLayout>
  );
};

export default EmployerDashboard;