import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function EmployerLogin() {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Employer Login</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
                <input type="email" className="form-input" placeholder="hr@company.co.ke" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input type="password" className="form-input" placeholder="Enter your password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
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
