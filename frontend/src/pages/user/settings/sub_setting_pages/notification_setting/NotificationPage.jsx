import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Bell, CheckCheck, Trash2, Eye, RefreshCw } from "lucide-react";
import "./NotificationPage.css";

function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      const req = await fetch(`/notifications/user/${user.id}/`, {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setNotifications(res.notifications);
      if (res.error) setError(res.error);
      setLoading(false);
      setRefreshing(false);
    }

    fetchNotifications();
    //fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user.id]);

  const markAsRead = async (id, messageData) => {
    const req = await fetch(`/notifications/${id}/read/`, {
      method: "PATCH",
      body: JSON.stringify(messageData),
      credentials: "include",
    });
    const res = await req.json();
    console.log(res);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    notifications
      .filter((n) => !n.is_read)
      .map(async (n) => {
        const req = await markAsRead(n.id, {
          user_id: n.user_id,
          department_id: n.department_id,
        });
        const res = await req.json();
        if (res.error) return setError(res.error);
        console.log(res);
      });
  };

  const deleteNotification = async (id, messageData) => {
    const req = await fetch(`/notifications/delete/${id}/`, {
      method: "DELETE",
      body: JSON.stringify(messageData),
      credentials: "include",
    });
    const res = await req.json();
    if (res.success)
      return setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (res.error) return setError(res.error);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const req = await fetch(`/notifications/user/${user.id}/`, {
      credentials: "include",
    });
    const res = await req.json();
    if (res.success) setNotifications(res.notifications);
    if (res.error) setError(res.error);
    setLoading(false);
    setRefreshing(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <div className="loader">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notification-actions">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="all-read">
              <CheckCheck size={20} />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="refresh-all"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
          <Bell size={48} strokeWidth={1} />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-card ${notif.is_read ? "" : "unread"}`}
            >
              <div className="notification-style">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {notif.type?.replace("_", " ").toUpperCase()}
                    {!notif.is_read && (
                      <span className="notification-badge">NEW</span>
                    )}
                  </div>
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-date">
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="notif-buttons">
                  {!notif.is_read && (
                    <button
                      onClick={() =>
                        markAsRead(notif.id, {
                          user_id: notif.user_id,
                          department_id: notif.department_id,
                        })
                      }
                      className="all-read"
                    >
                      <Eye size={18} /> <span>Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      deleteNotification(notif.id, {
                        user_id: notif.user_id,
                        department_id: notif.department_id,
                      })
                    }
                    className="notif-delete"
                  >
                    <Trash2 size={18} /> <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default NotificationPage;
