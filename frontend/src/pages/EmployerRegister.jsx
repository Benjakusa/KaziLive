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

import { register, uploadCompanyLogo } from "../services/api";

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
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <label>Company Logo</label>

              <div
                style={{
                  width: 100,
                  height: 100,
                  margin: "10px auto",
                  borderRadius: 12,
                  background: logoPreview
                    ? `url(${logoPreview}) center/cover`
                    : "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--primary)",
                  position: "relative",
                }}
              >
                {!logoPreview && <Building size={40} color="#9ca3af" />}

                <label
                  htmlFor="logo"
                  style={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    background: "var(--primary)",
                    padding: 6,
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <Camera size={16} color="white" />
                </label>

                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
              </div>

              <small>Optional (max 2MB)</small>
            </div>

            {/* COMPANY NAME */}
            <input
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            {/* USERNAME */}
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* PHONE */}
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* LOCATION */}
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* CONFIRM PASSWORD */}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button disabled={loading}>
              {loading ? "Registering..." : "Register Company"}
            </button>

            <p>
              Already have an account?{" "}
              <Link to="/employer/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 