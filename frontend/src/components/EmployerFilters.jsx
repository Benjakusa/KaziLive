import React, { useState } from 'react';

export default function EmployerSearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({ skill: '', availability: '' });

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div>
      <input name="skill" placeholder="Skill" onChange={handleChange} />
      <select name="availability" onChange={handleChange}>
        <option value="">Any</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
      </select>
    </div>
  );
}