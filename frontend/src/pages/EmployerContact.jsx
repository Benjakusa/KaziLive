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
    alert("Ujumbe umetumwa kwa mseja!");
  };

  return (
    <div className="card">
      <div className="card-header">
        <MessageSquare size={24} />
        <h2>Wasiliana na Mgombeaji</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ujumbe Wako</label>
            <textarea 
              className="form-input" 
              rows="6" 
              placeholder="Andika ujumbe wako hapa..." 
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Send size={18} />
            Tumia Ujumbe
          </button>
        </form>
      </div>
    </div>
  );
}
