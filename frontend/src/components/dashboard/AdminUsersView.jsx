import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../services/api';
import { Users, Search, Edit3, ShieldAlert, CheckCircle, Loader, Ban, Trash2 } from 'lucide-react';
import Badge from '../shared/Badge';

const AdminUsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else if (response.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.clear();
                window.location.href = '/admin/login';
            } else {
                setError(data.error || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to load user list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId, action, method = 'PUT') => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const confirmMsg = action === 'delete' ? 'Are you sure you want to PERMANENTLY delete this user?' :
            `Are you sure you want to ${action} this user?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            const endpoint = action === 'delete' ? `${BASE_URL}/admin/users/${userId}` : `${BASE_URL}/admin/users/${userId}/${action}`;
            const response = await fetch(endpoint, {
                method: action === 'delete' ? 'DELETE' : 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                if (action === 'delete') {
                    setUsers(users.filter(u => u.id !== userId));
                } else {
                    setUsers(users.map(u =>
                        u.id === userId ? { ...u, is_active: action === 'activate' } : u
                    ));
                }
            } else {
                const data = await response.json();
                alert(`Action failed: ${data.error}`);
            }
        } catch (err) {
            alert('Something went wrong. Please try again.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>User Management</h2>
                <div className="search-box-md">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="card mt-6 p-0 overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-12"><Loader className="animate-spin mx-auto" /></td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-12 text-muted">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td><strong>{user.username}</strong></td>
                                    <td>{user.email}</td>
                                    <td><Badge variant={user.user_type === 'employer' ? 'black' : 'maroon'}>{user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}</Badge></td>
                                    <td>
                                        <Badge variant={user.is_active ? 'success' : 'maroon'}>{user.is_active ? 'Active' : 'Deactivated'}</Badge>
                                    </td>
                                    <td>{user.created_at}</td>
                                    <td>
                                        <div className="table-actions">
                                            {user.is_active ? (
                                                <button
                                                    className="btn-table btn-decline"
                                                    onClick={() => handleAction(user.id, 'deactivate')}
                                                    title="Deactivate"
                                                >
                                                    <Ban size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-table btn-accept"
                                                    onClick={() => handleAction(user.id, 'activate')}
                                                    title="Activate"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button
                                                className="btn-table btn-danger"
                                                onClick={() => handleAction(user.id, 'delete')}
                                                title="Delete User"
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

export default AdminUsersView;
