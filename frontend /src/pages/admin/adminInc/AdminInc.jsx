import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";

function AdminInc() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);

  // Load data based on active tab
  useEffect(() => {
    async function load() {
      const req = await fetch("/incident/admin/list/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.error) setError(res.error);
      if (res.success) setIncidents(res.incidents);
    }
    load();
  }, []);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/incident/admin/list/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.error) setError(res.error);
      if (res.success) setIncidents(res.incidents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Incident actions
  const deleteIncident = async (id) => {
    if (!window.confirm("Delete this incident?")) return;
    try {
      await fetch(`/incident/admin/${id}/remove/`, {
        method: "DELETE",
        credentials: "include",
      });
      loadIncidents();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateIncident = async (id, severity, status) => {
    try {
      await fetch(`/incident/admin/update/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ severity, status }),
        credentials: "include",
      });
      loadIncidents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-container">
      <h2>Incidents</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Dept ID</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td>{inc.id}</td>
              <td>{inc.reporter_id}</td>
              <td>{inc.department_id}</td>
              <td>{inc.category}</td>
              <td>
                <select
                  value={inc.severity}
                  onChange={(e) =>
                    updateIncident(inc.id, e.target.value, inc.severity)
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </td>
              <td>
                <select
                  defaultValue={inc.status}
                  onChange={(e) =>
                    updateIncident(inc.id, inc.status, e.target.value)
                  }
                >
                  <option>pending</option>
                  <option>in_progress</option>
                  <option>resolved</option>
                </select>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setId(inc.id);
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
        action={() => deleteIncident(id)}
      >
        <h2>
          Are you sure you want <br /> to delete incident?
        </h2>
      </Modal>
    </div>
  );
}

export default AdminInc;
