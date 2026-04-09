import React from 'react';
import LoginForm from '../components/LoginForm.jsx';

export default function JobseekerLogin() {
  return (
    <div>
      <h2>Jobseeker Login</h2>
      <LoginForm userType="jobseeker" />
    </div>
  );
}