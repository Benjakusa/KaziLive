import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Lock, Mail } from 'lucide-react';
import { loginSuccess } from '../../features/auth/authSlice';

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.user_type !== 'admin') {
        throw new Error('Access denied. Admin only.');
      }

      dispatch(loginSuccess({ user: data.user, token: data.access_token }));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <div className="card">
        <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center' }}>
          <Shield size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2>Admin Portal</h2>
          <p className="text-muted">Sign in to manage the platform</p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'var(--accent)', marginBottom: '16px', padding: '12px', background: 'rgba(128, 0, 0, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Admin Identifier</label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Email, Username, or Phone"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;