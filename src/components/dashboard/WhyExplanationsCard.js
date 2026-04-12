import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { FaLightbulb } from "react-icons/fa";

const WhyExplanationCard = ({ decisionData }) => {
  const items = Array.isArray(decisionData) ? decisionData : [];

  if (items.length === 0) {
    return <EmptyState message="No WHY explanations available" />;
  }

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaLightbulb className="text-warning" />
        <h5 className="mb-0 fw-bold">Decision Intelligence (WHY)</h5>
      </div>

      <div className="d-flex flex-column gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded p-3 bg-light">

            <div className="fw-semibold mb-2">
              {item.crop} — {item.zone || "-"}
            </div>

            <div className="small text-danger">
              {item.why}
            </div>

          </div>
        ))}
      </div>
    </Card>
  );
};

export default WhyExplanationCard;