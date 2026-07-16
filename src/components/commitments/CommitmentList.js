import React from "react";
import CommitmentCard from "./CommitmentCard";
import EmptyState from "../common/EmptyState";

export default function CommitmentList({ commitments }) {
  if (!commitments || commitments.length === 0) {
    return (
      <div className="card border-0 shadow-sm p-4 text-center">
        <div className="mb-2 fw-bold">
          No commitments yet
        </div>

        <p className="text-muted small mb-3">
          Commitments represent binding delivery promises made to schools.
        </p>

        <div className="text-muted small">
          Once you accept a demand, it will appear here as a tracked obligation.
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">

      {/* SECTION HEADER (light UX structure, not logic) */}
      <div className="mb-2">
        <h6 className="fw-bold mb-1">
          Active Commitments Registry
        </h6>
        <p className="text-muted small mb-0">
          Track all delivery promises and their lifecycle status
        </p>
      </div>

      {/* LIST */}
      <div className="row g-3">

        {commitments.map((commitment) => (
          <div
            key={commitment.id}
            className="col-12 col-md-6 col-lg-6"
          >
            <CommitmentCard commitment={commitment} />
          </div>
        ))}

      </div>

    </div>
  );
}