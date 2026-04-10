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
        <div className="flex-center-gap" style={{ marginBottom: '32px' }}>
          <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>NM</div>
          <div>
            <h3 style={{ marginBottom: '4px' }}>Job Seeker</h3>
            <p className="text-muted">Update your profile to get noticed</p>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={18} />
              <input type="text" className="form-input" placeholder="Njeri Muthoni" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={18} />
              <input type="email" className="form-input" placeholder="njeri@email.co.ke" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone (M-Pesa)</label>
            <div className="input-icon-wrapper">
              <Phone size={18} />
              <input type="tel" className="form-input" placeholder="0712 345 678" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div className="input-icon-wrapper">
              <MapPin size={18} />
              <input type="text" className="form-input" placeholder="Westlands, Nairobi" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Skills</label>
          <div className="input-icon-wrapper">
            <Briefcase size={18} />
            <input type="text" className="form-input" placeholder="React, Python, SQL, Django..." />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Expected Salary (KSh)</label>
          <div className="input-icon-wrapper">
            <FileText size={18} />
            <input type="text" className="form-input" placeholder="120,000" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Upload CV</label>
          <div className="upload-dropzone">
            <Upload size={32} />
            <p>Drag and drop your CV here, or click to browse</p>
            <p className="text-muted small">PDF, DOC, DOCX up to 5MB</p>
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
