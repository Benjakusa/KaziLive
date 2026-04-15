import React from 'react';
import { Settings, Shield, Bell, Database, Globe } from 'lucide-react';

const AdminSettingsView = () => {
    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Platform Settings</h2>
                <button className="btn-maroon">Apply Changes</button>
            </div>

            <div className="card mt-6">
                <h4>System Configuration</h4>
                <div className="settings-row mt-4">
                    <div className="row-info">
                        <p className="row-title">Maintenance Mode</p>
                        <p className="row-desc">Disable public access during updates</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="settings-row mt-4">
                    <div className="row-info">
                        <p className="row-title">Automatic Document Verification</p>
                        <p className="row-desc">Use AI to pre-screen uploaded IDs</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="card mt-6">
                <h4>Pricing & Fees</h4>
                <div className="grid-2-col mt-4">
                    <div className="form-group">
                        <label>Employer Access Fee (KES)</label>
                        <input type="number" className="form-input" defaultValue="500" />
                    </div>
                    <div className="form-group">
                        <label>Profile Boost Fee (KES)</label>
                        <input type="number" className="form-input" defaultValue="200" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsView;
