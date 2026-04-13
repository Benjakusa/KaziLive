import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, Phone, MapPin, LogIn, User } from 'lucide-react';
import { register } from '../services/api';

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        phone: formData.phone,
        password: formData.password,
        user_type: 'employer',
        company_name: formData.companyName,
        location: formData.location
      });
      alert('Registration successful! Please login.');
      navigate('/employer/login');
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
          <h2>Employer Registration</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Company Name
              </label>
              <div className="input-icon-wrapper">
                <Building size={18} />
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="Your Company Ltd"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Username
              </label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="companyuser"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Business Email
              </label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="hr@company.co.ke"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Phone Number
              </label>
              <div className="input-icon-wrapper">
                <Phone size={18} />
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="0722 000 000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Company Location
              </label>
              <div className="input-icon-wrapper">
                <MapPin size={18} />
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="Nairobi, Kenya"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Registering...' : 'Register Company'}
            </button>
            <p className="text-center mt-4 text-muted">
              Already have an account? <Link to="/employer/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
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
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1</span>
              Access thousands of verified candidates
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2</span>
              Post jobs and manage applications
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>3</span>
              Direct contact with job seekers
            </li>
            <li className="py-3 flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>4</span>
              Pay via M-Pesa - fast and secure
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}