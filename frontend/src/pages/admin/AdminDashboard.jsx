import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CreditCard,
  BarChart3,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import Chart from '../../components/shared/Chart';
import AdminUsersView from '../../components/dashboard/AdminUsersView';
import AdminVerificationsView from '../../components/dashboard/AdminVerificationsView';
import AdminReportsView from '../../components/dashboard/AdminReportsView';
import AdminPaymentsView from '../../components/dashboard/AdminPaymentsView';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Overview');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '#', id: 'Overview', onClick: () => setActiveTab('Overview') },
    { label: 'User Management', icon: Users, path: '#', id: 'Users', onClick: () => setActiveTab('Users') },
    { label: 'Verification Requests', icon: CheckSquare, path: '#', id: 'Verifications', onClick: () => setActiveTab('Verifications') },
    { label: 'Payment Management', icon: CreditCard, path: '#', id: 'Payments', onClick: () => setActiveTab('Payments') },
    { label: 'Reports & Analytics', icon: BarChart3, path: '#', id: 'Reports', onClick: () => setActiveTab('Reports') },
    { label: 'Logout', icon: LogOut, path: '#', id: 'Logout', onClick: handleLogout },
  ];


  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const [statsRes, verifRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/documents', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (statsRes.status === 401 || verifRes.status === 401) {
        localStorage.clear();
        navigate('/admin/login');
        return;
      }

      if (statsRes.ok) setStats(await statsRes.json());
      if (verifRes.ok) {
        const docs = await verifRes.json();
        setVerifications(docs.filter(d => d.status === 'Under Review').slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div className="stats-row">
        <StatCard title="Total Users" value={stats?.total_users || '0'} icon={Users} trend="up" trendValue="--" />
        <StatCard title="Pending Verifications" value={stats?.pending_verifications || '0'} icon={CheckSquare} color="maroon" />
        <StatCard title="Total Revenue" value={`KSh ${stats?.total_revenue?.toLocaleString() || '0'}`} icon={CreditCard} trend="up" trendValue="--" />
        <StatCard title="Active Issues" value="0" icon={AlertTriangle} color="yellow" />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-col">
          <div className="card">
            <div className="card-header-flex">
              <h3>Engagement Summary</h3>
              <Badge variant="success">Platform status: {stats?.server_status || 'Checking...'}</Badge>
            </div>
            <div className="mt-4">
              <Chart
                data={[
                  { name: 'Jobseekers', count: stats?.jobseekers || 0 },
                  { name: 'Employers', count: stats?.employers || 0 },
                  { name: 'Documents', count: stats?.total_documents || 0 }
                ]}
                xKey="name"
                yKey="count"
                color="#800020"
              />
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header-flex">
              <h3>Verification Queue</h3>
              <Badge variant="yellow">{stats?.pending_verifications || 0} Pending</Badge>
            </div>
            <DataTable
              columns={[
                { header: 'User', accessor: 'user_name' },
                {
                  header: 'Type',
                  accessor: 'user_type',
                  render: (type) => <Badge variant={type === 'jobseeker' ? 'maroon' : 'black'}>{type}</Badge>
                },
                { header: 'Date', accessor: 'uploaded_at' },
                {
                  header: 'Actions',
                  accessor: 'id',
                  render: (id) => (
                    <button className="btn-text-maroon" onClick={() => setActiveTab('Verifications')}>Review</button>
                  )
                }
              ]}
              data={verifications}
              title="Recent Requests"
            />
          </div>
        </div>

        <div className="dashboard-right-col">
          <div className="card health-card">
            <h3>Platform Health</h3>
            <div className="health-metrics mt-4">
              <div className="metric-item">
                <div className="metric-header">
                  <span>Server Status</span>
                  <span className="text-success">{stats ? stats.server_status : 'Offline'}</span>
                </div>
                <div className="mini-progress"><div className="fill bg-success" style={{ width: stats ? '98%' : '0%' }}></div></div>
              </div>
              <div className="metric-item mt-4">
                <div className="metric-header">
                  <span>Database Connectivity</span>
                  <span>OK</span>
                </div>
                <div className="mini-progress"><div className="fill bg-maroon" style={{ width: '100%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h3>Quick Actions</h3>
            <div className="flex flex-col gap-2 mt-4">
              <button className="btn-outline-black btn-block" onClick={() => setActiveTab('Users')}>Manage Users</button>
              <button className="btn-outline-maroon btn-block" onClick={() => setActiveTab('Reports')}>Platform Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout menuItems={menuItems.map(item => ({ ...item, isActive: activeTab === item.id }))} role="admin">

      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Users' && <AdminUsersView />}
      {activeTab === 'Verifications' && <AdminVerificationsView />}
      {activeTab === 'Reports' && <AdminReportsView />}
      {activeTab === 'Payments' && <AdminPaymentsView />}
    </DashboardLayout>

  );
};

export default AdminDashboard;