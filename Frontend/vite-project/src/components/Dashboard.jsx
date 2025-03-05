import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole === "Admin") {
      navigate("/admin");
    } else if (userRole === "Manager") {
      navigate("/manager");
    } else {
      navigate("/user");
    }
  }, [userRole, navigate]);

  return <h1>Redirecting...</h1>;
};

export default Dashboard;
