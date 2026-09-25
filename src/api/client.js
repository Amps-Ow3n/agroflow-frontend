import axios from "axios";

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

export function clearCsrfToken() {
  csrfToken = null;
}

const client = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://agroflow-backend-ghom.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();

  if (
    csrfToken &&
    !["get", "head", "options"].includes(method)
  ) {
    config.headers = config.headers || {};
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export default client;