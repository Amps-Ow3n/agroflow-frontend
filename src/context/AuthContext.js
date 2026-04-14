import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

/*
----------------------------------------
CREATE CONTEXT
----------------------------------------
*/
const AuthContext = createContext();

/*
----------------------------------------
AXIOS API CLIENT
Automatically attaches JWT to requests
----------------------------------------
*/
export const api = axios.create({
  baseURL: "https://agroflow-backend-ghom.onrender.com",
});

/*
Attach token automatically to every request
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*
----------------------------------------
HELPER — decode JWT safely
----------------------------------------
*/
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/*
----------------------------------------
AUTH PROVIDER
----------------------------------------
*/
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  ----------------------------------------
  RESTORE SESSION ON PAGE REFRESH
  ----------------------------------------
  */
useEffect(() => {
  const savedToken = localStorage.getItem("access_token");

  if (savedToken) {
    const payload = parseJwt(savedToken);
    if (payload) {
      setToken(savedToken);
      setRole(payload.role);
      setUserId(payload.id ?? null); // <-- FIX HERE
    } else {
      localStorage.removeItem("access_token");
    }
  }

  setLoading(false);
}, []);
  /*
  ----------------------------------------
  LOGIN (calls FastAPI /login)
  ----------------------------------------
  */
  const login = async (email, password) => {
    const res = await axios.post("https://agroflow-backend-ghom.onrender.com/login", null, {
      params: { email, password },
    });

    const accessToken = res.data.access_token;
    const payload = parseJwt(accessToken);

    // Save token
    localStorage.setItem("access_token", accessToken);

    // Update context state
    setToken(accessToken);
    setRole(payload.role);
    setUserId(payload.id);

    // Return payload so frontend can use it
    return payload;
};
  /*
  ----------------------------------------
  LOGOUT
  ----------------------------------------
  */
  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  /*
  ----------------------------------------
  CONTEXT VALUE
  ----------------------------------------
  */
  const value = {
    token,
    role,
    userId,
    login,
    logout,
    api,       
    isAuthenticated: !!token,
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/*
----------------------------------------
CUSTOM HOOK
----------------------------------------
*/
export function useAuth() {
  return useContext(AuthContext);
}
