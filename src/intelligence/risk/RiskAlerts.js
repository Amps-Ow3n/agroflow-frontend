import React from "react";

const severityColor = (level) => {
  switch (level) {
    case "CRITICAL":
      return "danger";
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "info";
    default:
      return "secondary";
  }
};

const RiskAlerts = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-muted small">
        No active risk alerts — system stable.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">

      {alerts.map((alert, idx) => (
        <div key={idx} className="card border-0 shadow-sm">
          <div className="card-body py-2">

            <div className="d-flex justify-content-between align-items-center">

              <div>
                <div className="fw-semibold">
                  {alert.title || "Risk Alert"}
                </div>

                <div className="text-muted small">
                  Farmer: {alert.farmer || "Unknown"} | Crop: {alert.crop || "-"}
                </div>
              </div>

              <span className={`badge bg-${severityColor(alert.level)}`}>
                {alert.level || "INFO"}
              </span>

            </div>

            <div className="small text-muted mt-2">
              {alert.message}
            </div>

            {alert.recommendation && (
              <div className="small text-success mt-1">
                Recommendation: {alert.recommendation}
              </div>
            )}

          </div>
        </div>
      ))}

    </div>
  );
};

export default RiskAlerts;