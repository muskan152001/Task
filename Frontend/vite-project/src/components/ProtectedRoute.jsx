import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />; // Redirect if not logged in
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />; // Restrict access

  return <Outlet />; // Render children if authorized
};

export default ProtectedRoute;
