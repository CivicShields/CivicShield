import { useState, useCallback, useEffect } from "react";
import Modal from "../../../components/modal/Modal";
import ShowPassInput from "../../../components/show_pass/ShowPasswordInput";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    department_id: "",
    phone: "",
  });
  const [allDeparts, setAllDeparts] = useState([]);
  const [id, setId] = useState(null);

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
    try {
      await fetch(`/auth/users/${id}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await fetch(`/auth/users/${id}/role/`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      setError("Email and password are required");
      return;
    }
    try {
      await fetch("/auth/register/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          department_id: newUser.department_id,
          phone: "",
        }),
      });
      loadUsers();
      setNewUser({
        email: "",
        password: "",
        name: "",
        role: "",
        department_id: "",
        phone: "",
      }); // reset form
    } catch (err) {
      setError(err.message);
    }
  };
  const Departments = allDeparts?.map((depart) => (
    <option value={depart.id} key={depart.id}>
      {depart.name}
    </option>
  ));

  return (
    <div className="table-container">
      <h2>Users</h2>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <h3>Add New User</h3>
      <div className="form-card">
        <input
          type="email"
          placeholder="Email *"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <div className="pass">
          <ShowPassInput
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password *"
          />
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="" disabled>
            User type...
          </option>
          <option value="normal_user">Normal User</option>
          <option value="department_user">Department User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={newUser.department_id}
          onChange={(e) =>
            setNewUser({ ...newUser, department_id: e.target.value })
          }
        >
          <option value="" disabled>
            Department name..
          </option>
          {Departments}
        </select>
        <button onClick={createUser}>Create User</button>
      </div>
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
              <td>{user.department_id}</td>
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
