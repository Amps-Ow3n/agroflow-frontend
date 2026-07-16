import React, { useEffect, useState } from "react";

import {
  getSupplierReliability
} from "../api/dashboardApi";

export default function DeliveryReliabilityPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getSupplierReliability();

        setData(response.reliability);
      } catch (error) {
        console.error(
          "Reliability loading failed",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function getRiskLabel(risk) {
    const labels = {
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      UNKNOWN: "Unknown"
    };

    return labels[risk] || risk;
  }

  function getRiskClass(risk) {
    const classes = {
      LOW: "bg-success",
      MEDIUM: "bg-warning text-dark",
      HIGH: "bg-danger",
      UNKNOWN: "bg-secondary"
    };

    return classes[risk] || "bg-secondary";
  }

  if (loading) {
    return (
      <div className="card shadow-sm p-3">
        Loading delivery reliability...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card shadow-sm p-3">
        No reliability data available.
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3 h-100">

      <h5 className="fw-bold mb-3">
        Delivery Reliability
      </h5>

      <div className="d-flex justify-content-between align-items-start">

        <div>
          <small className="text-muted">
            Observed reliability
          </small>

          <h2 className="fw-bold mb-0">
            {data.score}%
          </h2>
        </div>

        <span
          className={`badge ${getRiskClass(data.risk)}`}
        >
          Risk signal: {getRiskLabel(data.risk)}
        </span>

      </div>

      <div
        className="progress mt-3"
        style={{ height: "8px" }}
      >

        <div
          className={`progress-bar ${getRiskClass(
            data.risk
          )}`}
          style={{
            width: `${Math.min(data.score, 100)}%`
          }}
        />

      </div>

      <div className="mt-3">

        <div className="small text-muted">
          Deliveries observed:{" "}
          <strong className="text-dark">
            {data.delivery_count}
          </strong>
        </div>

        <div className="small text-muted">
          Fulfilled:{" "}
          <strong className="text-dark">
            {data.fulfilled}
          </strong>
        </div>

        <div className="small text-muted">
          Delayed:{" "}
          <strong className="text-dark">
            {data.delayed}
          </strong>
        </div>

        <div className="small text-muted">
          Quality failures:{" "}
          <strong className="text-dark">
            {data.quality_failures}
          </strong>
        </div>

      </div>

      <hr />

      <div className="small">

        <strong>
          Evidence confidence:{" "}
        </strong>

        <span className="text-muted">
          {data.confidence === "LOW_SAMPLE"
            ? "Low sample"
            : data.confidence}
        </span>

      </div>

      {data.confidence_message && (

        <div className="alert alert-warning mt-3 mb-0 small">

          {data.confidence_message}

        </div>

      )}

    </div>
  );
}