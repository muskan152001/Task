//RoleRedirect.jsx
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const RoleRedirect = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak.authenticated && keycloak.tokenParsed) {
      const roles = keycloak.tokenParsed?.realm_access?.roles || [];

      console.log("🔑 User Roles:", roles);

      let redirectPath = "/user"; // Default path

      if (roles.includes("admin")) {
        redirectPath = "/admin";
      } else if (roles.includes("manager")) {
        redirectPath = "/manager";
      }

      // Add a delay to ensure Keycloak state updates properly
      setTimeout(() => {
        navigate(redirectPath);
      }, 200);
    }
  }, [keycloak.authenticated, keycloak.tokenParsed, navigate]);

  return null; // No UI needed
};

export default RoleRedirect;
