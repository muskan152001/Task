import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; 

export const signup = async (fullName, email, password, role) => {
  const res = await axios.post(`${API_URL}/register`, { fullName, email, password, role });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
  return res.data;
};
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const setUserRole = (role) => {
  localStorage.setItem("role", role);
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  localStorage.removeItem("role");
  window.location.href = "/login";
};
