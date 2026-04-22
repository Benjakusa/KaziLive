import React, { useState, useEffect } from 'react';
import { getJobseekerContacts } from '../../services/api';
import { Briefcase, MapPin, Clock, MessageSquare, Loader } from 'lucide-react';
import Badge from '../shared/Badge';

const JobseekerApplicationsView = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getJobseekerContacts();
            setContacts(data);
        } catch (err) {
            console.error("FETCH CONTACTS ERROR:", err);
            setError(err.message || 'Failed to load contact requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">Contact Requests</h2>
                    <p className="text-gray-500 text-sm">Review messages and requests from potential employers</p>
                </div>
                <div className="px-4 py-2 bg-maroon/5 text-maroon rounded-xl text-xs font-black uppercase tracking-widest">
                    {contacts.length} Total
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-6 border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader className="animate-spin text-maroon" size={32} />
                        <p className="text-gray-400 font-medium">Checking for requests...</p>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4 glass-card border-dashed">
                        <MessageSquare size={48} className="text-gray-200" />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">No requests yet</h3>
                            <p className="text-gray-400 max-w-xs mx-auto text-sm">Employers will appear here once they find your profile and reach out.</p>
                        </div>
                    </div>
                ) : (
                    contacts.map(contact => (
                        <div key={contact.id} className="glass-card hover:shadow-xl transition-all group overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold overflow-hidden shadow-inner">
                                        {contact.company_logo ? (
                                            <img src={contact.company_logo} alt={contact.employer_name} className="w-full h-full object-cover" />
                                        ) : (
                                            (contact.employer_name || 'E').charAt(0)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{contact.employer_name}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Direct Inquiry</p>
                                    </div>
                                    <Badge variant="success">Active</Badge>
                                </div>

                                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 italic text-sm text-gray-600 leading-relaxed mb-6">
                                    "{contact.message}"
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                        <Clock size={14} />
                                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button className="px-6 py-2.5 bg-maroon text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobseekerApplicationsView;
