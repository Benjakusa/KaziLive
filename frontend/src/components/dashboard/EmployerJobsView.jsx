import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, Eye, Edit3, Trash2, Loader, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import Badge from '../shared/Badge';

const EmployerJobsView = () => {
    const { token } = useSelector((state) => state.auth);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/employer/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setContacts(data);
            } else {
                setError(data.error || 'Failed to fetch contact history');
            }
        } catch (err) {
            setError('Failed to load history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchContacts();
    }, [token]);

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Contact History</h2>
                <div className="stats-pill">
                    <span>{contacts.length} Sent</span>
                </div>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="card mt-6 p-0 overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Talent</th>
                            <th>Status</th>
                            <th>Message Preview</th>
                            <th>Sent On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-12"><Loader className="animate-spin mx-auto" /></td></tr>
                        ) : contacts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-muted">
                                    <MessageSquare size={32} className="mx-auto opacity-20 mb-2" />
                                    No contact requests sent yet. Browse talent to get started.
                                </td>
                            </tr>
                        ) : (
                            contacts.map(contact => (
                                <tr key={contact.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {contact.jobseeker_picture ? (
                                                    <img src={contact.jobseeker_picture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={14} />
                                                )}
                                            </div>
                                            <strong>{contact.jobseeker_name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge variant="success">Sent</Badge>
                                    </td>
                                    <td><span className="text-muted small truncate max-w-[200px] block">{contact.message}</span></td>
                                    <td>{contact.created_at}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-table btn-view" title="View Details"><Eye size={14} /></button>
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

export default EmployerJobsView;
