import React from "react";
import StatusBadge from "../common/StatusBadge";

export default function CommitmentCard({ commitment }) {
  const getStatus = () => {

return commitment.status || "PENDING";

};
  return (
    <div className="card shadow-sm border-0 p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-bold mb-1">
            {commitment.product}
          </h6>

          <div className="text-muted small">
            School ID: {commitment.school_id}
          </div>
        </div>

        <StatusBadge status={getStatus()} />
      </div>

      {/* CORE METRICS */}
      <div className="row g-2 mt-2">

        <div className="col-6">
          <div className="border rounded p-2 bg-light">
            <div className="text-muted small">Promised Qty</div>
            <div className="fw-bold">
              {commitment.promised_qty} kg
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="border rounded p-2 bg-light">
            <div className="text-muted small">Status</div>
            <div className="fw-bold">
              {getStatus()}
            </div>
          </div>
        </div>
      </div>

      {/* TIME WINDOW (CRITICAL TYPE C SIGNAL) */}
      <div className="mt-3 p-2 border-start border-4 border-primary bg-light rounded">
        <div className="text-muted small">Delivery Window</div>
        <div className="fw-semibold">
          {commitment.delivery_start} → {commitment.delivery_end}
        </div>
      </div>

      {/* TYPE C INTERPRETATION LAYER */}
      <div className="mt-3 text-muted small">
        <strong>Interpretation:</strong>{" "}
        This is a contractual promise, not physical inventory.
      </div>

    </div>
  );
}