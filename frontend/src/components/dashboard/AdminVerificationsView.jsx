import React, { useState, useEffect } from 'react';
import { adminListDocuments, adminApproveDocument, adminRejectDocument, adminDeleteDocument } from '../../services/api';
import { CheckSquare, Eye, Check, X, FileText, Loader, ExternalLink, Trash2, Search, Filter } from 'lucide-react';
import Badge from '../shared/Badge';

const AdminVerificationsView = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminListDocuments();
            setRequests(data);
        } catch (err) {
            console.error("ADMIN FETCH DOCS ERROR:", err);
            setError(err.message || 'Failed to load verification queue.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await adminApproveDocument(id);
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: 'Verified' } : req
                ));
            } else if (action === 'reject') {
                const reason = prompt('Please enter a reason for rejection:', 'Document did not meet requirements');
                if (reason === null) return;
                await adminRejectDocument(id, reason);
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: 'Rejected' } : req
                ));
            }
        } catch (err) {
            alert(`Action failed: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document permanently?')) return;

        try {
            await adminDeleteDocument(id);
            setRequests(requests.filter(req => req.id !== id));
        } catch (err) {
            alert(`Delete failed: ${err.message}`);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = (req.user_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">Verification Queue</h2>
                    <p className="text-gray-500 text-sm">Review submitted documents and verify professional identities</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all" onClick={fetchRequests} disabled={loading}>
                        {loading ? <Loader size={16} className="animate-spin" /> : 'Refresh List'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user name..."
                        className="glass-input pl-10 h-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="glass-input h-12"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 border border-red-100">{error}</div>}

            <div className="glass-card p-0 overflow-hidden shadow-sm border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Document Detail</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Submitted</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading && requests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-20"><Loader size={32} className="animate-spin mx-auto mb-4 text-maroon" /> <p className="text-gray-500 font-medium">Loading verification queue...</p></td></tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-20 text-gray-400 font-medium italic">No documents matching your criteria.</td></tr>
                        ) : (
                            filteredRequests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-bold text-gray-900">{req.user_name}</span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={req.user_type === 'Jobseeker' ? 'maroon' : 'black'}>{req.user_type}</Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                <FileText size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="truncate max-w-[150px] font-bold text-sm text-gray-800" title={req.file_name}>{req.file_name}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{req.file_type || 'Document'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-medium">{req.uploaded_at}</td>
                                    <td className="p-4">
                                        <Badge variant={req.status === 'Verified' ? 'success' : (req.status === 'Under Review' ? 'yellow' : (req.status === 'Rejected' ? 'dark' : 'yellow'))}>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Verified' ? 'bg-success' : 'bg-yellow-500'}`} />
                                                {req.status}
                                            </div>
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={req.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-maroon hover:bg-maroon/5 rounded-lg transition-all"
                                                title="View Document"
                                            >
                                                <Eye size={18} />
                                            </a>
                                            {(req.status === 'Under Review' || req.status === 'pending') && (
                                                <>
                                                    <button
                                                        className="glass-button p-2"
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                    >
                                                        <Check size={14} />
                                                        Verify
                                                    </button>
                                                    <button
                                                        className="glass-button black p-2"
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                    >
                                                        <X size={14} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                onClick={() => handleDelete(req.id)}
                                                title="Delete Document"
                                            >
                                                <Trash2 size={18} />
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
