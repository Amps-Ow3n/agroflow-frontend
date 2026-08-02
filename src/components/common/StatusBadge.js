import React from "react";

export default function StatusBadge({ status }) {

  const map = {
    FEASIBLE: "bg-success",
    RELIABLE: "bg-success",
    LOW: "bg-success",

    SHORTFALL: "bg-warning text-dark",
    MODERATE: "bg-warning text-dark",
    MEDIUM: "bg-warning text-dark",

    UNFULFILLABLE: "bg-danger",
    HIGH_RISK: "bg-danger",
    HIGH: "bg-danger",

    CRITICAL: "bg-dark"
  };

  return (
    <span
      className={`badge ${map[status] || "bg-secondary"}`}
    >
      {status}
    </span>
  );
}