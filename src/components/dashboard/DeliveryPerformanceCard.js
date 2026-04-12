import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { clampPercentage } from "../../utils/calculatePercentage";
import { FaTruck } from "react-icons/fa";

const DeliveryPerformanceCard = ({ data }) => {
  if (!data) {
    return <EmptyState message="No delivery data available" />;
  }

  const completion = clampPercentage(data.completionRate ?? 0);

  const rating =
    completion >= 90 ? "Excellent" :
    completion >= 75 ? "Good" :
    completion >= 50 ? "Fair" :
    "Poor";

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaTruck className="text-success" />
        <h5 className="mb-0 fw-bold">Delivery Reliability</h5>
      </div>

      <div className="text-center">

        <h2 className="fw-bold mb-1">{completion}%</h2>
        <div className="text-muted mb-3">{rating}</div>

        <div className="progress mb-3" style={{ height: "10px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className="small text-muted">
          Missed: {data.missedDeliveries ?? 0} units
        </div>

      </div>
    </Card>
  );
};

export default DeliveryPerformanceCard;