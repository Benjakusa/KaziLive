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
    <div className="flex items-center justify-center min-h-screen bg-off-white p-6 animate-in fade-in duration-700">
      <div className="glass-card max-w-md w-full p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-maroon/5 text-maroon rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-maroon/5 border border-maroon/10">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Admin Console</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-danger/5 text-danger rounded-2xl border border-danger/10 flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Admin Email or ID</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
              <input
                type="text"
                className="glass-input pl-12"
                placeholder="admin@kazilive.com"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secure Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
              <input
                type="password"
                className="glass-input pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="glass-button w-full h-14 mt-4"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Establish Secure Session'}
          </button>
        </form>

        <div className="text-center mt-10">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-maroon transition-colors">
            &larr; Exit to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;