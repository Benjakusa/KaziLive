import React from 'react';
import { User, Briefcase, Mail, Phone, MapPin, FileText, Upload, Save } from 'lucide-react';

export default function JobseekerProfile() {
  return (
    <div className="card">
      <div className="card-header">
        <User size={24} />
        <h2>My Profile</h2>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>NM</div>
          <div>
            <h3 style={{ marginBottom: '4px' }}>Job Seeker</h3>
            <p className="text-muted">Update your profile to get noticed</p>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ marginRight: '8px' }} />
              Full Name
            </label>
            <input type="text" className="form-input" placeholder="Njeri Muthoni" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '8px' }} />
              Email
            </label>
            <input type="email" className="form-input" placeholder="njeri@email.co.ke" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Phone size={16} style={{ marginRight: '8px' }} />
              Phone (M-Pesa)
            </label>
            <input type="tel" className="form-input" placeholder="0712 345 678" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} style={{ marginRight: '8px' }} />
              Location
            </label>
            <input type="text" className="form-input" placeholder="Westlands, Nairobi" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Briefcase size={16} style={{ marginRight: '8px' }} />
            Skills
          </label>
          <input type="text" className="form-input" placeholder="React, Python, SQL, Django..." />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={16} style={{ marginRight: '8px' }} />
            Expected Salary (KSh)
          </label>
          <input type="text" className="form-input" placeholder="120,000" />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={16} style={{ marginRight: '8px' }} />
            Upload CV
          </label>
          <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
            <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '10px' }} />
            <p>Drag and drop your CV here, or click to browse</p>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>PDF, DOC, DOCX up to 5MB</p>
          </div>
        </div>

        <button className="btn btn-primary">
          <Save size={18} />
          Save Profile
        </button>
      </div>
    </div>
  );
}
