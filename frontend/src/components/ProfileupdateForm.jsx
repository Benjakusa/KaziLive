import React, { useState } from 'react';

export default function ProfileUpdateForm() {
  const [profile, setProfile] = useState({ name: '', skills: '' });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated: " + JSON.stringify(profile));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
      <input type="text" name="skills" placeholder="Skills" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
}