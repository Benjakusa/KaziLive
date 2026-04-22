import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Lock, Mail, Loader, AlertCircle } from 'lucide-react';
import { loginSuccess } from '../../features/auth/authSlice';
import { login } from '../../services/api';

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
      const data = await login(formData);

      if (data.user?.user_type !== 'admin') {
        throw new Error('Access denied. This portal is restricted to system administrators.');
      }

      dispatch(loginSuccess({ user: data.user, token: data.access_token }));
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <Shield size={24} />
          <h2>Admin Console</h2>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email or ID</label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="admin@kazilive.com"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Secure Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Establishing Session..." : "Sign In to Console"}
            </button>

            <p className="text-center mt-4 text-muted">
              <Link to="/" style={{ color: "var(--primary)" }}>
                &larr; Exit to Public Site
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Secure Access</h3>
        </div>

        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>1</span>
              Authorized Personnel Only
            </li>

            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>2</span>
              All sessions are logged and monitored
            </li>

            <li className="py-3 flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>3</span>
              Please sign out when finished
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;