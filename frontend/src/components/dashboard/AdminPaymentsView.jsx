import React, { useState, useEffect } from 'react';
import { adminListEmployers, adminListPayments } from '../../services/api';
import { CreditCard, Users, CheckCircle, Clock, AlertCircle, DollarSign, Smartphone, BadgeCheck, ShieldOff, Loader } from 'lucide-react';
import Badge from '../shared/Badge';
import DataTable from '../shared/DataTable';

const AdminPaymentsView = () => {
    const [loading, setLoading] = useState(false);
    const [employers, setEmployers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeView, setActiveView] = useState('employers');
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [empData, payData] = await Promise.all([
                adminListEmployers(),
                adminListPayments()
            ]);

            setEmployers(empData);
            setPayments(payData);
            setStats({
                total_employers: empData.length,
                verified_employers: empData.filter(e => e.verified).length,
                unverified_employers: empData.filter(e => !e.verified).length,
                pending_payments: empData.filter(e => e.payment_status === 'pending').length
            });
        } catch (err) {
            console.error('Failed to load data:', err);
            setError(err.message || 'Failed to load business data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">Payments & Verification</h2>
                    <p className="text-gray-500 text-sm">Monitor transactions and employer token authorization</p>
                </div>
                <div className="flex glass-card p-1">
                    <button
                        className={`glass-button flex-1 !rounded-xl !border-none !shadow-none ${activeView === 'employers' ? '!bg-maroon !color-white' : '!bg-transparent !text-gray-500'}`}
                        onClick={() => setActiveView('employers')}
                    >
                        Employers
                    </button>
                    <button
                        className={`glass-button flex-1 !rounded-xl !border-none !shadow-none ${activeView === 'payments' ? '!bg-maroon !color-white' : '!bg-transparent !text-gray-500'}`}
                        onClick={() => setActiveView('payments')}
                    >
                        Transactions
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-6 border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-maroon/5 text-maroon flex items-center justify-center"><Users size={24} /></div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Employers</span>
                        <h3 className="text-xl font-black text-gray-900">{stats?.total_employers || 0}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><BadgeCheck size={24} /></div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Verified</span>
                        <h3 className="text-xl font-black text-gray-900">{stats?.verified_employers || 0}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Clock size={24} /></div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pending</span>
                        <h3 className="text-xl font-black text-gray-900">{stats?.pending_payments || 0}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center"><ShieldOff size={24} /></div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Restricted</span>
                        <h3 className="text-xl font-black text-gray-900">{stats?.unverified_employers || 0}</h3>
                    </div>
                </div>
            </div>

            {activeView === 'employers' ? (
                <div className="glass-card mt-8 p-0 overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-md font-bold">Employer Status & Tokens</h3>
                        <button onClick={fetchData} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Clock size={16} /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Company</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Token Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-20 text-center"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                                ) : employers.length === 0 ? (
                                    <tr><td colSpan="4" className="p-20 text-center text-gray-400 italic">No employers found</td></tr>
                                ) : (
                                    employers.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{emp.company_name}</span>
                                                    <span className="text-xs text-gray-400">{emp.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 font-medium">{emp.company_location || 'N/A'}</td>
                                            <td className="p-4">
                                                <Badge variant={emp.verified ? 'success' : 'yellow'}>
                                                    {emp.verified ? 'Authorized' : 'Restricted'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs font-black uppercase tracking-widest ${emp.payment_status === 'completed' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                    {emp.payment_status || 'none'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card mt-8 p-0 overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="text-md font-bold">Transaction History</h3>
                    </div>
                    <DataTable
                        columns={[
                            {
                                header: 'Employer',
                                accessor: 'user_name',
                                render: (name, row) => (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{name}</span>
                                        {row.is_verified && <BadgeCheck size={14} className="text-emerald-500" />}
                                    </div>
                                )
                            },
                            { header: 'Email', accessor: 'user_email' },
                            {
                                header: 'M-Pesa Receipt',
                                accessor: 'mpesa_receipt',
                                render: (receipt) => <span className="font-mono text-xs text-gray-500">{receipt || '—'}</span>
                            },
                            {
                                header: 'Amount',
                                accessor: 'amount',
                                render: (amount) => (
                                    <span className="font-black text-emerald-600">KSh {amount.toLocaleString()}</span>
                                )
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
                                        <span className="uppercase font-black text-[10px] tracking-widest">{status}</span>
                                    </Badge>
                                )
                            },
                            {
                                header: 'Date',
                                accessor: 'created_at',
                                render: (date) => <span className="text-xs text-gray-400 font-medium">{date}</span>
                            }
                        ]}
                        data={payments}
                        loading={loading}
                        emptyMessage="No transactions recorded"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsView;
