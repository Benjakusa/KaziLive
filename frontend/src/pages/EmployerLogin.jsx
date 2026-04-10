import React from 'react';
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
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="email" className="form-input" placeholder="hr@company.co.ke" style={{ paddingLeft: '40px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="password" className="form-input" placeholder="Enter your password" style={{ paddingLeft: '40px' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
            <p className="text-center mt-4 text-muted">
              Don't have an account? <a href="#/employer/register" style={{ color: 'var(--primary)' }}>Register here</a>
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
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              Access thousands of qualified Kenyan candidates
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              Post jobs and manage applications
            </li>
            <li style={{ padding: '12px 0' }}>
              Pay via M-Pesa - fast and secure
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
