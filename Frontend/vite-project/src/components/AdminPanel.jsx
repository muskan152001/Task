//Adminpanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
          signal: controller.signal, // Attach signal to cancel request if needed
        });
        setUsers(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("❌ Failed to fetch users");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort(); // Cleanup
  }, []);

  const updateUserRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
    } catch (err) {
      console.error("❌ Failed to update user role", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete user", err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {loading && <p>🔄 Loading users...</p>}
      {error && <p className="error">{error}</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
