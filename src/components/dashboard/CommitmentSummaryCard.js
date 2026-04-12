import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { calculatePercentage } from "../../utils/calculatePercentage";
import { FaClipboardList } from "react-icons/fa";

const CommitmentSummaryCard = ({ data, decisionData }) => {
  const commitments = Array.isArray(data) ? data : Object.values(data || {});

  if (!commitments.length) {
    return <EmptyState message="No commitments recorded" />;
  }

  const getWhyEntry = (crop, zone) => {
    if (!decisionData || !Array.isArray(decisionData)) return null;
    return decisionData.find(
      d =>
        d.crop?.toLowerCase() === crop?.toLowerCase() &&
        d.zone?.toLowerCase() === zone?.toLowerCase()
    );
  };

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaClipboardList className="text-success" />
        <h5 className="mb-0 fw-bold">Commitment Utilization</h5>
      </div>

      <div className="d-flex flex-column gap-3">
        {commitments.map((c, idx) => {
          const rawUsage = c.total_capacity
            ? calculatePercentage(c.total_promised, c.total_capacity)
            : 0;

          const usage = Math.round(rawUsage);

          const color =
            usage > 100 ? "bg-dark" :
            usage > 90 ? "bg-danger" :
            usage > 70 ? "bg-warning" :
            "bg-success";

          const whyEntry = getWhyEntry(c.crop, c.zone);

          return (
            <div key={idx} className="border rounded p-3 bg-light">

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2">
                <div className="fw-semibold">
                  {c.crop} — {c.zone}
                </div>
                <div className="fw-bold">
                  {usage}% {usage > 100 && "⚠️"}
                </div>
              </div>

              <div className="progress mb-2" style={{ height: "8px" }}>
                <div
                  className={`progress-bar ${color}`}
                  style={{ width: `${Math.min(usage, 100)}%` }}
                />
              </div>

              <div className="small text-muted">
                {c.total_promised} / {c.total_capacity} units committed
              </div>

              {whyEntry && (
                <div className="small text-warning mt-2">
                  ⚠ {whyEntry.why.split("(")[0]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CommitmentSummaryCard;