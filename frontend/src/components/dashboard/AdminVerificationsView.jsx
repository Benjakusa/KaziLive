import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../services/api';
import { CheckSquare, Eye, Check, X, FileText, Loader, ExternalLink, Trash2, Search, Filter } from 'lucide-react';
import Badge from '../shared/Badge';

const AdminVerificationsView = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`https://kazilive-backend.onrender.com/api/admin/documents?_t=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data);
            } else {
                setError(data.error || 'Failed to fetch verification requests');
            }
        } catch (err) {
            setError('Failed to load verification queue.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        let body = null;
        if (action === 'reject') {
            const reason = prompt('Please enter a reason for rejection:', 'Document did not meet requirements');
            if (reason === null) return; // User cancelled
            body = JSON.stringify({ reason });
        }

        try {
            const response = await fetch(`${BASE_URL}/admin/documents/${id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });
            if (response.ok) {
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: action === 'approve' ? 'Verified' : 'Rejected' } : req
                ));
            } else {
                const data = await response.json();
                alert(`Action failed: ${data.error}`);
            }
        } catch (err) {
            alert('Action failed. Check your connection.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document permanently?')) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/admin/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setRequests(requests.filter(req => req.id !== id));
            } else {
                const data = await response.json();
                alert(`Delete failed: ${data.error}`);
            }
        } catch (err) {
            alert('Delete failed. Check your connection.');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.user_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <div>
                    <h2>Verification Queue</h2>
                    <p className="text-muted text-sm">Review submitted documents and verify user identities</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary flex items-center gap-2" onClick={fetchRequests} disabled={loading}>
                        {loading ? <Loader size={16} className="animate-spin" /> : 'Refresh List'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6 mb-4">
                <div className="search-box flex-1">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user name..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter size={18} className="text-muted" />
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="card mt-2 p-0 overflow-hidden shadow-sm">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Document Detail</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && requests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-12"><Loader size={24} className="animate-spin mx-auto mb-2 text-primary" /> Loading queue...</td></tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-12 text-muted">No documents matching your criteria.</td></tr>
                        ) : (
                            filteredRequests.map(req => (
                                <tr key={req.id}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-primary-dark">{req.user_name}</span>
                                        </div>
                                    </td>
                                    <td><Badge variant={req.user_type === 'Jobseeker' ? 'maroon' : 'black'}>{req.user_type}</Badge></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-muted" />
                                            <div className="flex flex-col">
                                                <span className="truncate max-w-[150px] font-medium" title={req.file_name}>{req.file_name}</span>
                                                <span className="text-xs text-muted capitalize">{req.file_type || 'Document'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{req.uploaded_at}</td>
                                    <td>
                                        <Badge variant={req.status === 'Verified' ? 'success' : (req.status === 'Under Review' ? 'warning' : 'error')}>
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <a
                                                href={req.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-table btn-view"
                                                title="View Document"
                                            >
                                                <Eye size={14} />
                                            </a>
                                            {req.status === 'Under Review' && (
                                                <>
                                                    <button
                                                        className="btn-table btn-accept"
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        title="Approve"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        className="btn-table btn-decline"
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                        title="Reject"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="btn-table btn-delete"
                                                onClick={() => handleDelete(req.id)}
                                                title="Delete Document"
                                            >
                                                <Trash2 size={14} />
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
    );
};

export default AdminVerificationsView;
