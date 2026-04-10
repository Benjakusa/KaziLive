import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

function EmployerDashboard() {
  const [jobseekers] = useState([
    { id: "1", name: "Wanjiku Mwangi", jobCategory: "Frontend Developer", salary: "KSh 80,000/month" },
    { id: "2", name: "Kamau Ochieng", jobCategory: "Backend Developer", salary: "KSh 120,000/month" },
    { id: "3", name: "Achieng Ouma", jobCategory: "UI/UX Designer", salary: "KSh 95,000/month" },
  ]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = jobseekers.filter((js) =>
    js.jobCategory.toLowerCase().includes(search.toLowerCase()) ||
    js.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <Search size={24} />
          <h2>Tafuta Wafanyakazi</h2>
        </div>
        <div className="card-body">
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
      </div>

      <div className="jobseeker-list mt-4">
        {filtered.map((js) => (
          <div key={js.id} className="jobseeker-card">
            <div className="avatar">{js.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="jobseeker-info">
              <div className="jobseeker-name">{js.name}</div>
              <div className="jobseeker-category">{js.jobCategory}</div>
              <div className="jobseeker-salary">{js.salary}</div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/employer/profile/" + js.id)}>
              <User size={18} />
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;
