import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessFarmerArea, canAccessAdminArea } from "../../utils/roleHelpers";

import {
  FaSeedling,
  FaClipboardList,
  FaTruck,
  FaChartLine,
  FaUsersCog,
  FaShieldAlt,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!role) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const width = collapsed ? "80px" : "260px";

  const linkBase =
    "nav-link d-flex align-items-center gap-2 text-white px-3 py-2";
  const linkActive = "bg-success rounded";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width,
        background: "linear-gradient(180deg,#14532d,#166534,#15803d)",
        overflowY: "auto",
        zIndex: 2000,
        transition: "width 0.3s ease",
      }}
    >

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">

        {!collapsed && (
          <div>
            <h5 className="mb-0 fw-bold text-white">AgroFlow</h5>
            <small className="text-light">Agricultural Intelligence</small>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-sm btn-outline-light"
        >
          <FaBars />
        </button>

      </div>

      {/* NAV */}
      <nav className="nav flex-column p-2">

        {canAccessFarmerArea(role) && (
          <>
            <NavLink to="/farmer/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaChartLine /> {!collapsed && "Operations"}
            </NavLink>

            <NavLink to="/farmer/supply" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaSeedling /> {!collapsed && "Supply Registry"}
            </NavLink>

            <NavLink to="/farmer/commitments" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaClipboardList /> {!collapsed && "Commitments"}
            </NavLink>

            <NavLink to="/farmer/deliveries" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaTruck /> {!collapsed && "Deliveries"}
            </NavLink>

            <NavLink to="/farmer/feasibility" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaChartLine /> {!collapsed && "Feasibility"}
            </NavLink>
          </>
        )}

        {canAccessAdminArea(role) && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaUsersCog /> {!collapsed && "Overview"}
            </NavLink>

            <NavLink to="/admin/risk-intelligence" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaShieldAlt /> {!collapsed && "Risk"}
            </NavLink>

            <NavLink to="/admin/farmers" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaUsersCog /> {!collapsed && "Farmers"}
            </NavLink>

            <NavLink to="/admin/users" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaUsersCog /> {!collapsed && "Users"}
            </NavLink>

            <NavLink to="/admin/report" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
              <FaChartLine /> {!collapsed && "Reports"}
            </NavLink>
          </>
        )}

      </nav>

      {/* LOGOUT */}
      <div className="p-3 border-top">
        <button
          onClick={handleLogout}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaSignOutAlt />
          {!collapsed && "Logout"}
        </button>
      </div>

    </div>
  );
};

export default Sidebar;