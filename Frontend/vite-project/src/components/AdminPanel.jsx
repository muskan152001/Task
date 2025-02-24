import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        });
        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // ✅ Function to Update User Role
  const updateUserRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, 
        { role: newRole }, 
        { withCredentials: true }
      );
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  // ✅ Function to Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      
      {loading ? <p>Loading users...</p> : null}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
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
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
