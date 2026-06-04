import React from "react";
import { useAuth } from "../hooks/useAuth";

const Topbar = ({
  title = "Dashboard",
  subtitle = "",
  systemStatus = "stable",
  alertCount = 0,
  loading = false,
}) => {
  const { role } = useAuth();

  const statusStyles = {
    stable: "badge bg-success",
    warning: "badge bg-warning text-dark",
    risk: "badge bg-danger",
  };

  const roleLabel = role ? role.toUpperCase() : "";

  return (
    <div className="bg-white border-bottom px-3 px-md-4 py-3 d-flex flex-column flex-md-row justify-content-between gap-2">

      {/* LEFT */}
      <div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h5 className="mb-0 fw-semibold">{title}</h5>

          {roleLabel && (
            <span className="badge bg-light text-dark border">
              {roleLabel}
            </span>
          )}
        </div>

        {subtitle && (
          <small className="text-muted d-none d-md-block">
            {subtitle}
          </small>
        )}
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-2 flex-wrap">

        {loading && <span className="text-muted small">Updating...</span>}

        <span className={statusStyles[systemStatus] || "badge bg-secondary"}>
          {systemStatus.toUpperCase()}
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

export default Topbar;