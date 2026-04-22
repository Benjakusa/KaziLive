import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadFile } from "../services/api";

export default function JobseekerProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // =========================
  // LOAD PROFILE (FIXED)
  // =========================
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();

      if (!data) throw new Error("No profile data returned");

      setProfile(data);

      setFormData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
      });

    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // FILE PREVIEW
  // =========================
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  // =========================
  // SAVE PROFILE (FIXED PROPERLY)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let avatarUrl = profile?.avatar || "";

      // FIXED upload type
      if (file) {
        const uploadRes = await uploadFile(file, "general");
        avatarUrl = uploadRes?.url || avatarUrl;
      }

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        avatar: avatarUrl,
      };

      console.log("UPDATE PAYLOAD:", payload);

      await updateProfile(payload);

      // 🔥 IMPORTANT FIX: always re-fetch profile
      const fresh = await getProfile();

      setProfile(fresh);

      setFormData({
        username: fresh.username || "",
        email: fresh.email || "",
        phone: fresh.phone || "",
        location: fresh.location || "",
      });

      setFile(null);
      setPreview(null);

      alert("Profile updated successfully!");

    } catch (err) {
      console.error("UPDATE ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card"><p>Loading profile...</p></div>;

  return (
    <div className="card">
      <h2>My Profile</h2>

      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <img
          src={preview || profile?.avatar || "https://via.placeholder.com/100"}
          alt="avatar"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <form onSubmit={handleSubmit}>
        <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
} 