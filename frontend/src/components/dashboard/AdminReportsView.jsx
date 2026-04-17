import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CreditCard, Loader } from 'lucide-react';
import Chart from '../shared/Chart';
import { BASE_URL } from '../../services/api';

const AdminReportsView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/admin/stats?_t=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            } else {
                setError(data.error || 'Failed to fetch platform metrics');
            }
        } catch (err) {
            setError('Failed to load reports.');
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

    if (loading && !stats) return <div className="text-center py-20"><Loader className="animate-spin mx-auto" /><p className="mt-4">Compiling reports...</p></div>;

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Reports & Analytics</h2>
                <button className="btn-secondary" onClick={fetchStats}>Refresh Data</button>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="grid-2-col mt-6">
                <div className="card">
                    <h3>User Distribution</h3>
                    <div className="mt-4">
                        <Chart type="bar" data={chartData} xKey="name" yKey="Users" color="#800020" />
                    </div>
                </div>
                <div className="card">
                    <h3>Engagement Overview</h3>
                    <div className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="p-4 bg-light rounded border-left-maroon">
                                <span className="text-muted small">Total Documents</span>
                                <h2 className="m-0">{stats?.total_documents || 0}</h2>
                            </div>
                            <div className="p-4 bg-light rounded border-left-black">
                                <span className="text-muted small">Jobseekers</span>
                                <h2 className="m-0">{stats?.jobseekers || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-6">
                <h3>Financial Summary (Simulated)</h3>
                <div className="grid-3-col mt-4">
                    <div className="metric">
                        <span className="text-muted small">Total Revenue</span>
                        <h4 className="m-0 text-maroon">KSh {stats?.total_revenue?.toLocaleString() || 0}</h4>
                    </div>
                    <div className="metric">
                        <span className="text-muted small">Avg. Transaction</span>
                        <h4 className="m-0">KSh {(stats?.total_revenue / (stats?.employers || 1)).toFixed(0)}</h4>
                    </div>
                    <div className="metric">
                        <span className="text-muted small">Pending Verifications</span>
                        <h4 className="m-0 text-yellow">{stats?.pending_verifications || 0}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsView;
