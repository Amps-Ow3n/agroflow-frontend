import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { FaStar } from "react-icons/fa";

const ReliabilityScoreCard = ({ scores }) => {
  if (scores === null || scores === undefined) {
    return <EmptyState message="No reliability score available" />;
  }

  const score =
    typeof scores === "object"
      ? scores.score
      : scores;

  const safeScore = Math.round(score ?? 0);

  const label =
    safeScore >= 90 ? "Highly Reliable" :
    safeScore >= 75 ? "Reliable" :
    safeScore >= 50 ? "Moderate" :
    "Low Reliability";

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaStar className="text-success" />
        <h5 className="mb-0 fw-bold">Farmer Reliability</h5>
      </div>

      <div className="text-center">

        <h2 className="fw-bold mb-1">{safeScore}%</h2>
        <div className="text-muted mb-3">{label}</div>

        <div className="progress" style={{ height: "10px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${safeScore}%` }}
          />
        </div>

      </div>
    </Card>
  );
};

export default ReliabilityScoreCard;