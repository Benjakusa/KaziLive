import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, User, Briefcase, FileText, Upload, LogIn, Lock, Camera } from 'lucide-react';
import { register } from '../services/api';

export default function JobseekerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    location: '',
    jobCategory: '',
    skills: '',
    expectedSalary: '',
    password: '',
    confirmPassword: '',
    cv: null,
    profilePicture: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setFormData({ ...formData, profilePicture: file });
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Image too large. Max 2MB allowed.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        phone: formData.phone,
        password: formData.password,
        user_type: 'jobseeker',
        full_name: formData.fullName,
        location: formData.location,
        job_category: formData.jobCategory,
        skills: formData.skills,
        expected_salary: formData.expectedSalary
      });
      alert('Registration successful! Please login.');
      navigate('/jobseeker/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Jobseeker Registration</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <label className="form-label">Profile Picture</label>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: profilePreview ? `url(${profilePreview}) center/cover` : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    border: '2px solid var(--primary)'
                  }}
                >
                  {!profilePreview && <User size={40} color="#9ca3af" />}
                </div>
                <label
                  htmlFor="profile-picture"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Camera size={16} color="white" />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureChange}
                />
              </div>
              <p className="text-muted small" style={{ marginTop: '8px' }}>Optional - Max 2MB</p>
            </div>
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
                Username
              </label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="johndoe"
                  value={formData.username}
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
              <input
                type="file"
                id="cv-upload"
                name="cv"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size <= 5 * 1024 * 1024) {
                    setFormData({ ...formData, cv: file });
                  } else if (file) {
                    alert('File too large. Max 5MB allowed.');
                  }
                }}
              />
              <div
                className={`upload-dropzone ${formData.cv ? 'has-file' : ''}`}
                onClick={() => document.getElementById('cv-upload').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-active');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-active');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-active');
                  const file = e.dataTransfer.files[0];
                  if (file && file.size <= 5 * 1024 * 1024) {
                    setFormData({ ...formData, cv: file });
                  } else if (file) {
                    alert('File too large. Max 5MB allowed.');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {formData.cv ? (
                  <>
                    <FileText size={32} color="var(--primary)" />
                    <p style={{ fontWeight: 600 }}>{formData.cv.name}</p>
                    <p className="text-muted small">{(formData.cv.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginTop: '8px', padding: '4px 12px', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, cv: null });
                      }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={32} />
                    <p>Drag and drop your CV here, or click to browse</p>
                    <p className="text-muted small">PDF, DOC, DOCX up to 5MB</p>
                  </>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
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