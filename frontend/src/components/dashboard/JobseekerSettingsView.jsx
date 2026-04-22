import React, { useState } from "react";
import { BASE_URL } from "../../services/api";

export default function JobseekerSettingsView() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setMessage("✅ Password changed successfully");

      setPasswords({
        oldPassword: "",
        newPassword: "",
      });

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Change Password</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
} 