import React from 'react';
import EmployerSearchFilters from '../components/EmployerSearchFilters.jsx';

export default function EmployerSearch() {
  return (
    <div>
      <h2>Search Jobseekers</h2>
      <EmployerSearchFilters />
      {/* TODO: Render jobseeker list from API */}
    </div>
  );
}