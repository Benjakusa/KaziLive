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

  // ===============================
  // 📥 LOAD PROFILE
  // ===============================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        // prevent null crashes
        const safeData = data || {};

        setProfile(safeData);

        setFormData({
          username: safeData.username || "",
          email: safeData.email || "",
          phone: safeData.phone || "",
          location: safeData.location || "",
        });
      } catch (err) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ===============================
  // ✏️ HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===============================
  // 📤 IMAGE PREVIEW
  // ===============================
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  // ===============================
  // 💾 SAVE PROFILE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let uploadedUrl = profile?.avatar || "";

      // upload image if selected
      if (file) {
        const uploadRes = await uploadFile(file);
        uploadedUrl = uploadRes?.url || uploadedUrl;
      }

      const payload = {
        ...formData,
        avatar: uploadedUrl,
      };

      const updated = await updateProfile(payload);

      const safeUpdated = updated || payload;

      setProfile(safeUpdated);

      // IMPORTANT: sync UI immediately
      setFormData({
        username: safeUpdated.username || "",
        email: safeUpdated.email || "",
        phone: safeUpdated.phone || "",
        location: safeUpdated.location || "",
      });

      alert("Profile updated successfully!");
    } catch (err) {
      setError(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="card">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>My Profile</h2>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      {/* AVATAR */}
      <div style={{ marginBottom: 20 }}>
        <img
          src={
            preview ||
            profile?.avatar ||
            "https://via.placeholder.com/100"
          }
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

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
} 