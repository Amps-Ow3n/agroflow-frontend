import axios from "axios";

/*
---------------------------------------
BASE API CLIENT FOR FASTAPI
---------------------------------------
Change baseURL if deploying later
---------------------------------------
*/
const api = axios.create({
  baseURL: "https://agroflow-backend-ghom.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
---------------------------------------
AUTO ATTACH JWT TOKEN
Matches FastAPI OAuth2 Bearer
---------------------------------------
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
---------------------------------------
GLOBAL ERROR HANDLING
If token invalid → logout user
---------------------------------------
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
