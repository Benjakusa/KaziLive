import React, { useState, useEffect } from 'react';
import { getEmployerPayments, employerStkPush } from '../../services/api';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Plus, Smartphone, CheckCircle, Loader, CircleSlash, AlertCircle } from 'lucide-react';
import Badge from '../shared/Badge';

const EmployerPaymentsView = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('1000');
    const [showForm, setShowForm] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    const fetchPayments = async () => {
        setFetching(true);
        setError('');
        try {
            const data = await getEmployerPayments();
            setTransactions(data);
        } catch (err) {
            console.error('Failed to load payments:', err);
            setError(err.message || 'Failed to load transaction history.');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await employerStkPush(phone, amount);
            setMessage('✅ Payment processed successfully! Your business account is now verified.');
            setPhone('');
            setTimeout(() => {
                setShowForm(false);
                fetchPayments();
            }, 2500);
        } catch (err) {
            setMessage(`❌ Error: ${err.message || 'Payment failed'}`);
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">Payments & Verification</h2>
                    <p className="text-gray-500 text-sm">Manage your billing and professional subscription status</p>
                </div>
                <button
                    className={`glass-button !h-12 !px-6 ${showForm ? 'black' : ''}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <CircleSlash size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel Payment' : 'Verify Account'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card mt-8 p-8 border-l-4 border-maroon">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">M-Pesa Verification</h3>
                            <p className="text-gray-400 text-xs font-medium">Verify your company to unlock all jobseeker profiles</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number (M-Pesa)</label>
                            <input
                                type="tel"
                                className="glass-input"
                                placeholder="2547XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount (KSh)</label>
                            <input
                                type="number"
                                className="glass-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-full">
                            <button
                                type="submit"
                                className="glass-button w-full h-16 text-lg"
                                disabled={loading}
                            >
                                {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Process Simulated Payment'}
                            </button>
                        </div>
                        {message && (
                            <div className={`col-span-full p-4 rounded-2xl text-sm font-medium border ${message.includes('❌') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Account Status</span>
                        <h3 className="text-xl font-black text-gray-900">
                            {transactions.some(tx => tx.status === 'completed') ? 'Verified' : 'Pending'}
                        </h3>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-maroon/5 text-maroon flex items-center justify-center">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Billing</span>
                        <h3 className="text-xl font-black text-gray-900">KSh {totalSpent.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="glass-card mt-8 p-0 overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Transaction History</h3>
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                        <Clock size={16} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ref No.</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {fetching ? (
                                <tr><td colSpan="5" className="p-20 text-center"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-gray-400 italic">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                                <ArrowDownLeft size={14} className="text-emerald-500" />
                                                Verification
                                            </div>
                                        </td>
                                        <td className="p-4"><span className="font-black text-emerald-600">KSh {(tx.amount || 0).toLocaleString()}</span></td>
                                        <td className="p-4"><span className="text-xs font-mono text-gray-400">{tx.transaction_id}</span></td>
                                        <td className="p-4 text-xs font-medium text-gray-500">{tx.created_at}</td>
                                        <td className="p-4">
                                            <Badge variant={tx.status === 'completed' ? 'success' : 'yellow'}>
                                                <span className="uppercase font-black text-[10px] tracking-widest">{tx.status}</span>
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployerPaymentsView;
