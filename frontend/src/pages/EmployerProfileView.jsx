import React from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Building } from 'lucide-react';

export default function EmployerProfileView() {
  return (
    <div className="card">
      <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem', margin: '0 auto 20px' }}>EP</div>
        <h2>Employer Profile</h2>
        <p className="text-muted">Manage your company profile</p>
        
        <div className="grid-2 mt-4">
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">
              <Building size={16} style={{ marginRight: '8px' }} />
              Company Name
            </label>
            <input type="text" className="form-input" placeholder="Safaricom Ltd" />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '8px' }} />
              Email
            </label>
            <input type="email" className="form-input" placeholder="hr@safaricom.co.ke" />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">
              <Phone size={16} style={{ marginRight: '8px' }} />
              Phone
            </label>
            <input type="tel" className="form-input" placeholder="0722 100 100" />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">
              <MapPin size={16} style={{ marginRight: '8px' }} />
              Location
            </label>
            <input type="text" className="form-input" placeholder="Nairobi, Kenya" />
          </div>
        </div>
        
        <button className="btn btn-primary">Update Profile</button>
      </div>
    </div>
  );
}
