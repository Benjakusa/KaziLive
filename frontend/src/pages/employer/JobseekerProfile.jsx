import { useParams, useNavigate } from "react-router-dom";

function JobseekerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const jobseekers = [
    { id: "1", name: "John Doe", jobCategory: "Frontend Developer", salary: "500 USD", availability: "Available" },
    { id: "2", name: "Jane Smith", jobCategory: "Backend Developer", salary: "700 USD", availability: "Not Available" },
    { id: "3", name: "Mike Johnson", jobCategory: "UI/UX Designer", salary: "600 USD", availability: "Available" },
  ];

  const user = jobseekers.find((js) => js.id === id);

  if (!user) {
    return <h3>Profile not found</h3>;
  }

  return (
    <div>
      <button onClick={() => navigate("/employer")}>
        Back
      </button>

      <h2>{user.name}</h2>
      <p>{user.jobCategory}</p>
      <p>{user.salary}</p>
      <p>{user.availability}</p>
    </div>
  );
}

export default JobseekerProfile; 