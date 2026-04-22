import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/api";
import { Bell, Loader } from "lucide-react";

export default function JobseekerNotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FETCH NOTIFICATIONS
  // ===============================
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/jobseeker/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load notifications");
        }

        setNotifications(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error("NOTIFICATIONS ERROR:", err);
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // ===============================
  // MARK AS READ (optional safe fallback)
  // ===============================
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/jobseeker/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("MARK READ ERROR:", err);
    }
  };

  return (
    <div className="card">
      <h2>Notifications</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Loader className="animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: note.read ? "#f9f9f9" : "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{note.title || "Notification"}</strong>

              {!note.read && (
                <button
                  onClick={() => markAsRead(note.id)}
                  style={{ fontSize: "12px" }}
                >
                  Mark as read
                </button>
              )}
            </div>

            <p style={{ marginTop: "5px" }}>
              {note.message}
            </p>
          </div>
        ))
      )}
    </div>
  );
} 