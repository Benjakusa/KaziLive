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
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Employer Login</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username / Email / Phone</label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  type="text"
                  name="identifier"
                  className="form-input"
                  placeholder="companyuser or email"
                  value={formData.identifier}
                  onChange={handleChange}
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
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="text-center mt-4 text-muted">
              Don't have an account? <Link to="/employer/register" style={{ color: 'var(--primary)' }}>Register here</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Why Join KaziLive?</h3>
        </div>
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b">
              Access thousands of qualified Kenyan candidates
            </li>
            <li className="py-3 divider-b">
              Post jobs and manage applications
            </li>
            <li className="py-3">
              Pay via M-Pesa - fast and secure
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
