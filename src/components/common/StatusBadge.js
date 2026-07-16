import React from "react";

export default function StatusBadge({ status }) {
  const map = {
    FEASIBLE: "bg-green-100 text-green-700",
    SHORTFALL: "bg-yellow-100 text-yellow-700",
    UNFULFILLABLE: "bg-red-100 text-red-700",

    RELIABLE: "bg-green-100 text-green-700",
    MODERATE: "bg-yellow-100 text-yellow-700",
    HIGH_RISK: "bg-red-100 text-red-700",

    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
    CRITICAL: "bg-red-200 text-red-900",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded font-medium ${
        map[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}