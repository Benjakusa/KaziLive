import React, { useState, useEffect } from 'react';
import { getEmployerContacts } from '../../services/api';
import { Briefcase, Plus, Users, Eye, Edit3, Trash2, Loader, MessageSquare, Clock } from 'lucide-react';
import Badge from '../shared/Badge';

const EmployerJobsView = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getEmployerContacts();
            setContacts(data);
        } catch (err) {
            console.error("FETCH EMPLOYER CONTACTS ERROR:", err);
            setError(err.message || 'Failed to load contact history.');
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
                    <h2 className="text-2xl font-bold">Inquiry History</h2>
                    <p className="text-gray-500 text-sm">Review the candidates you have contacted</p>
                </div>
                <div className="px-4 py-2 bg-maroon/5 text-maroon rounded-xl text-xs font-black uppercase tracking-widest">
                    {contacts.length} Sent
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-6 border border-red-100">{error}</div>}

            <div className="glass-card mt-8 p-0 overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Talent</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Message Preview</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sent On</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading ? (
                            <tr><td colSpan="5" className="p-20 text-center"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                        ) : contacts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                            <MessageSquare size={32} />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-gray-900">No Sent Requests</h4>
                                            <p className="text-sm text-gray-400 max-w-xs">Start browsing and contacting top talent to see your history here.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            contacts.map(contact => (
                                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner font-bold text-gray-400">
                                                {contact.jobseeker_picture ? (
                                                    <img src={contact.jobseeker_picture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    (contact.jobseeker_name || 'T').charAt(0)
                                                )}
                                            </div>
                                            <span className="font-bold text-gray-900">{contact.jobseeker_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="success">
                                            <div className="flex items-center gap-1.5 capitalize">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {contact.status || 'Sent'}
                                            </div>
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate italic">"{contact.message}"</td>
                                    <td className="p-4 text-sm text-gray-500 font-medium">
                                        {new Date(contact.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <button className="glass-button p-2" title="View Details">
                                            <Eye size={18} />
                                        </button>
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
