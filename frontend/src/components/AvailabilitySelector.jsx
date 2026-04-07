import React from 'react';

export default function AvailabilitySelector({ onChange }) {
  return (
    <div>
      <label>Availability:</label>
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
      </select>
    </div>
  );
}