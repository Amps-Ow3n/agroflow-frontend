import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

const SystemHealth = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await apiClient.get("/dashboard/admin/system-health");

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
            "Failed to load system health",
        });
      }
    };

    fetchHealth();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Checking system health..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  const d = state.data || {};

  return (
    <div className="row g-3">

      <div className="col-12 col-md-4">
        <div className="card p-3 border-0 shadow-sm">
          <h6>Supply Integrity</h6>
          <h4>{d.supply_integrity ?? 0}%</h4>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card p-3 border-0 shadow-sm">
          <h6>Commitment Stability</h6>
          <h4>{d.commitment_stability ?? 0}%</h4>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card p-3 border-0 shadow-sm">
          <h6>Delivery Reliability</h6>
          <h4>{d.delivery_reliability ?? 0}%</h4>
        </div>
      </div>

      <div className="col-12">
        <div className="card p-3 border-0 shadow-sm">
          <h6>System Diagnosis</h6>
          <p className="text-muted mb-0">
            {d.diagnosis || "No diagnostic report available"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default SystemHealth;