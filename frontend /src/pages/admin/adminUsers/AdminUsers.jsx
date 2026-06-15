import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";
import ShowPassInput from "../../../components/show_pass/ShowPasswordInput";
import Notify from "../../../components/notify/Notify";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allDeparts, setAllDeparts] = useState([]);
  const [id, setId] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function load() {
      const req = await fetch("/auth/users/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setUsers(res.users);
    }
    async function fetchDeparts() {
      const req = await fetch("/departments/depart-names/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (req.ok) {
        const res = await req.json();
        if (res.success) setAllDeparts(res.list);
      }
    }
    fetchDeparts();
    load();
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const req = await fetch("/auth/users/all/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setUsers(res.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // User actions
  const deleteUser = async (id) => {
    setSuccess(null);
    try {
      const req = await fetch(`/auth/users/${id}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const updateUserRole = async (id, role) => {
    setSuccess(null);
    try {
      const req = await fetch(`/auth/users/${id}/role/`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUserDept = async (id, department_id) => {
    setSuccess(null);
    try {
      const req = await fetch(`/auth/users/${id}/department/`, {
        method: "PATCH",
        body: JSON.stringify({ department_id: department_id }),
        credentials: "include",
      });
      const res = await req.json();
      if (res.message) setSuccess(res.message);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const Departments = allDeparts?.map((depart) => (
    <option value={depart.id} key={depart.id}>
      {depart.name}
    </option>
  ));

  function findIndices(targetValue) {
    for (let i = 0; i < allDeparts.length; i++) {
      if (allDeparts[i].id === targetValue) {
        return allDeparts[i].name;
      }
      return; // Return if not found
    }
  }

  return (
    <div className="table-container">
      <h2>Users</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && <Notify key={success} content={success} type="success" />}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Dept ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option>normal_user</option>
                  <option>department_user</option>
                  <option>admin</option>
                </select>
              </td>
              <td>
                <select
                  value={user.department_id}
                  onChange={(e) => updateUserDept(user.id, e.target.value)}
                >
                  <option>{findIndices(user.department_id)}</option>
                  <option value="none">No Department</option>
                  {Departments}
                </select>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setId(user.id);
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
        action={() => deleteUser(id)}
        col="red"
        over="rgba(0, 0, 0, 0.2);"
        name="delete"
      >
        <h2>
          Are you sure you want <br /> to delete User?
        </h2>
      </Modal>
    </div>
  );
}

export default AdminUsers;
