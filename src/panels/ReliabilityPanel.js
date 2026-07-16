import React from "react";
import StatusBadge from "../components/common/StatusBadge";

export default function ReliabilityPanel({
  reliabilityScore,
  riskLevel,
}) {
  if (reliabilityScore === undefined) return null;

  const getColor = () => {
    if (reliabilityScore >= 80) return "bg-success";
    if (reliabilityScore >= 60) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="card shadow-sm border-0 p-3 h-100">
      <h6 className="fw-bold mb-3">Reliability Engine</h6>

      {/* SCORE */}
      <div className="d-flex align-items-end justify-content-between">
        <div>
          <h2 className="fw-bold mb-0">{reliabilityScore}%</h2>
          <small className="text-muted">Fulfillment Reliability</small>
        </div>

        <StatusBadge status={riskLevel} />
      </div>

      {/* MINI PROGRESS BAR */}
      <div className="progress mt-3" style={{ height: "8px" }}>
        <div
          className={`progress-bar ${getColor()}`}
          style={{ width: `${reliabilityScore}%` }}
        />
      </div>

      <small className="text-muted mt-2 d-block">
        Based on promised vs delivered fulfillment consistency
      </small>
    </div>
  );
}