import React, { useState } from "react";
import { login } from "../services/api";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ clear old session (VERY IMPORTANT)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      // ✅ save token
      localStorage.setItem("token", res.token);

      // ✅ force fresh app load (kills stale state)
      window.location.href = "/jobseeker/dashboard";

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
} 