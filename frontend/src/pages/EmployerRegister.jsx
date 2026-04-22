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
    <div className="flex items-center justify-center min-h-screen bg-off-white py-12 px-6 animate-in fade-in duration-700">
      <div className="glass-card max-w-2xl w-full p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-maroon/5 text-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-maroon/5 border border-maroon/10">
            <Building size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Employer Registration</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Join the KaziLive business network</p>
        </div>

        {error && (
          <div className="p-4 bg-danger/5 text-danger rounded-2xl border border-danger/10 flex items-center gap-3 text-sm font-medium mb-8 animate-in slide-in-from-top-2">
            <LogIn size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LOGO UPLOAD */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="relative w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-maroon/30 transition-all overflow-hidden group"
              style={logoPreview ? { borderStyle: 'solid', backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {!logoPreview && <Building size={32} className="text-gray-300" />}
              <label
                htmlFor="logo"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <Camera size={24} className="text-white" />
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Company Logo (Max 2MB)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</label>
              <div className="relative group">
                <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="companyName"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="username"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="preferred_username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="email"
                  type="email"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="phone"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="2547XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company Location</label>
              <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="location"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="City, District"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="password"
                  type="password"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon transition-colors" />
                <input
                  name="confirmPassword"
                  type="password"
                  className="glass-input pl-10 h-12 text-sm"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button className="glass-button w-full h-14 mt-6" disabled={loading}>
            {loading ? <Loader className="animate-spin mx-auto text-white" size={20} /> : "Register Company"}
          </button>

          <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Already have an account?{" "}
            <Link to="/employer/login" className="text-maroon hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
} 