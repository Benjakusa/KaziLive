import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadFile } from "../../services/api";

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
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();

        setProfile(data || {});

        setFormData({
          username: data?.username || "",
          email: data?.email || "",
          phone: data?.phone || "",
          location: data?.location || "",
        });
      } catch (err) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  // =========================
  // FIXED SUBMIT (REAL BACKEND SAFE)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let avatarUrl = profile?.avatar || "";

      if (file) {
        const uploaded = await uploadFile(file, "profile");
        avatarUrl = uploaded?.url || avatarUrl;
      }

      const payload = {
        ...formData,
        avatar: avatarUrl,
      };

      const updated = await updateProfile(payload);

      setProfile(updated);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card">Loading profile...</div>;

  return (
    <div className="card">
      <h2>My Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <img
        src={preview || profile?.avatar || "https://via.placeholder.com/100"}
        alt="avatar"
        style={{ width: 100, height: 100, borderRadius: "50%" }}
      />

      <input type="file" onChange={handleFileChange} />

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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}  