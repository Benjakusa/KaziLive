import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Building,
  Phone,
  MapPin,
  LogIn,
  User,
  Camera,
} from "lucide-react";

import { register, uploadPublicFile } from "../services/api";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setLogoFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert("Logo too large. Max 2MB allowed.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      let companyLogoUrl = null;

      // 📤 Upload logo if exists
      if (logoFile) {
        const uploadData = await uploadCompanyLogo(logoFile);
        companyLogoUrl = uploadData.url;
      }

      // 🧾 Register employer
      await register({
        email: formData.email,
        username: formData.username || formData.email.split("@")[0],
        phone: formData.phone,
        password: formData.password,
        user_type: "employer",
        company_name: formData.companyName,
        location: formData.location,
        company_logo: companyLogoUrl,
      });

      alert("Registration successful! Please login.");
      navigate("/employer/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Employer Registration</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* LOGO UPLOAD */}
            <div className="form-group" style={{ textAlign: "center", marginBottom: "24px" }}>
              <label className="form-label">Company Logo</label>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    background: logoPreview ? `url(${logoPreview}) center/cover` : "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    border: "2px solid var(--primary)",
                    overflow: "hidden"
                  }}
                >
                  {!logoPreview && <Building size={32} className="text-gray-300" />}
                </div>
                <label
                  htmlFor="logo"
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Camera size={16} color="white" />
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogoChange}
                />
              </div>
              <p className="text-muted small" style={{ marginTop: "8px" }}>Optional - Max 2MB</p>
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div className="input-icon-wrapper">
                <Building size={18} />
                <input
                  name="companyName"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  name="username"
                  className="form-input"
                  placeholder="preferred_username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone size={18} />
                <input
                  name="phone"
                  className="form-input"
                  placeholder="2547XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company Location</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} />
                <input
                  name="location"
                  className="form-input"
                  placeholder="City, District"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Registering..." : "Register Company"}
            </button>

            <p className="text-center mt-4 text-muted">
              Already have an account?{" "}
              <Link to="/employer/login" style={{ color: "var(--primary)" }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Why Register as an Employer?</h3>
        </div>
        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>1</span>
              Post jobs and reach thousands of candidates
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>2</span>
              Advanced applicant tracking and management
            </li>
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>3</span>
              Direct communication with top talent
            </li>
            <li className="py-3 flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>4</span>
              Build your company brand presence
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
