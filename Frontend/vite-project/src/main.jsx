import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import App from "./App";
import AuthProvider from "./AuthProvider.jsx";

// Render the app with AuthProvider wrapping it once
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
