import React from "react";

const StatBox = ({
  label,
  value,
  interpretation = null,
  status = null,
  className = "",
}) => {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    critical: "text-danger",
    info: "text-primary",
  };

  return (
    <div
      className={`bg-white border-0 shadow-sm rounded-3 p-3 p-md-4 d-flex flex-column gap-2 ${className}`}
    >

      <div
        className={`fw-bold ${statusColors[status] || "text-dark"}`}
        style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
      >
        {value}
      </div>

      <div className="text-muted small fw-semibold">
        {label}
      </div>

      {interpretation && (
        <div className="text-muted small">
          {interpretation}
        </div>
      )}

    </div>
  );
};

export default StatBox;