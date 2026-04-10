import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
  const [jobseekers, setJobseekers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { id: "1", name: "John Doe", jobCategory: "Frontend Developer", salary: "500 USD" },
      { id: "2", name: "Jane Smith", jobCategory: "Backend Developer", salary: "700 USD" },
      { id: "3", name: "Mike Johnson", jobCategory: "UI/UX Designer", salary: "600 USD" },
    ];

    setJobseekers(data);
  }, []);

  const filtered = jobseekers.filter((js) =>
    js.jobCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Find Jobseekers</h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filtered.map((js) => (
          <li key={js.id}>
            <h3>{js.name}</h3>
            <p>{js.jobCategory}</p>
            <p>{js.salary}</p>

            <button onClick={() => navigate("/employer/profile/" + js.id)}>
              View Profile
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployerDashboard; 