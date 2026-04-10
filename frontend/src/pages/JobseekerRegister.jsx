import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, Briefcase, FileText, Upload, Save, LogIn } from 'lucide-react';

export default function JobseekerRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobCategory: '',
    skills: '',
    expectedSalary: '',
    cv: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Jobseeker registration:', formData);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Jobseeker Registration</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: '8px' }} />
                Full Name
              </label>
              <input 
                type="text" 
                name="fullName"
                className="form-input" 
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: '8px' }} />
                Email
              </label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="john@email.co.ke"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} style={{ marginRight: '8px' }} />
                Phone (M-Pesa)
              </label>
              <input 
                type="tel" 
                name="phone"
                className="form-input" 
                placeholder="0712 345 678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} style={{ marginRight: '8px' }} />
                Location
              </label>
              <input 
                type="text" 
                name="location"
                className="form-input" 
                placeholder="Westlands, Nairobi"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Briefcase size={16} style={{ marginRight: '8px' }} />
                Job Category
              </label>
              <select 
                name="jobCategory"
                className="form-input"
                value={formData.jobCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} style={{ marginRight: '8px' }} />
                Skills
              </label>
              <input 
                type="text" 
                name="skills"
                className="form-input" 
                placeholder="React, Python, SQL..."
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} style={{ marginRight: '8px' }} />
                Expected Salary (KSh)
              </label>
              <input 
                type="text" 
                name="expectedSalary"
                className="form-input" 
                placeholder="80,000"
                value={formData.expectedSalary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Upload size={16} style={{ marginRight: '8px' }} />
                Upload CV
              </label>
              <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
                <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '10px' }} />
                <p>Drag and drop your CV here, or click to browse</p>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Create Profile
            </button>
            <p className="text-center mt-4 text-muted">
              Already have an account? <a href="#/jobseeker/login" style={{ color: 'var(--primary)' }}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Why Register?</h3>
        </div>
        <div className="card-body">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>1</span>
              Free profile creation
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>2</span>
              Get verified and stand out
            </li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>3</span>
              Let employers find you
            </li>
            <li style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)' }}>4</span>
              Direct job opportunities
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}