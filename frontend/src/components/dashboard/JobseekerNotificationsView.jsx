import React, { useState, useEffect } from "react";
import { Bell, Trash2, CheckCircle, Clock, Loader2 } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../../services/api";

export default function JobseekerNotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "offer":
        return "💼";
      case "application":
        return "📋";
      case "message":
        return "💬";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-maroon" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-maroon text-white shadow-lg shadow-maroon/20">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Notifications</h2>
              <p className="text-gray-500 text-sm">Stay updated with your latest activities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-maroon/10 text-maroon px-4 py-1.5 rounded-full text-sm font-bold">
              {unreadCount} New
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-maroon hover:text-maroon/80 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 m-4 bg-danger/10 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="divide-y divide-white/20">
          {notifications.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 sm:p-6 flex items-start gap-4 transition-all duration-200 hover:bg-white/10 ${
                  n.is_read ? "bg-white/10 opacity-75" : "bg-white/40"
                }`}
              >
                <div
                  className={`mt-1 p-2 rounded-xl text-lg ${
                    n.is_read ? "bg-gray-100" : "bg-maroon/10"
                  }`}
                >
                  {getTypeIcon(n.notification_type)}
                </div>

                <div className="flex-1 min-w-0">
                  {n.title && (
                    <p className="font-semibold text-sm text-maroon mb-0.5">
                      {n.title}
                    </p>
                  )}
                  <p
                    className={`font-medium mb-2 ${
                      n.is_read ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {n.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDate(n.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-2 hover:bg-success/10 text-success rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}