import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Lock, LogIn, User } from "lucide-react";
import { login } from "../services/api";
import { loginSuccess } from "../features/auth/authSlice";

export default function JobseekerLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // 🚨 FIX: prevent stale user auto-redirect loops
  useEffect(() => {
    if (!user) return;

    const role = user?.user_type || user?.role;

    if (role === "jobseeker") {
      navigate("/jobseeker/dashboard", { replace: true });
    } else if (role === "employer") {
      navigate("/employer/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(formData);

      // 🚨 FIX: strict response validation
      if (!res || !res.user || !res.access_token) {
        throw new Error("Invalid server response");
      }

      if (res.user.user_type !== "jobseeker") {
        throw new Error("This account is not a jobseeker account");
      }

      // 🚨 FIX: clear stale session before setting new one
      localStorage.removeItem("token");
      localStorage.setItem("token", res.access_token);

      dispatch(
        loginSuccess({
          user: res.user,
          token: res.access_token,
        })
      );

      // 🚨 FIX: force clean navigation
      navigate("/jobseeker/dashboard", { replace: true });

    } catch (err) {
      setError(err?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <LogIn size={24} />
          <h2>Jobseeker Login</h2>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username / Email / Phone</label>

              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  type="text"
                  name="identifier"
                  className="form-input"
                  placeholder="0712 345 678 or email"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>

              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center mt-4 text-muted">
              Don't have an account?{" "}
              <Link to="/jobseeker/register" style={{ color: "var(--primary)" }}>
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Find Jobs Quickly</h3>
        </div>

        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>1</span>
              Create your professional profile
            </li>

            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>2</span>
              Upload your CV
            </li>

            <li className="py-3 flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>3</span>
              Apply to jobs and get hired
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 