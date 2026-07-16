import React from "react";
import StatusBadge from "../components/common/StatusBadge";

export default function ChainSafetyPanel({ risk }) {
  if (!risk) return null;

  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <h3 className="font-bold mb-3">
        Chain Safety Analysis
      </h3>

      <div className="flex items-center gap-3 mb-2">
        <span>Risk Level:</span>
        <StatusBadge status={risk.risk_level} />
      </div>

      <p className="text-sm text-gray-600">
        Risk Score: {risk.risk_score}
      </p>

      <p className="text-sm text-gray-600 mt-2">
        This chain is evaluated based on dependency
        depth and transition complexity.
      </p>
    </div>
  );
}