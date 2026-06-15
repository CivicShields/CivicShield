import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";

function AdminNotif() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function load() {
      const req = await fetch("/notifications/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setNotifications(res.notifications);
    }
    load();
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/notifications/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setNotifications(res.notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNotification = async (id) => {
    try {
      await fetch(`/notifications/delete/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-container">
      <h2>Notifications</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Incident ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Read</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.user_id}</td>
              <td>{n.incident_id}</td>
              <td>{n.type}</td>
              <td>{n.message.substring(0, 50)}</td>
              <td>{n.is_read ? "Yes" : "No"}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setId(n.id);
                    setIsModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        name="Delete"
        action={() => deleteNotification(id)}
      >
        <h2>
          Are you sure you want <br /> to delete Notification?
        </h2>
      </Modal>
    </div>
  );
}

export default AdminNotif;
