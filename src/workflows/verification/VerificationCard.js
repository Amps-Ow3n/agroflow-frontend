import React from "react";

const statusColor = (status) => {
  switch (status) {
    case "STABLE":
      return "success";
    case "WARNING":
      return "warning";
    case "UNSTABLE":
      return "danger";
    default:
      return "secondary";
  }
};

const VerificationCard = ({ item }) => {
  if (!item) return null;

  const {
    farmer_name,
    crop,
    supply_capacity,
    total_committed,
    total_delivered,
    risk_state,
    risk_score,
    explanation_summary,
    inconsistency_flags = [],
  } = item;

  const completion =
    total_committed > 0
      ? Math.round((total_delivered / total_committed) * 100)
      : 0;

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">
            {farmer_name || "Unknown Farmer"}
          </h6>

          <span className={`badge bg-${statusColor(risk_state)}`}>
            {risk_state || "UNKNOWN"}
          </span>
        </div>

        <div className="text-muted small mb-2">
          Crop: <strong>{crop || "-"}</strong>
        </div>

        {/* CONSISTENCY METRICS */}
        <div className="small mb-2">
          Supply Capacity: <strong>{supply_capacity}</strong>
        </div>

        <div className="small">
          Committed: <strong>{total_committed}</strong>
        </div>

        <div className="small mb-2">
          Delivered: <strong>{total_delivered}</strong>
        </div>

        {/* PROGRESS */}
        <div className="progress mb-2" style={{ height: "7px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${Math.min(completion, 100)}%` }}
          />
        </div>

        <div className="small text-muted mb-2">
          Fulfillment: {completion}%
        </div>

        {/* RISK */}
        <div className="small">
          Risk Score: <strong>{risk_score ?? "N/A"}</strong>
        </div>

        {/* INCONSISTENCIES */}
        {inconsistency_flags.length > 0 && (
          <div className="mt-2">
            <div className="text-danger small fw-semibold">
              Inconsistencies:
            </div>
            <ul className="small mb-0 text-danger">
              {inconsistency_flags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* EXPLANATION */}
        {explanation_summary && (
          <div className="mt-2 small text-muted border-top pt-2">
            <strong>Why:</strong> {explanation_summary}
          </div>
        )}

      </div>
    </div>
  );
};

export default VerificationCard;