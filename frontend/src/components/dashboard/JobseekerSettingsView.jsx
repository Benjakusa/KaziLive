import React, { useState } from "react";
import { changePassword } from "../../services/api";
import { Lock, ShieldCheck, AlertCircle, CheckCircle, Save, Key, Loader } from "lucide-react";

export default function JobseekerSettingsView() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await changePassword(passwords.oldPassword, passwords.newPassword);
      setMessage("✅ Password changed successfully");
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to change password. Please check your old password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/20">
          <div className="p-3 rounded-xl bg-maroon/10 text-maroon">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Account Security</h2>
            <p className="text-gray-500 text-sm font-medium">Manage your password and security settings</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Key size={12} /> Old Password
            </label>
            <input
              type="password"
              className="glass-input h-12"
              placeholder="••••••••"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ShieldCheck size={12} /> New Password
              </label>
              <input
                type="password"
                className="glass-input h-12"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ShieldCheck size={12} /> Confirm New Password
              </label>
              <input
                type="password"
                className="glass-input h-12"
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {message && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100 flex items-center gap-2">
              <CheckCircle size={18} /> {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-maroon text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-maroon/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Save size={18} />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="glass-card p-6 mt-8 border-l-4 border-maroon">
        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-maroon" /> Security Tip
        </h4>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          Use a strong, unique password with at least 8 characters, including numbers and special symbols to keep your professional account secure.
        </p>
      </div>
    </div>
  );
}
