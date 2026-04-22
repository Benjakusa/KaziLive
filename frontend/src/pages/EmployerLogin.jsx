import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Lock, LogIn, User } from 'lucide-react';
import { login } from '../services/api';
import { loginSuccess } from '../features/auth/authSlice';



export default function EmployerLogin() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  useEffect(() => {
    if (user && user.role === 'employer') {
      navigate('/employer/dashboard');
    } else if (user && user.role === 'jobseeker') {
      navigate('/jobseeker/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);

      // Enforce role: check user_type from backend
      if (data.user?.user_type !== 'employer') {
        setError('This account is not an employer account. Please use the correct login page.');
        setLoading(false);
        return;
      }

      dispatch(loginSuccess({
        user: data.user,
        token: data.access_token
      }));
      // alert('Login successful!');
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-off-white p-6 animate-in fade-in duration-700">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Login Card */}
        <div className="glass-card p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-maroon/5 text-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-maroon/5 border border-maroon/10">
              <LogIn size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Employer Login</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Access your recruitment dashboard</p>
          </div>

          {error && (
            <div className="p-4 bg-danger/5 text-danger rounded-2xl border border-danger/10 flex items-center gap-3 text-sm font-medium mb-6 animate-in slide-in-from-top-2">
              <User size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username / Email / Phone</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  type="text"
                  name="identifier"
                  className="glass-input pl-12"
                  placeholder="companyuser or email"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  type="password"
                  name="password"
                  className="glass-input pl-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="glass-button w-full h-14 mt-4" disabled={loading}>
              {loading ? <Loader className="animate-spin mx-auto text-white" size={20} /> : 'Sign In'}
            </button>
            <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
              New to KaziLive? <Link to="/employer/register" className="text-maroon hover:underline">Register here</Link>
            </p>
          </form>
        </div>

        {/* Info Section */}
        <div className="hidden lg:block space-y-8 p-10 bg-black/5 rounded-[40px] border border-white/50 backdrop-blur-sm">
          <h3 className="text-3xl font-black text-gray-900 leading-tight">Elevate Your Hiring <br /><span className="text-maroon">Experience.</span></h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-white shadow-sm text-maroon"><LogIn size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Elite Talent Access</h4>
                <p className="text-sm text-gray-500 font-medium">Connect with verified Kenyan professionals across all industries.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-white shadow-sm text-maroon"><Lock size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Recruitment</h4>
                <p className="text-sm text-gray-500 font-medium">Manage job postings and applications in a secure environment.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-white shadow-sm text-emerald-500"><User size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Seamless Verification</h4>
                <p className="text-sm text-gray-500 font-medium">Verify profiles instantly through our integrated M-Pesa gateway.</p>
              </div>
            </li>
          </ul>
          <div className="pt-6 border-t border-black/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Trusted by 500+ businesses nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
