import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Briefcase, Info, Clock, Loader, Inbox } from 'lucide-react';
import { useSelector } from 'react-redux';

const JobseekerNotificationsView = () => {
    const { token } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            } else {
                setError(data.error || 'Failed to fetch notifications');
            }
        } catch (err) {
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchNotifications();
    }, [token]);

    const handleMarkAllRead = async () => {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            }
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'contact': return MessageSquare;
            case 'verification': return Info;
            default: return Bell;
        }
    };

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Notifications</h2>
                {notifications.some(n => !n.is_read) && (
                    <button className="btn-text-maroon" onClick={handleMarkAllRead}>Mark all as read</button>
                )}
            </div>

            {error && <div className="alert alert-error mt-4">{error}</div>}

            <div className="card mt-6 p-0 overflow-hidden">
                <div className="notification-list">
                    {loading ? (
                        <div className="text-center py-12"><Loader className="animate-spin mx-auto" /><p className="mt-2">Checking for updates...</p></div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-16 opacity-30">
                            <Inbox size={48} className="mx-auto" />
                            <p className="mt-4">You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map(notif => {
                            const Icon = getIcon(notif.notification_type);
                            return (
                                <div key={notif.id} className={`notification-item ${notif.is_read ? '' : 'unread'}`}>
                                    <div className={`notification-icon ${notif.notification_type}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="notification-body">
                                        <h4 className="m-0 text-small font-bold">{notif.title}</h4>
                                        <p>{notif.message}</p>
                                        <span><Clock size={12} /> {notif.created_at}</span>
                                    </div>
                                    {!notif.is_read && <div className="unread-dot"></div>}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobseekerNotificationsView;
