import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Bell, CheckCheck, Trash2, Eye, RefreshCw } from "lucide-react";

function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: "e6ba3a28-35a4-455a-958a-f520c4d384fd",
      user_id: 4,
      incident_id: "e2919ef1-99cc-4c0a-9bc6-115fc73fcefd",
      type: "notif",
      message: "testing notification",
      is_read: "f",
      created_at: "2026-06-13 20:54:45.861934+02",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      const req = await fetch(`/notifications/user/${user.id}`, {
        credentials: "include",
      });
      const res = await req.json();
      console.log(res);
      //setNotifications(Array.isArray(data) ? data : []);
      setLoading(false);
      setRefreshing(false);
    }

    fetchNotifications();
    //fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user.id]);

  const markAsRead = async (id) => {
    const req = await fetch(`/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    const res = await req.json();
    console.log(res);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    for (const id of unreadIds) {
      await markAsRead(id);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      const response = await fetch(`/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const req = await fetch(`/notifications/user/${user.id}`, {
      credentials: "include",
    });
    const res = await req.json();
    console.log(res);
    //setNotifications(Array.isArray(data) ? data : []);
    setLoading(false);
    setRefreshing(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!loading) return <div className="loader">Loading notifications...</div>;

  return (
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Notifications</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="create-btn"
              style={{ width: "auto" }}
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="create-btn"
            style={{ width: "auto", background: "#6c757d" }}
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
              style={{
                background: notif.is_read ? "#f8f9fa" : "#fff3e0",
                borderLeft: `4px solid ${notif.is_read ? "#6c757d" : "#f39c12"}`,
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {notif.type?.replace("_", " ").toUpperCase()}
                    {!notif.is_read && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.7rem",
                          background: "#f39c12",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "12px",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>{notif.message}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="create-btn"
                      style={{ width: "auto", padding: "0.3rem 0.6rem" }}
                    >
                      <Eye size={14} /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="delete-btn"
                    style={{ width: "auto", padding: "0.3rem 0.6rem" }}
                  >
                    <Trash2 size={14} /> Delete
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
