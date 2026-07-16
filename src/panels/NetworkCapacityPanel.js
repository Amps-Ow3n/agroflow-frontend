import React, { useEffect, useState } from "react";

import {
  getNetworkCapacity
} from "../api/dashboardApi";

export default function NetworkCapacityPanel() {
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNetworkCapacity();

        setNetwork(
          data.network_capacity || []
        );
      } catch (error) {
        console.error(
          "Network capacity loading failed",
          error
        );

        setNetwork([]);
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
        Loading network capacity...
      </div>
    );
  }

  if (!network.length) {
    return (
      <div className="card shadow-sm p-3">
        No network capacity data available.
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3">

      <h5 className="fw-bold mb-3">
        Network Capacity
      </h5>

      {network.map((supplier) => (

        <div
          key={supplier.supplier_id}
          className="border-bottom py-3"
        >

          <h6 className="fw-bold mb-3">
            {supplier.supplier_name}
          </h6>

          {supplier.capacity.map((item, index) => (

            <div
              key={`${item.product}-${index}`}
              className="border rounded p-3 mb-2"
            >

              <div className="d-flex justify-content-between">

                <strong className="text-capitalize">
                  {item.product}
                </strong>

                <span
                  className={`badge ${getStatusClass(
                    item.status
                  )}`}
                >
                  {getStatusLabel(item.status)}
                </span>

              </div>

              <div className="small text-muted mt-2">
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
                style={{ height: "7px" }}
              >

                <div
                  className={`progress-bar ${getStatusClass(
                    item.status
                  )}`}
                  style={{
                    width: `${Math.min(
                      item.utilization,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}