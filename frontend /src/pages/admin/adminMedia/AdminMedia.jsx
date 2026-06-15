import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";

function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function load() {
      const req = await fetch("/media/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setMedia(res.medias);
    }
    load();
  }, []);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/media/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setMedia(res.medias);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Media actions
  const deleteMedia = async (id) => {
    try {
      await fetch(`/media/${id}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      loadMedia();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-container">
      <h2>Media Files</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Incident ID</th>
            <th>File Name</th>
            <th>Type</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {media.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.incident_id}</td>
              <td>{m.file_name}</td>
              <td>{m.file_type}</td>
              <td>{new Date(m.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setId(m.id);
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
        name="Delete"
        onClose={() => {
          setIsModalOpen(false);
        }}
        action={() => deleteMedia(id)}
      >
        <h2>
          Are you sure you want <br /> to delete Media?
        </h2>
      </Modal>
    </div>
  );
}

export default AdminMedia;
