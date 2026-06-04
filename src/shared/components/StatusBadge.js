import React from "react";

const StatusBadge = ({ status = "UNKNOWN", type = "default" }) => {
  const normalize = (s) => (s || "UNKNOWN").toUpperCase();

  const statusMap = {
    // Commitment / Delivery states
    COMPLETED: "success",
    PARTIAL: "warning",
    PENDING: "secondary",
    MISSED: "danger",

    // Risk engine states
    STABLE: "success",
    WARNING: "warning",
    UNSTABLE: "danger",

    // System
    ACTIVE: "success",
    INACTIVE: "secondary",
    UNKNOWN: "dark",
  };

  const color = statusMap[normalize(status)] || "secondary";

  return (
    <span className={`badge bg-${color} text-uppercase small`}>
      {normalize(status)}
    </span>
  );
};

export default StatusBadge;