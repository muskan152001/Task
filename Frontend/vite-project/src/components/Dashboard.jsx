import { getUserRole, logout } from "../utils/auth";

const Dashboard = () => {
  const role = getUserRole();

  return (
    <div>
      <h2>Welcome, {role}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
