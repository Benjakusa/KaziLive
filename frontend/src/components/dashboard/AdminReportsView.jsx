import React, { useState, useEffect } from 'react';
import { adminGetStats } from '../../services/api';
import { BarChart3, TrendingUp, Users, CreditCard, Loader } from 'lucide-react';
import Chart from '../shared/Chart';

const AdminReportsView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminGetStats();
            setStats(data);
        } catch (err) {
            console.error("ADMIN STATS ERROR:", err);
            setError(err.message || 'Failed to load platform metrics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const chartData = [
        { name: 'Platform Stats', Users: stats?.total_users || 0, Jobseekers: stats?.jobseekers || 0, Employers: stats?.employers || 0 },
    ];

    if (loading && !stats) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="animate-spin text-maroon" size={32} />
            <p className="text-gray-500 font-medium font-bold uppercase tracking-widest text-xs">Compiling reports...</p>
        </div>
    );

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">Reports & Analytics</h2>
                    <p className="text-gray-500 text-sm">Real-time platform performance and user distribution</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all" onClick={fetchStats}>
                    Refresh Data
                </button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-6 border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-6">
                    <h3 className="text-md font-bold mb-6">User Distribution</h3>
                    <div className="h-64">
                        <Chart type="bar" data={chartData} xKey="name" yKey="Users" color="#800000" />
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-md font-bold mb-6">Engagement Overview</h3>
                    <div className="space-y-4">
                        <div className="p-6 bg-gray-50/50 rounded-2xl border-l-4 border-maroon">
                            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Documents</span>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.total_documents || 0}</h2>
                        </div>
                        <div className="p-6 bg-gray-50/50 rounded-2xl border-l-4 border-black">
                            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Jobseekers Joined</span>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.jobseekers || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card mt-8 p-8">
                <h3 className="text-md font-bold mb-6">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Revenue</span>
                        <h4 className="text-2xl font-black text-maroon">KSh {stats?.total_revenue?.toLocaleString() || 0}</h4>
                    </div>
                    <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Avg. ARPU</span>
                        <h4 className="text-2xl font-black text-gray-900">KSh {(stats?.total_revenue / (stats?.employers || 1)).toFixed(0)}</h4>
                    </div>
                    <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Pending Verification</span>
                        <h4 className="text-2xl font-black text-yellow-600">{stats?.pending_verifications || 0}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsView;
