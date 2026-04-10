import React from 'react';
import { Filter } from 'lucide-react';

export default function EmployerFilters() {
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
            <select className="form-input">
              <option value="">All Categories</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="design">UI/UX Designer</option>
              <option value="mobile">Mobile Developer</option>
              <option value="devops">DevOps Engineer</option>
              <option value="data">Data Analyst</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Salary Range (KSh)</label>
            <select className="form-input">
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
