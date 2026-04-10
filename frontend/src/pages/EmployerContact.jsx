import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function EmployerContact() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/employer/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    alert("Message sent successfully!");
  };

  return (
    <div className="card">
      <div className="card-header">
        <MessageSquare size={24} />
        <h2>Contact Employer</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Message</label>
            <textarea 
              className="form-input" 
              rows="6" 
              placeholder="Write your message here..." 
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
