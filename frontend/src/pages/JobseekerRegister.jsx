import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, User, Briefcase, FileText, Upload, LogIn } from 'lucide-react';

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
                Full Name
              </label>
              <div className="input-icon-wrapper">
                <User size={18} />
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
            </div>
            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
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
            </div>
            <div className="form-group">
              <label className="form-label">
                Phone (M-Pesa)
              </label>
              <div className="input-icon-wrapper">
                <Phone size={18} />
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
            </div>
            <div className="form-group">
              <label className="form-label">
                Location
              </label>
              <div className="input-icon-wrapper">
                <MapPin size={18} />
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
            </div>
            <div className="form-group">
              <label className="form-label">
                Job Category
              </label>
              <div className="input-icon-wrapper">
                <Briefcase size={18} />
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
            </div>
            <div className="form-group">
              <label className="form-label">
                Skills
              </label>
              <div className="input-icon-wrapper">
                <FileText size={18} />
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="React, Python, SQL..."
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Expected Salary (KSh)
              </label>
              <div className="input-icon-wrapper">
                <FileText size={18} />
                <input
                  type="text"
                  name="expectedSalary"
                  className="form-input"
                  placeholder="80,000"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Upload CV
              </label>
              <div className="upload-dropzone">
                <Upload size={32} />
                <p>Drag and drop your CV here, or click to browse</p>
                <p className="text-muted small">PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Create Profile
            </button>
            <p className="text-center mt-4 text-muted">
              Already have an account? <Link to="/jobseeker/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Why Register?</h3>
        </div>
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1</span>
              Free profile creation
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2</span>
              Get verified and stand out
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>3</span>
              Let employers find you
            </li>
            <li className="py-3 flex-center-gap">
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>4</span>
              Direct job opportunities
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}