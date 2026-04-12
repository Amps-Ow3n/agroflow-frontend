import React from "react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { FaExclamationTriangle } from "react-icons/fa";

const RiskAlertCard = ({ alerts, decisionData }) => {
  if (!alerts || alerts.length === 0) {
    return <EmptyState message="No risk signals detected" />;
  }

  const sorted = [...alerts].sort(
    (a, b) => (b.severity || 0) - (a.severity || 0)
  );

  const getWhyText = (crop, zone) => {
    if (!decisionData || !Array.isArray(decisionData)) return "";
    const entry = decisionData.find(
      d =>
        d.crop?.toLowerCase() === crop?.toLowerCase() &&
        (d.zone || "").toLowerCase() === (zone || "").toLowerCase()
    );
    return entry ? entry.why : "";
  };

  return (
    <Card>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaExclamationTriangle className="text-warning" />
        <h5 className="mb-0 fw-bold">Network Risk Signals</h5>
      </div>

      <div className="d-flex flex-column gap-2">
        {sorted.map((alert, idx) => {
          const color =
            alert.severity >= 8
              ? "alert alert-danger"
              : "alert alert-warning";

          const why = getWhyText(alert.crop, alert.zone);

          return (
            <div key={idx} className={`${color} rounded p-3`}>

              <div className="fw-semibold mb-1">
                {alert.message}
              </div>

              {why && (
                <div className="small">
                  {why.split("(")[0]}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RiskAlertCard;