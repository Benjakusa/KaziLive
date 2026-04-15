import React, { useState, useEffect } from 'react';
import { CreditCard, Users, CheckCircle, Clock, AlertCircle, DollarSign, Smartphone, BadgeCheck, ShieldOff } from 'lucide-react';
import Badge from '../shared/Badge';
import DataTable from '../shared/DataTable';

const AdminPaymentsView = () => {
    const [loading, setLoading] = useState(false);
    const [employers, setEmployers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeView, setActiveView] = useState('employers');
    const [debugInfo, setDebugInfo] = useState('');

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setDebugInfo('No token in localStorage. Please re-login.');
            return;
        }
        setLoading(true);
        setDebugInfo('Fetching data...');
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const empRes = await fetch('/api/admin/employers', { headers });
            console.log('employers response status:', empRes.status);
            
            if (empRes.ok) {
                const empData = await empRes.json();
                console.log('employers data:', empData);
                setDebugInfo(`Loaded ${empData.length} employers`);
                setEmployers(empData);
                setStats({
                    total_employers: empData.length,
                    verified_employers: empData.filter(e => e.verified).length,
                    unverified_employers: empData.filter(e => !e.verified).length,
                    pending_payments: empData.filter(e => e.payment_status === 'pending').length
                });
            } else {
                const error = await empRes.text();
                console.log('employers error:', error);
                setDebugInfo(`Error: ${empRes.status} - ${error}`);
            }
            
            const payRes = await fetch('/api/admin/payments', { headers });
            if (payRes.ok) {
                const payData = await payRes.json();
                setPayments(payData);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            setDebugInfo(`Network error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchData();
        } else {
            setDebugInfo('No token - please re-login as admin');
        }
    }, []);

    return (
        <div className="dashboard-content-area">
            {debugInfo && (
                <div className="alert alert-info mb-4">
                    {debugInfo} | Employers: {employers.length}
                </div>
            )}
            <div className="section-header-flex">
                <h2>Payment & Token Management</h2>
                <div className="flex gap-2">
                    <button 
                        className={`btn ${activeView === 'employers' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveView('employers')}
                    >
                        <Users size={16} /> Employers & Tokens
                    </button>
                    <button 
                        className={`btn ${activeView === 'payments' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveView('payments')}
                    >
                        <CreditCard size={16} /> Transactions
                    </button>
                </div>
            </div>

            <div className="stats-row mt-6">
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-blue-light text-blue"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Total Employers</span>
                        <h3 className="m-0">{stats?.total_employers || 0}</h3>
                    </div>
                </div>
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-success-light text-success"><BadgeCheck size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Verified (Has Token)</span>
                        <h3 className="m-0">{stats?.verified_employers || 0}</h3>
                    </div>
                </div>
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-yellow-light text-yellow"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Pending Payment</span>
                        <h3 className="m-0">{stats?.pending_payments || 0}</h3>
                    </div>
                </div>
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-muted-light text-muted"><ShieldOff size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Unverified</span>
                        <h3 className="m-0">{stats?.unverified_employers || 0}</h3>
                    </div>
                </div>
            </div>

            {activeView === 'employers' ? (
                <div className="card mt-6">
                    <div className="card-header-flex">
                        <h3>Employer Token Status</h3>
                        <Badge variant="maroon">{stats?.total_employers || 0} Employers</Badge>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Company</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Token Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                                ) : employers.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No employers found</td></tr>
                                ) : (
                                    employers.map(emp => (
                                        <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{emp.company_name}</td>
                                            <td style={{ padding: '12px' }}>{emp.email}</td>
                                            <td style={{ padding: '12px' }}>{emp.company_location}</td>
                                            <td style={{ padding: '12px' }}>
                                                {emp.verified ? (
                                                    <span style={{ color: 'green' }}>✓ Has Token</span>
                                                ) : (
                                                    <span style={{ color: '#999' }}>No Token</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px' }}>{emp.payment_status || 'none'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card mt-6">
                    <div className="card-header-flex">
                        <h3>Payment Transactions</h3>
                        <Badge variant="maroon">{payments.length} Transactions</Badge>
                    </div>
                    <DataTable
                        columns={[
                            {
                                header: 'Employer',
                                accessor: 'user_name',
                                render: (name, row) => (
                                    <div className="flex items-center gap-2">
                                        <span>{name}</span>
                                        {row.is_verified && <BadgeCheck size={14} className="text-success" />}
                                    </div>
                                )
                            },
                            { header: 'Email', accessor: 'user_email' },
                            {
                                header: 'Phone',
                                accessor: 'phone',
                                render: (phone) => (
                                    <span className="flex items-center gap-1 text-muted">
                                        <Smartphone size={12} /> {phone}
                                    </span>
                                )
                            },
                            {
                                header: 'Amount',
                                accessor: 'amount',
                                render: (amount) => (
                                    <span className="font-bold text-success">KSh {amount.toLocaleString()}</span>
                                )
                            },
                            {
                                header: 'M-Pesa Receipt',
                                accessor: 'mpesa_receipt',
                                render: (receipt) => receipt || <span className="text-muted">—</span>
                            },
                            {
                                header: 'Status',
                                accessor: 'status',
                                render: (status) => (
                                    <Badge 
                                        variant={
                                            status === 'completed' ? 'success' : 
                                            status === 'pending' ? 'yellow' : 'error'
                                        }
                                    >
                                        {status}
                                    </Badge>
                                )
                            },
                            { header: 'Date', accessor: 'created_at' }
                        ]}
                        data={payments}
                        title="All Transactions"
                        loading={loading}
                        emptyMessage="No transactions recorded"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsView;
