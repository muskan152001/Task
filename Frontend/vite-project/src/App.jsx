// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute role="Manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
        <Route path="/role-redirect" element={<RoleRedirect />} />
        <Route path="/admin-panel" element={<ProtectedRoute role="Admin"><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;