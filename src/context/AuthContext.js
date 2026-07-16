// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = ({ access_token, role }) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("role", role);

    setToken(access_token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: !!token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}