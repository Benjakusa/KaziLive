import React, { useState } from 'react';
import { Mail, Lock, Building, Phone, MapPin, User, LogIn } from 'lucide-react';

export default function EmployerRegister() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Employer registration:', formData);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Employer Registration</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Building size={16} style={{ marginRight: '8px' }} />
                Company Name
              </label>
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
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: '8px' }} />
                Business Email
              </label>
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
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} style={{ marginRight: '8px' }} />
                Phone Number
              </label>
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
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} style={{ marginRight: '8px' }} />
                Company Location
              </label>
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
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: '8px' }} />
                Password
              </label>
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
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: '8px' }} />
                Confirm Password
              </label>
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
            <button type="submit" className="btn btn-primary btn-block">
              Register Company
            </button>
            <p className="text-center mt-4 text-muted">
              Already have an account? <a href="#/employer/login" style={{ color: 'var(--primary)' }}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Why Join KaziLive?</h3>
        </div>
        <div className="card-body">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>1</span>
              Access thousands of verified candidates
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>2</span>
              Post jobs and manage applications
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>3</span>
              Direct contact with job seekers
            </li>
            <li style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>4</span>
              Pay via M-Pesa - fast and secure
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}