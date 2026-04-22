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

      <div className="dashboard-main-grid flex-1">
        <div className="dashboard-left-col space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Zap size={20} className="text-amber-500" /> Quick Talent Search
              </h3>
              <Badge variant="primary">AI Powered</Badge>
            </div>
            <div className="relative group">
              <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
              <input
                type="text"
                className="glass-input pl-14 h-14 text-base"
                placeholder="Search by skills, title, or location..."
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 glass-button h-10 px-6">Search</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['React.js', 'Python', 'Product Manager', 'Graphic Design'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-maroon/5 hover:text-maroon transition-colors cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-maroon" /> Profile View Analytics
              </h3>
              <Badge variant="primary">This Week</Badge>
            </div>
            <div className="h-[250px]">
              <Chart type="bar" data={chartData} xKey="name" yKey="views" />
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Recommended Matches</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-maroon hover:underline">See All &rarr;</button>
            </div>
            <DataTable
              columns={talentColumns}
              data={talentData}
            />
          </div>
        </div>

        <div className="dashboard-right-col space-y-8">
          <div className="glass-card p-8 bg-gradient-to-br from-maroon/5 to-transparent border-l-4 border-maroon">
            <h3 className="font-bold text-gray-900 mb-6">Billing Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-xs font-medium text-gray-400">Last Deposit</span>
                <span className="font-black text-gray-900">KSh 5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400">Last View</span>
                <span className="font-black text-maroon">-10 Credits</span>
              </div>
            </div>
            <button className="glass-button w-full h-12 mt-8">Top Up Credits</button>
          </div>

          <div className="glass-card p-8 border-l-4 border-indigo-500 bg-indigo-50/20">
            <h3 className="font-bold text-indigo-600 text-sm uppercase tracking-tight mb-2">Recruitment Booster</h3>
            <p className="text-xs font-medium text-indigo-800 leading-relaxed mb-6">Post a public job listing to reach thousands of candidates instantly.</p>
            <button className="glass-button black w-full h-12">Post Public Job</button>
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