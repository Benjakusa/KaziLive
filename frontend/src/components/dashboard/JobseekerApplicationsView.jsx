import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, MessageSquare, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import Badge from '../shared/Badge';

const JobseekerApplicationsView = () => {
    const { token } = useSelector((state) => state.auth);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/jobseeker/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setContacts(data);
            } else {
                setError(data.error || 'Failed to fetch contact requests');
            }
        } catch (err) {
            setError('Failed to load contacts.');
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
                <h2>Contact Requests</h2>
                <div className="stats-pill">
                    <span>{contacts.length} Total</span>
                </div>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="app-grid mt-6">
                {loading ? (
                    <div className="text-center py-8 w-full"><Loader className="animate-spin mx-auto" /></div>
                ) : contacts.length === 0 ? (
                    <div className="card text-center py-12 w-full">
                        <MessageSquare size={48} className="mx-auto text-muted opacity-20" />
                        <h3 className="mt-4">No contact requests yet</h3>
                        <p className="text-muted">Employers will appear here once they reach out to you.</p>
                    </div>
                ) : (
                    contacts.map(contact => (
                        <div key={contact.id} className="card app-card">
                            <div className="app-header">
                                <div className="company-logo-stub">
                                    {contact.company_logo ? (
                                        <img src={contact.company_logo} alt={contact.company_name} className="w-full h-full object-cover rounded" />
                                    ) : (
                                        contact.company_name?.charAt(0) || 'E'
                                    )}
                                </div>
                                <div className="app-title">
                                    <h4>{contact.company_name}</h4>
                                    <p>Employer reached out</p>
                                </div>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="app-body mt-4">
                                <div className="contact-message-preview p-3 bg-light rounded text-small">
                                    "{contact.message}"
                                </div>
                                <div className="app-detail-row mt-4">
                                    <span><Clock size={14} /> Received {contact.created_at}</span>
                                </div>
                            </div>
                            <div className="app-footer mt-4">
                                <button className="btn-maroon full-width">Reply to Inbox</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobseekerApplicationsView;
