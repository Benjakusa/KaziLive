import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Building, Phone, MapPin, LogIn } from 'lucide-react';

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
            <button type="submit" className="btn btn-primary btn-block">
              Register Company
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