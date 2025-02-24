import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link for navigation
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.token) {
        const { token, role } = response.data;

        // Store user data securely
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Redirect based on role
        if (role === "Admin") navigate("/admin");
        else if (role === "Manager") navigate("/manager");
        else navigate("/user");
      } else {
        setError("Invalid login response from server.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed! Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* ✅ Add Signup link here */}
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
