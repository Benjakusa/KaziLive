import React from 'react';
import { Search, Filter } from 'lucide-react';
import EmployerFilters from '../components/EmployerFilters.jsx';

export default function EmployerSearch() {
  const jobseekers = [
    { id: "1", name: "Wanjiku Mwangi", jobCategory: "Frontend Developer", salary: "KSh 80,000/month" },
    { id: "2", name: "Kamau Ochieng", jobCategory: "Backend Developer", salary: "KSh 120,000/month" },
    { id: "3", name: "Achieng Ouma", jobCategory: "UI/UX Designer", salary: "KSh 95,000/month" },
    { id: "4", name: "Mwenda Kariuki", jobCategory: "Full Stack Developer", salary: "KSh 150,000/month" },
    { id: "5", name: "Njeri Kamau", jobCategory: "Mobile Developer", salary: "KSh 110,000/month" },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <Search size={24} />
          <h2>Find Jobseekers</h2>
        </div>
        <div className="card-body">
          <div className="filters">
            <div className="input-icon-wrapper" style={{ flex: 1 }}>
              <Search size={18} className="search-icon" />
              <input type="text" className="form-input" placeholder="Search by name, skill, or category..." />
            </div>
            <button className="btn btn-secondary">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <EmployerFilters />

      <div className="jobseeker-list mt-4">
        {jobseekers.map((js) => (
          <div key={js.id} className="jobseeker-card">
            <div className="avatar">{js.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="jobseeker-info">
              <div className="jobseeker-name">{js.name}</div>
              <div className="jobseeker-category">{js.jobCategory}</div>
              <div className="jobseeker-salary">{js.salary}</div>
            </div>
            <button className="btn btn-primary">View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
}
