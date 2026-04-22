import React, { useState, useEffect } from 'react';
import { adminListUsers, adminDeactivateUser, adminActivateUser, adminDeleteUser } from '../../services/api';
import { Users, Search, Edit3, ShieldAlert, CheckCircle, Loader, Ban, Trash2 } from 'lucide-react';
import Badge from '../shared/Badge';

const AdminUsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminListUsers();
            setUsers(data);
        } catch (err) {
            console.error("ADMIN FETCH USERS ERROR:", err);
            setError(err.message || 'Failed to load user list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId, action) => {
        const confirmMsg = action === 'delete' ? 'Are you sure you want to PERMANENTLY delete this user?' :
            `Are you sure you want to ${action} this user?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            if (action === 'delete') {
                await adminDeleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } else if (action === 'deactivate') {
                await adminDeactivateUser(userId);
                setUsers(users.map(u => u.id === userId ? { ...u, is_active: false } : u));
            } else if (action === 'activate') {
                await adminActivateUser(userId);
                setUsers(users.map(u => u.id === userId ? { ...u, is_active: true } : u));
            }
        } catch (err) {
            alert(`Action failed: ${err.message}`);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-content-area animate-in fade-in duration-500">
            <div className="section-header-flex">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-gray-500 text-sm">Control platform access and manage user status</p>
                </div>
                <div className="relative min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="glass-input pl-10 h-11"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-6 border border-red-100">{error}</div>}

            <div className="glass-card mt-8 p-0 overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Name</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Email</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Joined</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-20"><Loader className="animate-spin mx-auto text-maroon" /></td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-20 text-gray-400 font-medium italic">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4"><span className="font-bold text-gray-900">{user.username}</span></td>
                                    <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <Badge variant={user.user_type === 'employer' ? 'black' : 'maroon'}>
                                            {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={user.is_active ? 'success' : 'yellow'}>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-success' : 'bg-yellow-500'}`} />
                                                {user.is_active ? 'Active' : 'Deactivated'}
                                            </div>
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-medium">{user.created_at}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {user.is_active ? (
                                                <button
                                                    className="glass-button black p-2"
                                                    onClick={() => handleAction(user.id, 'deactivate')}
                                                    title="Deactivate"
                                                >
                                                    <Ban size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="glass-button p-2"
                                                    onClick={() => handleAction(user.id, 'activate')}
                                                    title="Activate"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                className="glass-button black p-2 hover:!bg-red-600"
                                                onClick={() => handleAction(user.id, 'delete')}
                                                title="Delete User"
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

export default AdminUsersView;
