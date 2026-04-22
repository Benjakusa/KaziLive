import React from 'react';
import { Filter } from 'lucide-react';

export default function EmployerFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-body">
        <div className="flex-center-gap" style={{ marginBottom: '16px' }}>
          <Filter size={20} />
          <strong>Advanced Filters</strong>
        </div>
        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Category</label>
            <select
              className="form-input"
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Salary Range</label>
            <select
              className="form-input"
              name="salaryRange"
              value={filters.salaryRange}
              onChange={handleChange}
            >
              <option value="">Any Salary</option>
              <option value="0-50000">KSh 0 - 50,000</option>
              <option value="50000-100000">KSh 50,000 - 100,000</option>
              <option value="100000-200000">KSh 100,000 - 200,000</option>
              <option value="200000+">KSh 200,000+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
