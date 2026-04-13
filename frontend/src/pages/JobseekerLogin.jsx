import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogIn, User } from "lucide-react";

export default function JobseekerLogin() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (identifier === "employer@test.com") {
      alert("Logged in as Employer");
      navigate("/employer");
    } else if (identifier === "jobseeker@test.com") {
      alert("Logged in as Jobseeker");
      navigate("/jobseeker");
    } else {
      alert("Use employer@test.com or jobseeker@test.com");
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
          <form onSubmit={handleLogin}>
            
            <div className="form-group">
              <label className="form-label">
                Username / Email / Phone
              </label>

              <div className="input-icon-wrapper">
                <User size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="0712 345 678 or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>

              <div className="input-icon-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>

            <p className="text-center mt-4 text-muted">
              Don't have an account?{" "}
              <Link
                to="/jobseeker/register"
                style={{ color: "var(--primary)" }}
              >
                Register here
              </Link>
            </p>
          </form>

          {/* QUICK ACCESS BUTTONS */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => navigate("/employer")}>
              Enter as Employer
            </button>

            <button onClick={() => navigate("/jobseeker")}>
              Enter as Jobseeker
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Find Jobs Quickly</h3>
        </div>

        <div className="card-body">
          <ul className="list-unstyled">
            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                1
              </span>
              Create your professional profile
            </li>

            <li className="py-3 divider-b flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                2
              </span>
              Upload your CV
            </li>

            <li className="py-3 flex-center-gap">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                3
              </span>
              Apply to jobs and get hired
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 