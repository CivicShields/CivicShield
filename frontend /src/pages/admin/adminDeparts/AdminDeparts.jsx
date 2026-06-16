import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";
import Notify from "../../../components/notify/Notify";

function AdminDeparts() {
  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function load() {
      const req = await fetch("/departments/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setDepartments(res.departments);
    }
    load();
  }, []);

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/departments/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setDepartments(res.departments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Department actions
  const deleteDepartment = async (id) => {
    setSuccess(null);
    try {
      const req = await fetch(`/departments/${id}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      loadDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!formData.contact_email || !formData.contact_phone || !formData.name) {
      return setError("Enter all values");
    }
    try {
      const req = await fetch("/departments/create/", {
        method: "POST",
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      if (res.error) setError(res.error);
      loadDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormData({
        ...formData,
        name: "",
        contact_email: "",
        contact_phone: "",
      });
    }
  };

  const updateDepartment = async (id, deptdata) => {
    setSuccess(null);
    try {
      const req = await fetch(`/departments/${id}/update/`, {
        method: "PATCH",
        body: JSON.stringify(deptdata),
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      loadDepartments();
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-container">
      <h2>Departments</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && <Notify key={success} content={success} type="success" />}
      <h3>Create New Department</h3>
      <form className="form-card">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.contact_email}
          onChange={(e) =>
            setFormData({ ...formData, contact_email: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.contact_phone}
          onChange={(e) =>
            setFormData({ ...formData, contact_phone: e.target.value })
          }
          required
        />
        <button className="create-btn" onClick={(e) => createDepartment(e)}>
          Create
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="edit">
              {editingId === dept.id ? (
                <>
                  <td>{dept.id}</td>
                  <td>
                    <input defaultValue={dept.name} id={`name-${dept.id}`} />
                  </td>
                  <td>
                    <input
                      defaultValue={dept.contact_email}
                      id={`email-${dept.id}`}
                    />
                  </td>
                  <td>
                    <input
                      defaultValue={dept.contact_phone || ""}
                      id={`phone-${dept.id}`}
                    />
                  </td>
                  <td>
                    <button
                      className="create-btn"
                      onClick={() => {
                        const newName = document.getElementById(
                          `name-${dept.id}`,
                        ).value;
                        const newEmail = document.getElementById(
                          `email-${dept.id}`,
                        ).value;
                        const newPhone = document.getElementById(
                          `phone-${dept.id}`,
                        ).value;
                        updateDepartment(dept.id, {
                          name: newName,
                          contact_email: newEmail,
                          contact_phone: newPhone,
                        });
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="create-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.contact_email}</td>
                  <td>{dept.contact_phone}</td>
                  <td>
                    <button
                      className="create-btn"
                      onClick={() => setEditingId(dept.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setId(dept.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
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
        action={() => deleteDepartment(id)}
      >
        <h2>
          Are you sure you want <br /> to delete Department? This may affect
          assignments.
        </h2>
      </Modal>
    </div>
  );
}

export default AdminDeparts;
