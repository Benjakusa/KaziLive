import React from 'react';
import { Settings, Lock, Bell, Eye, EyeOff, Shield } from 'lucide-react';

const JobseekerSettingsView = () => {
    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await fetch('/api/jobseeker/profile', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                if (response.ok) {
                    alert('Your account has been permanently deleted.');
                    localStorage.clear();
                    window.location.href = '/jobseeker/login';
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to delete account');
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Account Settings</h2>
            </div>

            <div className="card mt-6">
                <div className="settings-section">
                    <div className="settings-header">
                        <Lock size={18} />
                        <h4>Security</h4>
                    </div>
                    <div className="settings-options mt-4">
                        <div className="settings-row">
                            <div className="row-info">
                                <p className="row-title">Password</p>
                                <p className="row-desc">Last changed 3 months ago</p>
                            </div>
                            <button className="btn-outline-maroon btn-sm">Change</button>
                        </div>
                        <div className="settings-row mt-4">
                            <div className="row-info">
                                <p className="row-title">Two-Factor Authentication</p>
                                <p className="row-desc">Secure your account with 2FA</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-section">
                    <div className="settings-header">
                        <Eye size={18} />
                        <h4>Privacy & Visibility</h4>
                    </div>
                    <div className="settings-options mt-4">
                        <div className="settings-row">
                            <div className="row-info">
                                <p className="row-title">Profile Visibility</p>
                                <p className="row-desc">Allow verified employers to find you</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="settings-row mt-4">
                            <div className="row-info">
                                <p className="row-title">Show Salary Expectation</p>
                                <p className="row-desc">Display target salary to employers</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-section">
                    <div className="settings-header">
                        <Bell size={18} />
                        <h4>Notifications</h4>
                    </div>
                    <div className="settings-options mt-4">
                        <div className="settings-row">
                            <div className="row-info">
                                <p className="row-title">Email Notifications</p>
                                <p className="row-desc">Get job offers and messages via email</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-6 danger-card">
                <h4>Danger Zone</h4>
                <p className="text-muted small">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    className="btn-outline-maroon danger mt-4"
                    onClick={handleDeleteAccount}
                >
                    Delete My Account permanently
                </button>
            </div>
        </div>
    );
};

export default JobseekerSettingsView;
