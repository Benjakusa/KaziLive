import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Briefcase, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobseekerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/jobseeker/login");
      return;
    }
    fetchProfile();
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/jobseeker/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/jobseeker/login");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="flex justify-between items-center mb-4">
        <h2>My Dashboard</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {profile ? (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <User size={24} />
              <h3>Profile Summary</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <p>{profile.full_name || "Not set"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <p>{profile.email}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <p>{profile.location || "Not set"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Job Category</label>
                <p>{profile.job_category || "Not set"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Salary</label>
                <p>
                  {profile.expected_salary
                    ? `KSh ${profile.expected_salary.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <p>{profile.availability_status || "Not set"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Skills</label>
                <div className="flex gap-2 flex-wrap">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge"
                        style={{
                          background: "var(--primary)",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills added</p>
                  )}
                </div>
              </div>
              <button
                className="btn btn-primary mt-4"
                onClick={() => navigate("/jobseeker/profile")}
              >
                <FileText size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <Briefcase size={24} />
              <h3>Quick Stats</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Profile Status</label>
                <p
                  style={{
                    color: profile.profile_verified ? "green" : "orange",
                  }}
                >
                  {profile.profile_verified ? "Verified" : "Pending Verification"}
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Profile Completion</label>
                <div
                  style={{
                    background: "#e5e7eb",
                    borderRadius: "4px",
                    height: "8px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      background: "var(--primary)",
                      borderRadius: "4px",
                      height: "100%",
                      width: profile.full_name ? "80%" : "40%",
                    }}
                  />
                </div>
              </div>
              <div className="form-group mt-4">
                <p className="text-muted">
                  Update your profile to get noticed by employers!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center">
            <p>No profile found. Please complete your profile.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/jobseeker/profile")}
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-header">
          <h3>Available Jobs</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            No job listings available yet. Check back later!
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobseekerDashboard;