import React, { useEffect, useState } from "react";

import {
  getRiskAlerts
} from "../api/dashboardApi";

export default function RiskAlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getRiskAlerts();

        setAlerts(
          data.alerts || []
        );
      } catch (error) {
        console.error(
          "Risk alerts loading failed",
          error
        );

        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function getTypeLabel(type) {
    const labels = {
      CAPACITY: "Capacity",
      RELIABILITY: "Reliability"
    };

    return labels[type] || type;
  }

  function getSeverityLabel(severity) {
    const labels = {
      HIGH: "High",
      MEDIUM: "Medium",
      LOW: "Low"
    };

    return labels[severity] || severity;
  }

  function getSeverityClass(severity) {
    const classes = {
      HIGH: "bg-danger",
      MEDIUM: "bg-warning text-dark",
      LOW: "bg-success"
    };

    return classes[severity] || "bg-secondary";
  }

  if (loading) {
    return (
      <div className="card shadow-sm p-3">
        Loading risk alerts...
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3">

      <h5 className="fw-bold mb-3">
        Risk Alerts
      </h5>

      {alerts.length === 0 ? (

        <p className="text-muted mb-0">
          No active risks detected.
        </p>

      ) : (

        alerts.map((alert, index) => (

          <div
            key={`${alert.type}-${alert.supplier_id}-${alert.product || index}`}
            className="border-bottom py-3"
          >

            <div className="d-flex justify-content-between align-items-start">

              <div>

                <div className="small text-muted text-uppercase">
                  {getTypeLabel(alert.type)}
                </div>

                <div className="fw-bold">
                  {alert.supplier_name}
                </div>

                {alert.product && (

                  <div className="text-capitalize">
                    {alert.product}
                  </div>

                )}

              </div>

              <span
                className={`badge ${getSeverityClass(
                  alert.severity
                )}`}
              >
                {getSeverityLabel(
                  alert.severity
                )}
              </span>

            </div>

            {alert.type === "CAPACITY" && (

              <div className="small mt-2">

                <div>
                  Available:{" "}
                  {alert.available} kg
                </div>

                <div>
                  Committed:{" "}
                  {alert.committed} kg
                </div>

                <div className="text-danger fw-semibold">
                  Shortfall:{" "}
                  {alert.shortfall} kg
                </div>

              </div>

            )}

            {alert.type === "RELIABILITY" && (

              <div className="small mt-2">

                <div>
                  Observed score:{" "}
                  <strong>
                    {alert.score}%
                  </strong>
                </div>

                <div>
                  Evidence:{" "}
                  {alert.delivery_count} delivery
                  {alert.delivery_count === 1
                    ? ""
                    : " observations"}
                </div>

                <div className="text-muted mt-1">
                  {alert.confidence_message}
                </div>

              </div>

            )}

            <div className="small text-muted mt-2">
              {alert.message}
            </div>

          </div>

        ))

      )}

    </div>
  );
}