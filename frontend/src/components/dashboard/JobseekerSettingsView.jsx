import React, { useState } from "react";

export default function JobseekerSettingsView() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://kazilive-backend.onrender.com/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwords),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed");
      }

      alert("Password changed successfully");

      // ✅ reset form
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      alert(err.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Change Password</h2>

      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
} 