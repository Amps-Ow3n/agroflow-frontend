import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatDate } from "../../utils/formatDate";
import { FaSeedling } from "react-icons/fa";

const SupplySummaryCard = ({ data, decisionData }) => {
  const supplySummary = Array.isArray(data)
    ? data
    : Object.values(data || {});

  if (!supplySummary.length) {
    return <EmptyState message="No supply capacity recorded" />;
  }

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaSeedling className="text-success" />
        <h5 className="mb-0 fw-bold">Supply Capacity</h5>
      </div>

      <div className="d-flex flex-column gap-3">
        {supplySummary.map((s, idx) => (
          <div key={idx} className="border rounded p-3 bg-light">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">

              <div>
                <div className="fw-semibold">{s.crop}</div>
                <div className="small text-muted">{s.zone}</div>
              </div>

              <div className="text-md-end mt-2 mt-md-0">
                <div className="fw-bold text-success">
                  {s.total_capacity ?? 0}
                </div>
                <div className="small text-muted">
                  {s.last_updated ? formatDate(s.last_updated) : "-"}
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </Card>
  );
};

export default SupplySummaryCard;