import React, { useState } from "react";

export default function JobseekerNotificationsView() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New job offer received", read: false },
    { id: 2, message: "Your profile was viewed", read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="card">
      <h2>Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: "10px",
            marginBottom: "10px",
            background: n.read ? "#eee" : "#fff",
            border: "1px solid #ddd",
          }}
        >
          <p style={{ opacity: n.read ? 0.6 : 1 }}>
            {n.message}
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            {!n.read && (
              <button onClick={() => markAsRead(n.id)}>
                Mark as Read
              </button>
            )}

            <button onClick={() => deleteNotification(n.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 