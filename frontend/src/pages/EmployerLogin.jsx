import React from 'react';
import LoginForm from '../components/LoginForm.jsx';

export default function EmployerLogin() {
  return (
    <div>
      <h2>Employer Login</h2>
      <LoginForm userType="employer" />
    </div>
  );
}