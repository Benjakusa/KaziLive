import React, { useState } from 'react';

export default function EmployerContact() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/employer/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    alert("Message sent to jobseeker!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Write your message..." onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}