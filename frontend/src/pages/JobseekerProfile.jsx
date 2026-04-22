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
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        const safe = data || {};

        setProfile(safe);

        setFormData({
          username: safe.username || "",
          email: safe.email || "",
          phone: safe.phone || "",
          location: safe.location || "",
        });
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // INPUT HANDLER
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
  // SAVE PROFILE (FIXED)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let avatarUrl = profile?.avatar || "";

      // upload image if exists
      if (file) {
        const uploadRes = await uploadFile(file, "profile");
        avatarUrl = uploadRes?.url || avatarUrl;
      }

      // clean payload (VERY IMPORTANT FIX)
      const payload = {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        phone: formData.phone?.trim(),
        location: formData.location?.trim(),
        avatar: avatarUrl,
      };

      console.log("SENDING PROFILE UPDATE:", payload);

      const updated = await updateProfile(payload);

      console.log("PROFILE UPDATED:", updated);

      setProfile(updated || payload);

      setFormData({
        username: updated?.username || payload.username,
        email: updated?.email || payload.email,
        phone: updated?.phone || payload.phone,
        location: updated?.location || payload.location,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("UPDATE ERROR FULL:", err);

      // REAL error (NOT fake internet message)
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

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

      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}

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