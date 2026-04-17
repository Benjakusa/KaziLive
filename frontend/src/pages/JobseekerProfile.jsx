import React, { useRef, useState, useEffect } from 'react';
import { User, Briefcase, Mail, Phone, MapPin, FileText, Upload, Save, X, CheckCircle, Camera } from 'lucide-react';
import { uploadFile, updateProfile, BASE_URL } from '../services/api';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export default function JobseekerProfile() {
  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [cvError, setCvError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileUploading, setProfileUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    expectedSalary: '',
    yearsOfExperience: '',
    bio: '',
    jobCategory: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/jobseeker/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          skills: data.skills ? data.skills.join(', ') : '',
          expectedSalary: data.expected_salary || '',
          yearsOfExperience: data.years_of_experience || '',
          bio: data.bio || '',
          jobCategory: data.job_category || ''
        });
        if (data.profile_picture) {
          setProfilePreview(data.profile_picture);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveSuccess(false);
  };

  function validateAndSet(file) {
    setCvError('');
    setUploadSuccess(false);
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setCvError('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setCvError('File must be 5 MB or smaller.');
      return;
    }
    setCvFile(file);
  }

  function handleDropzoneClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    validateAndSet(e.target.files[0]);
    e.target.value = '';
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  }

  function handleRemove(e) {
    e.stopPropagation();
    setCvFile(null);
    setCvError('');
    setUploadSuccess(false);
  }

  async function handleUpload(e) {
    e.stopPropagation();
    if (!cvFile) return;
    setUploading(true);
    try {
      await uploadFile(cvFile, 'cv');
      setUploadSuccess(true);
    } catch {
      setCvError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
        alert('Only JPEG, PNG, JPG, or GIF images are allowed.');
        return;
      }
      if (file.size > IMAGE_MAX_SIZE) {
        alert('Image too large. Max 2MB allowed.');
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleProfileUpload = async () => {
    if (!profilePicture) return;
    setProfileUploading(true);
    try {
      const result = await uploadFile(profilePicture, 'profile_picture');
      if (result.file && result.file.url) {
        setProfilePreview(result.file.url);
      }
      setProfilePicture(null);
    } catch (err) {
      alert('Failed to upload profile picture');
    } finally {
      setProfileUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      await updateProfile('jobseeker', {
        full_name: formData.fullName,
        location: formData.location,
        job_category: formData.jobCategory,
        skills: skills,
        expected_salary: formData.expectedSalary ? parseInt(formData.expectedSalary) : null,
        years_of_experience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
        bio: formData.bio
      }, token);
      setSaveSuccess(true);
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <User size={24} />
        <h2>My Profile</h2>
      </div>
      <div className="card-body">
        <div className="flex-center-gap" style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <div
              className="avatar"
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2rem',
                background: profilePreview ? `url(${profilePreview}) center/cover` : '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
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
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={14} color="white" />
            </label>
            <input
              ref={profileInputRef}
              type="file"
              id="profile-picture"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
          </div>
          <div>
            <h3 style={{ marginBottom: '4px' }}>{formData.fullName || 'Job Seeker'}</h3>
            <p className="text-muted">Update your profile to get noticed</p>
            {profilePicture && (
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.8rem', marginTop: '8px' }}
                onClick={handleProfileUpload}
                disabled={profileUploading}
              >
                {profileUploading ? 'Uploading...' : 'Save Photo'}
              </button>
            )}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={18} />
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Njeri Muthoni"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="njeri@email.co.ke"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone (M-Pesa)</label>
            <div className="input-icon-wrapper">
              <Phone size={18} />
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="0712 345 678"
                value={formData.phone}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div className="input-icon-wrapper">
              <MapPin size={18} />
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="Westlands, Nairobi"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Job Category</label>
            <div className="input-icon-wrapper">
              <Briefcase size={18} />
              <select
                name="jobCategory"
                className="form-input"
                value={formData.jobCategory}
                onChange={handleChange}
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
            <label className="form-label">Expected Salary (KSh)</label>
            <div className="input-icon-wrapper">
              <FileText size={18} />
              <input
                type="number"
                name="expectedSalary"
                className="form-input"
                placeholder="120,000"
                value={formData.expectedSalary}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <div className="input-icon-wrapper">
              <Briefcase size={18} />
              <input
                type="number"
                name="yearsOfExperience"
                className="form-input"
                placeholder="2"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Bio / About</label>
          <textarea
            name="bio"
            className="form-input"
            placeholder="Tell employers about yourself..."
            rows={3}
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Skills</label>
          <div className="input-icon-wrapper">
            <Briefcase size={18} />
            <input
              type="text"
              name="skills"
              className="form-input"
              placeholder="React, Python, SQL, Django..."
              value={formData.skills}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Upload CV</label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div
            className={`upload-dropzone${dragOver ? ' drag-active' : ''}`}
            onClick={handleDropzoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ cursor: 'pointer' }}
          >
            {cvFile ? (
              <>
                {uploadSuccess
                  ? <CheckCircle size={32} color="var(--color-success, #22c55e)" />
                  : <FileText size={32} />}
                <p style={{ fontWeight: 600 }}>{cvFile.name}</p>
                <p className="text-muted small">
                  {(cvFile.size / 1024).toFixed(1)} KB
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }} onClick={e => e.stopPropagation()}>
                  {!uploadSuccess && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading…' : 'Upload'}
                    </button>
                  )}
                  <button
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={handleRemove}
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
                {uploadSuccess && <p style={{ color: 'var(--color-success, #22c55e)', marginTop: '4px' }}>CV uploaded successfully!</p>}
              </>
            ) : (
              <>
                <Upload size={32} />
                <p>Drag and drop your CV here, or click to browse</p>
                <p className="text-muted small">PDF, DOC, DOCX up to 5MB</p>
              </>
            )}
          </div>

          {cvError && <p style={{ color: 'var(--color-danger, #ef4444)', marginTop: '6px', fontSize: '0.85rem' }}>{cvError}</p>}
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {saveSuccess && <span style={{ marginLeft: '12px', color: '#22c55e' }}>Profile saved!</span>}
      </div>
    </div>
  );
}