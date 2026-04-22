import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminGetStats, adminListDocuments, adminApproveDocument } from '../../services/api';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CreditCard,
  BarChart3,
  LogOut,
  AlertTriangle,
  Loader,
  Activity,
  ArrowUpRight
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
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleVerify = async (id) => {
    try {
      await adminApproveDocument(id);
      setVerifications(prev => prev.filter(v => v.id !== id));
      // Refresh stats too if possible
      const statsData = await adminGetStats();
      setStats(statsData);
    } catch (err) {
      alert(`Quick verification failed: ${err.message}`);
    }
  };

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '#', id: 'Overview', onClick: () => setActiveTab('Overview') },
    { label: 'User Index', icon: Users, path: '#', id: 'Users', onClick: () => setActiveTab('Users') },
    { label: 'Verification Queue', icon: CheckSquare, path: '#', id: 'Verifications', onClick: () => setActiveTab('Verifications') },
    { label: 'Transaction Logs', icon: CreditCard, path: '#', id: 'Payments', onClick: () => setActiveTab('Payments') },
    { label: 'Platform Reports', icon: BarChart3, path: '#', id: 'Reports', onClick: () => setActiveTab('Reports') },
    { label: 'Logout', icon: LogOut, path: '#', id: 'Logout', onClick: handleLogout },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, docsData] = await Promise.all([
        adminGetStats(),
        adminListDocuments()
      ]);

      setStats(statsData);
      // Filter for under review documents and take the latest 5
      if (Array.isArray(docsData)) {
        setVerifications(docsData.filter(d => d.status === 'Under Review').slice(0, 5));
      }
    } catch (err) {
      console.error('ADMIN DASHBOARD DATA FETCH ERROR:', err);
      if (err.status === 401) {
        dispatch(logout());
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderOverview = () => (
    <div className="animate-in fade-in duration-700">
      <div className="section-header-flex mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">System Overview</h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Real-time platform performance & health</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card py-2 px-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stats ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Status: {stats?.server_status || 'Offline'}</span>
          </div>
          <button onClick={fetchDashboardData} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-maroon/5 hover:text-maroon transition-all">
            <Activity size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Global Users" value={stats?.total_users || '0'} icon={Users} trend="up" />
        <StatCard title="New Requests" value={stats?.pending_verifications || '0'} icon={CheckSquare} />
        <StatCard title="Platform Revenue" value={`KSh ${stats?.total_revenue?.toLocaleString() || '0'}`} icon={CreditCard} trend="up" />
        <StatCard title="Active Campaigns" value={stats?.active_promotions || 0} icon={ArrowUpRight} />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-col space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-maroon" /> Traffic Engagement
              </h3>
              <Badge variant="success">Normalized</Badge>
            </div>
            <div className="h-[300px]">
              <Chart
                data={[
                  { name: 'Jobseekers', count: stats?.jobseekers || 0 },
                  { name: 'Employers', count: stats?.employers || 0 },
                  { name: 'Documents', count: stats?.total_documents || 0 }
                ]}
                xKey="name"
                yKey="count"
              />
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckSquare size={20} className="text-maroon" /> Pending Queue
              </h3>
              <button
                className="text-[10px] font-black uppercase tracking-widest text-maroon hover:underline"
                onClick={() => setActiveTab('Verifications')}
              >
                View Full Queue &rarr;
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Owner</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Account Type</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Submitted</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="4" className="p-12 text-center"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                  ) : verifications.length === 0 ? (
                    <tr><td colSpan="4" className="p-12 text-center text-gray-400 italic text-sm">No pending verifications at this time.</td></tr>
                  ) : (
                    verifications.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{v.user_name}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant={v.user_type === 'jobseeker' ? 'primary' : 'success'}>
                            <span className="text-[10px] uppercase font-black tracking-widest">{v.user_type}</span>
                          </Badge>
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-500">{v.uploaded_at}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="glass-button p-2 text-[10px]"
                              onClick={() => handleVerify(v.id)}
                            >
                              Verify
                            </button>
                            <button
                              className="glass-button black p-2 text-[10px]"
                              onClick={() => setActiveTab('Verifications')}
                            >
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-right-col space-y-8">
          <div className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 to-transparent">
            <h3 className="font-bold text-gray-900 mb-6">Security Health</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">API Latency</span>
                  <span className="text-emerald-500">Exemplary</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">DB Utilization</span>
                  <span className="text-maroon">Normal</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-maroon w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="font-bold text-gray-900 mb-4">Quick Management</h3>
            <div className="flex flex-col gap-3">
              <button className="glass-button w-full" onClick={() => setActiveTab('Users')}>
                <Users size={16} /> User Directory
              </button>
              <button className="glass-button w-full" onClick={() => setActiveTab('Reports')}>
                <BarChart3 size={16} /> Data Analytics
              </button>
              <button className="glass-button w-full" onClick={() => setActiveTab('Payments')}>
                <CreditCard size={16} /> Financial Logs
              </button>
            </div>
          </div>

          <div className="glass-card p-8 border-l-4 border-emerald-500 bg-emerald-50/20">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <AlertTriangle size={20} />
              <h4 className="font-bold text-sm uppercase tracking-tight">System Notice</h4>
            </div>
            <p className="text-xs font-medium text-emerald-800 leading-relaxed">
              Platform integrity is currently synchronized. No critical alerts pending at this time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout menuItems={menuItems.map(item => ({ ...item, isActive: activeTab === item.id }))} role="admin">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Users' && <AdminUsersView />}
        {activeTab === 'Verifications' && <AdminVerificationsView />}
        {activeTab === 'Reports' && <AdminReportsView />}
        {activeTab === 'Payments' && <AdminPaymentsView />}
      </div>
    </DashboardLayout>

  );
};

export default AdminDashboard;