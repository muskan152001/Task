import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Loading Keycloak...</div>; // Improved UI
  if (!keycloak.authenticated) return <Navigate to="/login" replace />;

  // Extract roles
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const clientRoles = keycloak.clientId
    ? keycloak.tokenParsed?.resource_access?.[keycloak.clientId]?.roles || []
    : [];

  // Check if user has the required role
  if (role) {
    const hasRole = [...userRoles, ...clientRoles].some(
      (r) => r.toLowerCase() === role.toLowerCase()
    );
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
