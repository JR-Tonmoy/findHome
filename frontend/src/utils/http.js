import axios from "axios";

const API_BASE = import.meta.env.VITE_REACT_APP_BACKEND_URL
  ? import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, "")
  : "";

const instance = axios.create({
  baseURL: API_BASE || undefined,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token per request
instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }

  return config;
});

export default instance;
