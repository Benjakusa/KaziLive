import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../services/api';
import { User, Mail, Phone, MapPin, Briefcase, Plus, X, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../assets/default-avatar.png';

const JobseekerProfileView = ({ user: initialUser }) => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [profile, setProfile] = useState({
        name: initialUser?.name || initialUser?.full_name || '',
        email: initialUser?.email || '',
        phone: initialUser?.phone || '',
        location: initialUser?.location || '',
        role: initialUser?.job_category || '',
        about: initialUser?.bio || '',
        skills: initialUser?.skills || [],
        profile_pic: initialUser?.profile_picture || defaultAvatar
    });

    useEffect(() => {
        if (initialUser) {
            setProfile({
                name: initialUser.name || initialUser.full_name || '',
                email: initialUser.email || '',
                phone: initialUser.phone || '',
                location: initialUser.location || '',
                role: initialUser.job_category || '',
                about: initialUser.bio || '',
                skills: initialUser.skills || [],
                profile_pic: initialUser.profile_picture || defaultAvatar
            });
            setAvatarPreview(initialUser.profile_picture || defaultAvatar);
        }
    }, [initialUser]);

    const [avatarPreview, setAvatarPreview] = useState(profile.profile_pic);
    const [newSkill, setNewSkill] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${BASE_URL}/jobseeker/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    location: profile.location,
                    job_category: profile.role,
                    bio: profile.about,
                    skills: profile.skills
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
            }
        } catch (err) {
            setMessage('Failed to save profile changes. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);

            // Upload to backend
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_type', 'profile_picture');

            try {
                const response = await fetch(`${BASE_URL}/jobseeker/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (response.ok) {
                    setMessage('Profile picture uploaded!');
                }
            } catch (err) {
                console.error('Avatar upload failed', err);
            }
        }
    };

    const addSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    };

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>My Professional Profile</h2>
                <button className="btn-maroon" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div className={`alert mt-4 ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <div className="card mt-6">
                <div className="profile-upload-section mb-6">
                    <div className="avatar-preview-wrapper" onClick={() => document.getElementById('avatar-input').click()}>
                        <img src={avatarPreview || defaultAvatar} alt="Avatar" />
                        <div className="avatar-overlay">
                            <span>Change</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        id="avatar-input"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    <div className="upload-info">
                        <h4>Profile Picture</h4>
                        <p className="text-muted small">PNG, JPG or GIF. Max 2MB.</p>
                    </div>
                </div>

                <div className="grid-2-col">
                    <div className="form-group">
                        <label><User size={14} /> Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label><Mail size={14} /> Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={profile.email}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label><Phone size={14} /> Phone Number</label>
                        <input
                            type="text"
                            className="form-input"
                            value={profile.phone}
                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label><MapPin size={14} /> Location</label>
                        <input
                            type="text"
                            className="form-input"
                            value={profile.location}
                            onChange={e => setProfile({ ...profile, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group mt-4">
                    <label><Briefcase size={14} /> Professional Role</label>
                    <input
                        type="text"
                        className="form-input"
                        value={profile.role}
                        onChange={e => setProfile({ ...profile, role: e.target.value })}
                    />
                </div>

                <div className="form-group mt-4">
                    <label>Bio / Summary</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        value={profile.about}
                        onChange={e => setProfile({ ...profile, about: e.target.value })}
                    ></textarea>
                </div>
            </div>

            <div className="card mt-6">
                <h3>Skills & Expertise</h3>
                <div className="skills-entry-area mt-4">
                    <div className="input-with-button">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Add a skill (e.g. Python)"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && addSkill()}
                        />
                        <button className="btn-icon-maroon" onClick={addSkill}><Plus size={20} /></button>
                    </div>
                    <div className="tag-cloud mt-4">
                        {profile.skills.map(skill => (
                            <span key={skill} className="skill-edit-tag">
                                {skill}
                                <button onClick={() => removeSkill(skill)}><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobseekerProfileView;
