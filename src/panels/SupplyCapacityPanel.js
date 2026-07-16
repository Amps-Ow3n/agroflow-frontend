import React, { useEffect, useState } from "react";

import {
  getSupplierCapacity
} from "../api/dashboardApi";

import EmptyState from "../components/common/EmptyState";

export default function SupplyCapacityPanel() {
  const [capacity, setCapacity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getSupplierCapacity();

        setCapacity(response.capacity || []);
      } catch (error) {
        console.error("Capacity loading failed", error);
        setCapacity([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function getStatusLabel(status) {
    const labels = {
      HEALTHY: "Healthy",
      HIGH_UTILIZATION: "High utilization",
      OVERCOMMITTED: "Overcommitted"
    };

    return labels[status] || status;
  }

  function getStatusClass(status) {
    const classes = {
      HEALTHY: "bg-success",
      HIGH_UTILIZATION: "bg-warning text-dark",
      OVERCOMMITTED: "bg-danger"
    };

    return classes[status] || "bg-secondary";
  }

  if (loading) {
    return (
      <div className="card shadow-sm p-3">
        Loading supply capacity...
      </div>
    );
  }

  if (!capacity.length) {
    return (
      <EmptyState
        title="No supply capacity data"
        description="No registered supply sources."
      />
    );
  }

  return (
    <div className="card shadow-sm p-3 h-100">

      <h5 className="fw-bold mb-3">
        Supply Capacity Intelligence
      </h5>

      {capacity.map((item, index) => (
        <div
          key={`${item.product}-${index}`}
          className="border-bottom py-3"
        >

          <div className="d-flex justify-content-between align-items-start mb-2">

            <strong className="text-capitalize">
              {item.product}
            </strong>

            <span
              className={`badge ${getStatusClass(item.status)}`}
            >
              {getStatusLabel(item.status)}
            </span>

          </div>

          <div className="small text-muted">
            Available:{" "}
            <strong className="text-dark">
              {item.available} kg
            </strong>
          </div>

          <div className="small text-muted">
            Committed:{" "}
            <strong className="text-dark">
              {item.committed} kg
            </strong>
          </div>

          {item.shortfall > 0 ? (

            <div className="small text-danger fw-semibold">
              Shortfall: {item.shortfall} kg
            </div>

          ) : (

            <div className="small text-muted">
              Remaining:{" "}
              <strong className="text-dark">
                {item.remaining} kg
              </strong>
            </div>

          )}

          <div className="small text-muted">
            Utilization:{" "}
            <strong className="text-dark">
              {item.utilization}%
            </strong>
          </div>

          <div
            className="progress mt-2"
            style={{ height: "8px" }}
          >

            <div
              className={`progress-bar ${getStatusClass(
                item.status
              )}`}
              style={{
                width: `${Math.min(item.utilization, 100)}%`
              }}
            />

          </div>

        </div>
      ))}

    </div>
  );
}