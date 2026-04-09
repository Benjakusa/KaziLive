import React from 'react';

export default function NotificationBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: '#fffae6', padding: '10px', margin: '10px 0' }}>
      {message}
    </div>
  );
}