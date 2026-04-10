import React from 'react';
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
                <User size={16} style={{ marginRight: '8px' }} />
                Username / Email / Phone
              </label>
              <input type="text" className="form-input" placeholder="0712 345 678 or email" />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: '8px' }} />
                Password
              </label>
              <input type="password" className="form-input" placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
            <p className="text-center mt-4 text-muted">
              Hujajisajili? <a href="#" style={{ color: 'var(--primary)' }}>Jisajili hapa</a>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Pata Kazi Haraka</h3>
        </div>
        <div className="card-body">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>1</span>
              Create your professional profile
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>2</span>
              Upload your CV
            </li>
            <li style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>3</span>
              Apply to jobs and get hired
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
