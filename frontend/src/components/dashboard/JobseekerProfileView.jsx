import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadFile } from "../../services/api";
import {
  User, Mail, Phone, MapPin, Briefcase, FileText,
  Award, Camera, CheckCircle, AlertCircle, Save,
  Clock, Globe, Upload, Loader2
} from "lucide-react";

export default function JobseekerProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    job_category: "",
    skills: "",
    expected_salary: "",
    years_of_experience: "",
    availability_status: "available",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProfile();
      const safe = data || {};
      setProfile(safe);
      setFormData({
        full_name: safe.full_name || "",
        username: safe.username || "",
        email: safe.email || "",
        phone: safe.phone || "",
        location: safe.location || "",
        bio: safe.bio || "",
        job_category: safe.job_category || "",
        skills: Array.isArray(safe.skills) ? safe.skills.join(", ") : (safe.skills || ""),
        expected_salary: safe.expected_salary || "",
        years_of_experience: safe.years_of_experience || "",
        availability_status: safe.availability_status || "available",
      });
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleCvChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setCvFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let avatarUrl = profile?.profile_picture || "";
      if (file) {
        const uploadRes = await uploadFile(file, "profile_picture");
        avatarUrl = uploadRes?.url || avatarUrl;
      }

      if (cvFile) {
        await uploadFile(cvFile, "cv");
      }

      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
        profile_picture: avatarUrl,
      };

      const updated = await updateProfile(payload);
      setProfile(updated.profile || updated);
      setSuccess("Profile updated successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);
      loadProfile();
    } catch (err) {
      console.error("❌ UPDATE ERROR:", err);
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Profile Section */}
      <div className="glass-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-maroon to-black" />
        <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <img
              src={preview || profile?.profile_picture || "https://ui-avatars.com/api/?name=" + (formData.full_name || "User") + "&background=random"}
              alt="avatar"
              className="w-[150px] h-[150px] rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
              <Camera size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900">{formData.full_name || "Job Seeker"}</h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <Briefcase size={16} /> {formData.job_category || "N/A"} • <MapPin size={16} /> {formData.location || "Earth"}
            </p>
          </div>
          <div className="flex gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${formData.availability_status === 'available' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
              <div className={`w-2 h-2 rounded-full ${formData.availability_status === 'available' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
              {formData.availability_status === 'available' ? 'Available for Work' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User size={20} className="text-maroon" /> Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="full_name" className="glass-input pl-10" value={formData.full_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="email" type="email" className="glass-input pl-10" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="phone" className="glass-input pl-10" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="location" className="glass-input pl-10" value={formData.location} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Short Biography</label>
              <textarea
                name="bio"
                rows={4}
                className="glass-input resize-none"
                placeholder="Tell employers about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase size={20} className="text-maroon" /> Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preferred Category</label>
                <select name="job_category" className="glass-input" value={formData.job_category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="years_of_experience" type="number" className="glass-input pl-10" value={formData.years_of_experience} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Expected Salary (KSh)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">KSh</span>
                  <input name="expected_salary" className="glass-input pl-12" value={formData.expected_salary} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Skills (Comma separated)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="skills" className="glass-input pl-10" placeholder="React, Node.js, AWS..." value={formData.skills} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-maroon" /> Visibility Status</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary/30 cursor-pointer transition-colors bg-white/50">
                <input
                  type="radio"
                  name="availability_status"
                  value="available"
                  checked={formData.availability_status === 'available'}
                  onChange={handleChange}
                  className="accent-primary h-4 w-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">Available for Work</div>
                  <div className="text-xs text-gray-500">Visible to all registered employers</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-danger/30 cursor-pointer transition-colors bg-white/50">
                <input
                  type="radio"
                  name="availability_status"
                  value="not_available"
                  checked={formData.availability_status === 'not_available'}
                  onChange={handleChange}
                  className="accent-danger h-4 w-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">Not Available</div>
                  <div className="text-xs text-gray-500">Hidden from talent searches</div>
                </div>
              </label>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18} className="text-maroon" /> Curriculum Vitae (CV)</h3>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary/50 transition-colors cursor-pointer group">
              <label className="cursor-pointer">
                <div className="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <Upload className="text-gray-400 group-hover:text-primary" size={24} />
                </div>
                <p className="text-sm font-semibold">{cvFile ? cvFile.name : "Upload your Latest CV"}</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCvChange} />
              </label>
            </div>
            {profile?.documents?.some(d => d.type === 'cv' || d.type === 'CV') && (
              <div className="mt-4 flex items-center gap-2 text-success bg-success/10 p-3 rounded-lg">
                <CheckCircle size={16} />
                <span className="text-xs font-bold uppercase">CV Already Verified</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="glass-button w-full h-16 text-lg !rounded-2xl"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>

          {(error || success) && (
            <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${error ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <p className="text-sm font-semibold">{error || success}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}