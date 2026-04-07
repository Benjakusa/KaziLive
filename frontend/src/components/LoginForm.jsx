import React, { useState } from 'react';
import { login } from '../services/api.js';

export default function LoginForm({ userType }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(userType, formData);
    alert(JSON.stringify(result));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username / Email / Phone" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}