import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";
import apiClient from "../../services/apiClient";

const FarmerOverview = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiClient.get("/dashboard/farmer/overview");

        setState({
          data: res.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error:
            err.response?.data?.detail ||
            "Failed to load farmer overview",
        });
      }
    };

    fetchOverview();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Loading farmer intelligence..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  const d = state.data || {};

  return (
    <div className="row g-3">

      {/* CAPACITY */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Supply Capacity</h6>
          <h4>{d.total_supply ?? 0}</h4>
          <small className="text-muted">
            Total registered production potential
          </small>
        </div>
      </div>

      {/* COMMITMENTS */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Commitments</h6>
          <h4>{d.total_commitments ?? 0}</h4>
          <small className="text-muted">
            Active promises to deliver
          </small>
        </div>
      </div>

      {/* DELIVERY ACCURACY */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Delivery Accuracy</h6>
          <h4>{d.delivery_accuracy ?? 0}%</h4>
          <small className="text-muted">
            Fulfillment vs commitment alignment
          </small>
        </div>
      </div>

      {/* RISK */}
      <div className="col-12">
        <div className="card border-0 shadow-sm p-3">
          <h6>Risk Status</h6>

          <div className={`badge bg-${d.risk_level === "HIGH" ? "danger" : d.risk_level === "MEDIUM" ? "warning" : "success"}`}>
            {d.risk_level || "UNKNOWN"}
          </div>

          <p className="text-muted small mt-2 mb-0">
            {d.risk_summary || "No risk interpretation available"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default FarmerOverview;