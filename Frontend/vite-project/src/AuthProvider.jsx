//AuthProvider.jsx
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";  // Import the Keycloak instance

const AuthProvider = ({ children }) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",  // Check if the user is already logged in
        checkLoginIframe: false,  // Disable login iframe for better compatibility
        pkceMethod: "S256",  // Enable PKCE for enhanced security
      }}
      onEvent={(event, error) => {
        console.log("Keycloak Event:", event);
        if (error) {
          console.log("Keycloak Error:", error);
        }
      }}
      onTokens={(tokens) => {
        console.log("Tokens:", tokens);  // Log tokens for debugging
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default AuthProvider;
