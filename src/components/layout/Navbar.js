import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAdmin, isFarmer } from "../../utils/roleHelpers";

const Navbar = ({
  moduleTitle = "Dashboard",
  interpretation = "",
  systemStatus = "stable",
  alertCount = 0,
  loading = false,
}) => {
  const { role } = useAuth();

  const getRoleLabel = () => {
    if (!role) return "";
    if (isAdmin(role)) return "Admin";
    if (isFarmer(role)) return "Farmer";
    return role;
  };

  const statusStyles = {
    stable: "badge bg-success",
    warning: "badge bg-warning text-dark",
    risk: "badge bg-danger",
  };

  return (
    <div className="bg-white border-bottom px-3 px-md-4 py-3 d-flex flex-column flex-md-row justify-content-between gap-2">

      {/* LEFT */}
      <div style={{ minWidth: 0 }}>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h5 className="mb-0 fw-semibold">{moduleTitle}</h5>
          <span className="badge bg-light text-dark border">
            {getRoleLabel()}
          </span>
        </div>

        {interpretation && (
          <small className="text-muted d-none d-md-block">
            {interpretation}
          </small>
        )}
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center flex-wrap gap-2">

        {loading && (
          <span className="text-muted small">Updating...</span>
        )}

        <span className={statusStyles[systemStatus]}>
          {systemStatus}
        </span>

        {alertCount > 0 && (
          <span className="badge bg-danger">
            {alertCount} alerts
          </span>
        )}

      </div>

    </div>
  );
};

export default Navbar;