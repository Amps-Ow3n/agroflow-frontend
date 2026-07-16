import React from "react";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";

export default function ChainValidationModal({
  open,
  onClose,
  feasibility,
  risk,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-[500px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Chain Validation
        </h2>

        <div className="mb-4">
          <p className="mb-2">Feasibility</p>
          <StatusBadge
            status={
              feasibility?.feasible
                ? "FEASIBLE"
                : "SHORTFALL"
            }
          />
        </div>

        <div className="mb-4">
          <p>
            Shortfall: {feasibility?.shortfall || 0}
          </p>
        </div>

        <div className="mb-4">
          <p>Risk Level</p>
          <StatusBadge
            status={risk?.risk_level || "UNKNOWN"}
          />
        </div>

        <div className="mb-4">
          <p>Risk Score: {risk?.risk_score || 0}</p>
        </div>

        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}