import React from "react";
import { Settings, Lock, Building, Globe, MapPin } from "lucide-react";

const EmployerSettingsView = () => {
  return (
    <div className="dashboard-content-area">
      <div className="section-header-flex">
        <h2>Company Settings</h2>

        {/* ✅ FIXED BUTTON (no longer dead) */}
        <button
          className="btn-maroon"
          onClick={() => alert("Changes saved (connect backend later)")}
        >
          Save Changes
        </button>
      </div>

      <div className="card mt-6">
        <div className="settings-header">
          <Building size={18} />
          <h4>Company Profile</h4>
        </div>

        <div className="grid-2-col mt-4">
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" className="form-input" defaultValue="TechCorp Kenya" />
          </div>

          <div className="form-group">
            <label><Globe size={14} /> Website</label>
            <input type="text" className="form-input" defaultValue="https://techcorp.co.ke" />
          </div>

          <div className="form-group">
            <label><MapPin size={14} /> Location</label>
            <input type="text" className="form-input" defaultValue="Westlands, Nairobi" />
          </div>

          <div className="form-group">
            <label>Industry</label>
            <select className="form-input">
              <option>Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
          </div>
        </div>

        <div className="form-group mt-4">
          <label>Description</label>
          <textarea
            className="form-input"
            rows="4"
            defaultValue="Leading software solutions provider in East Africa."
          />
        </div>
      </div>

      <div className="card mt-6">
        <div className="settings-header">
          <Lock size={18} />
          <h4>Security</h4>
        </div>

        <div className="settings-options mt-4">
          <div className="settings-row">
            <div>
              <p>Password</p>
              <small>Update account password</small>
            </div>

            <button
              className="btn-outline-maroon btn-sm"
              onClick={() => alert("Password change coming soon")}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSettingsView; 