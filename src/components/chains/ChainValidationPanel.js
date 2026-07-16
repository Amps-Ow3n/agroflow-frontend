import React from "react";
import StatusBadge from "../common/StatusBadge";

export default function ChainValidationPanel({
  feasibility,
  risk,
}) {
  if (!feasibility && !risk) return null;

  return (
    <div className="card shadow-sm border-0 p-3">

      {/* HEADER */}
      <h5 className="fw-bold mb-3">
        Chain Validation Engine
      </h5>

      {/* STATUS GRID */}
      <div className="row g-3">

        {/* FEASIBILITY */}
        <div className="col-md-6">
          <div className="p-3 border rounded bg-light h-100">
            <div className="text-muted small mb-1">
              Feasibility Status
            </div>

            <StatusBadge
 status={feasibility?.status || "UNKNOWN"}
/>

            <div className="mt-2 small">
              Shortfall: <b>{feasibility?.shortfall ?? 0} kg</b>
            </div>
          </div>
        </div>

        {/* RISK */}
        <div className="col-md-6">
          <div className="p-3 border rounded bg-light h-100">
            <div className="text-muted small mb-1">
              Risk Analysis
            </div>

            <StatusBadge status={risk?.risk_level || "UNKNOWN"} />

            <div className="mt-2 small">
              Risk Score: <b>{risk?.risk_score || 0}</b>
            </div>
          </div>
        </div>

      </div>

      {/* INTERPRETATION LAYER (TYPE C THINKING) */}
      <div className="mt-3 p-3 border rounded bg-white">
        <h6 className="fw-bold">System Interpretation</h6>

        <p className="text-muted small mb-0">
          {feasibility?.feasible
            ? "System confirms supply capacity can satisfy commitment constraints."
            : "System detects supply constraint violations or timing conflicts."}
        </p>
      </div>

    </div>
  );
}