import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Plus, Smartphone, CheckCircle, Loader, CircleSlash } from 'lucide-react';
import Badge from '../shared/Badge';
import { useSelector } from 'react-redux';

const EmployerPaymentsView = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('1000');
    const [showForm, setShowForm] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const fetchPayments = async () => {
        setFetching(true);
        try {
            const response = await fetch('/api/employer/payments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTransactions(data);
            }
        } catch (err) {
            console.error('Failed to load payments');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (token) fetchPayments();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/employer/stk-push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone_number: phone,
                    amount: amount
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Payment simulated successfully! Your account is now verified.');
                setTimeout(() => {
                    setShowForm(false);
                    fetchPayments();
                }, 2000);
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (err) {
            setMessage('Failed to initiate payment simulation');
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Payments & Credits</h2>
                <button className="btn-maroon" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Top Up Balance'}
                </button>
            </div>

            {showForm && (
                <div className="card mt-6">
                    <h3>Deposit via M-Pesa (Daraja Simulation)</h3>
                    <p className="text-muted small">Enter your phone number to receive a simulated STK push.</p>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-group">
                            <label className="form-label">M-Pesa Phone Number</label>
                            <div className="input-icon-wrapper">
                                <Smartphone size={18} />
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="2547XXXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (KSh)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Processing STK Push...' : 'Initiate Secure Payment'}
                        </button>
                        {message && (
                            <div className={`alert mt-4 ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                                {message.includes('successfully') ? <CheckCircle size={16} className="mr-2" /> : null}
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            )}

            <div className="stats-row mt-6">
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-success-light text-success"><CreditCard size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Current Status</span>
                        <h3 className="m-0">{transactions.length > 0 ? 'Verified' : 'Pending'}</h3>
                    </div>
                </div>
                <div className="card stat-card-horizontal flex-1">
                    <div className="stat-icon bg-maroon-lightest text-maroon"><ArrowUpRight size={24} /></div>
                    <div className="stat-info">
                        <span className="text-muted">Total Spent</span>
                        <h3 className="m-0">KSh {totalSpent.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="card mt-6 p-0">
                <h4 className="p-4 m-0 border-b">Recent Transactions</h4>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Ref No.</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching ? (
                                <tr><td colSpan="5" className="text-center py-12"><Loader className="animate-spin mx-auto" /></td></tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-muted">
                                        <CircleSlash size={32} className="mx-auto opacity-20 mb-2" />
                                        No transactions yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="flex items-center gap-2">
                                            <ArrowDownLeft size={14} className="text-success" />
                                            Deposit
                                        </td>
                                        <td className="text-success font-bold">KSh {tx.amount.toLocaleString()}</td>
                                        <td>{tx.created_at}</td>
                                        <td className="text-mono small">{tx.transaction_id}</td>
                                        <td>
                                            <Badge variant="success">{tx.status}</Badge>
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
