import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Briefcase, Mail, Phone, MapPin, Building, FileText, Download, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import defaultAvatar from '../assets/default-avatar.png';

export default function EmployerProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/employer/login');
      return;
    }
    fetchProfile();
  }, [id, token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/employer/jobseekers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 402) {
        setError('Payment required to view candidate details. Please complete payment to get verified.');
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/employer/login');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-error mb-4">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/employer/dashboard')}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-4">
        <p>Profile not found</p>
        <button className="btn btn-secondary" onClick={() => navigate('/employer/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-4" onClick={() => navigate('/employer/dashboard')}>
        <ArrowLeft size={18} /> Back to Search
      </button>

      <div className="grid-2">
        <div className="card">
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                className="avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--primary)'
                }}
              >
                <img
                  src={profile.profile_picture || defaultAvatar}
                  alt={profile.full_name}
                  className="avatar-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ marginBottom: '8px' }}>{profile.full_name || 'No name set'}</h2>
              <p className="text-muted" style={{ marginBottom: '12px' }}>{profile.job_category || 'No category'}</p>

              {profile.profile_verified ? (
                <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <CheckCircle size={16} /> Verified Profile
                </span>
              ) : (
                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Clock size={16} /> Pending Verification
                </span>
              )}
            </div>

            <div className="divider-b py-3">
              <div className="flex items-center gap-3">
                <Mail size={18} color="var(--primary)" />
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>Email</label>
                  <p style={{ margin: 0 }}>{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="divider-b py-3">
              <div className="flex items-center gap-3">
                <Phone size={18} color="var(--primary)" />
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>Phone</label>
                  <p style={{ margin: 0 }}>{profile.phone}</p>
                </div>
              </div>
            </div>

            <div className="divider-b py-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} color="var(--primary)" />
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>Location</label>
                  <p style={{ margin: 0 }}>{profile.location || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="py-3">
              <div className="flex items-center gap-3">
                <Briefcase size={18} color="var(--primary)" />
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>Availability</label>
                  <p style={{ margin: 0, textTransform: 'capitalize' }}>{profile.availability_status || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {profile.bio && (
            <div className="card mb-4">
              <div className="card-header">
                <User size={20} />
                <h3>About</h3>
              </div>
              <div className="card-body">
                <p>{profile.bio}</p>
              </div>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header">
              <Briefcase size={20} />
              <h3>Qualifications</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Job Category</label>
                <p>{profile.job_category || 'Not specified'}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Salary</label>
                <p>{profile.expected_salary ? `KSh ${profile.expected_salary.toLocaleString()}` : 'Not specified'}</p>
              </div>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <User size={20} />
                <h3>Skills</h3>
              </div>
              <div className="card-body">
                <div className="flex gap-2 flex-wrap">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        fontSize: '0.9rem'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {profile.documents && profile.documents.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <FileText size={20} />
                <h3>Documents</h3>
              </div>
              <div className="card-body">
                {profile.documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center py-2 divider-b">
                    <div className="flex items-center gap-3">
                      <FileText size={18} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 500 }}>{doc.file_name}</p>
                        <p className="text-muted small" style={{ margin: 0 }}>{doc.file_type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={16} /> View/Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!profile.documents || profile.documents.length === 0) && (
            <div className="card mb-4">
              <div className="card-header">
                <FileText size={20} />
                <h3>Documents</h3>
              </div>
              <div className="card-body">
                <p className="text-muted">No documents uploaded yet.</p>
              </div>
            </div>
          )}

          <a
            href={`tel:${profile.phone}`}
            className="btn btn-primary btn-block text-center"
            style={{ display: 'block' }}
          >
            <Phone size={18} style={{ marginRight: '8px' }} />
            Call Jobseeker
          </a>
        </div>
      </div>
    </div>
  );
}