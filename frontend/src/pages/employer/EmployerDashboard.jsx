import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Building, MapPin, LogOut, Briefcase } from "lucide-react";

function EmployerDashboard() {
  const [jobseekers, setJobseekers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/employer/login");
      return;
    }
    fetchProfile();
    fetchJobseekers();
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/employer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchJobseekers = async () => {
    try {
      const response = await fetch("/api/employer/jobseekers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setJobseekers(data.jobseekers || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobseekers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filtered = (jobseekers || []).filter((js) => {
    const searchLower = search.toLowerCase();
    const name = js.full_name || js.username || "";
    const category = js.job_category || "";
    return (
      name.toLowerCase().includes(searchLower) ||
      category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container py-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Employer Dashboard</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {profile && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Building size={24} color="var(--primary)" />
              <div>
                <h3 style={{ margin: 0 }}>{profile.company_name}</h3>
                <p className="text-muted" style={{ margin: 0 }}>
                  {profile.company_location}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <Search size={24} />
          <h3>Search Employees</h3>
        </div>
        <div className="card-body">
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "40px" }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : filtered.length > 0 ? (
        <div className="jobseeker-list mt-4">
          {filtered.map((js) => (
            <div key={js.id} className="jobseeker-card">
              <div className="avatar">
                {(js.full_name || js.username || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="jobseeker-info">
                <div className="jobseeker-name">{js.full_name || js.username}</div>
                <div className="jobseeker-category">{js.job_category || "Not specified"}</div>
                <div className="jobseeker-salary">
                  {js.expected_salary
                    ? `KSh ${js.expected_salary.toLocaleString()}`
                    : "Salary not specified"}
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/employer/profile/" + js.id)}
              >
                <User size={18} />
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card mt-4">
          <div className="card-body text-center">
            <p className="text-muted">No jobseekers found. Try a different search.</p>
            {jobseekers.length === 0 && (
              <p className="text-muted">No jobseekers available yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;