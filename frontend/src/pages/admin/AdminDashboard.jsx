import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Users, FileText, BarChart3, Settings, LogOut, Check, X, Eye } from 'lucide-react';
import { loginSuccess } from '../../features/auth/authSlice';

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, jobseekers: 0, employers: 0, pendingDocs: 0 });

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const usersRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

      const docsRes = await fetch('/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const docsData = await docsRes.json();
      setDocuments(docsData.filter(d => !d.is_approved));

      setStats({
        totalUsers: usersData.length,
        jobseekers: usersData.filter(u => u.user_type === 'jobseeker').length,
        employers: usersData.filter(u => u.user_type === 'employer').length,
        pendingDocs: docsData.filter(d => !d.is_approved).length
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  useEffect(() => {
    if (user?.user_type === 'admin') fetchData();
  }, [user]);

  const handleApproveDocument = async (docId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/documents/${docId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDocuments(documents.filter(d => d.id !== docId));
        setStats({ ...stats, pendingDocs: stats.pendingDocs - 1 });
      }
    } catch (error) {
      console.error('Failed to approve document:', error);
    }
  };

  const handleDeactivateUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: false } : u));
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleLogout = () => {
    dispatch(loginSuccess({ user: null, token: null }));
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Shield size={24} />
          <span>Admin Portal</span>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        {activeTab === 'overview' && (
          <div className="admin-overview">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <Users size={32} />
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{stats.jobseekers}</h3>
                  <p>Jobseekers</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{stats.employers}</h3>
                  <p>Employers</p>
                </div>
              </div>
              <div className="stat-card">
                <FileText size={32} />
                <div className="stat-info">
                  <h3>{stats.pendingDocs}</h3>
                  <p>Pending Documents</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users">
            <h2>User Management</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.user_type}`}>{u.user_type}</span></td>
                      <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button className="btn-icon" title="View">
                          <Eye size={16} />
                        </button>
                        {u.is_active && (
                          <button className="btn-icon danger" title="Deactivate" onClick={() => handleDeactivateUser(u.id)}>
                            <X size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="admin-documents">
            <h2>Document Approvals</h2>
            {documents.length === 0 ? (
              <p className="empty-state">No pending documents</p>
            ) : (
              <div className="documents-list">
                {documents.map(doc => (
                  <div key={doc.id} className="document-card">
                    <FileText size={24} />
                    <div className="document-info">
                      <h4>{doc.filename}</h4>
                      <p>User ID: {doc.user_id}</p>
                      <p>Uploaded: {doc.uploaded_at}</p>
                    </div>
                    <div className="document-actions">
                      <button className="btn-approve" onClick={() => handleApproveDocument(doc.id)}>
                        <Check size={16} />
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h2>Admin Settings</h2>
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>Platform Name</label>
                <input type="text" defaultValue="KaziLive" disabled />
              </div>
              <div className="setting-item">
                <label>Admin Email</label>
                <input type="email" defaultValue={user?.email || 'admin@kazilive.com'} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;