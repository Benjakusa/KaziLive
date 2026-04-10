import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, User } from 'lucide-react';

export default function JobseekerLogin() {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Jobseeker Login</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label className="form-label">
                Username / Email / Phone
              </label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input type="text" className="form-input" placeholder="0712 345 678 or email" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input type="password" className="form-input" placeholder="Enter your password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
            <p className="text-center mt-4 text-muted">
              Don't have an account? <Link to="/jobseeker/register" style={{ color: 'var(--primary)' }}>Register here</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Find Jobs Quickly</h3>
        </div>
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1</span>
              Create your professional profile
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2</span>
              Upload your CV
            </li>
            <li className="py-3 flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>3</span>
              Apply to jobs and get hired
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
