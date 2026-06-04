import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

const AdminOverview = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiClient.get("/dashboard/admin/overview");

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
            "Failed to load admin overview",
        });
      }
    };

    fetchOverview();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Loading system intelligence..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  const d = state.data || {};

  return (
    <div className="row g-3">

      {/* SYSTEM STATE */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>System State</h6>
          <h5>{d.system_state || "UNKNOWN"}</h5>
          <small className="text-muted">
            Overall stability of AgroFlow engine
          </small>
        </div>
      </div>

      {/* TOTAL FARMERS */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Active Farmers</h6>
          <h5>{d.total_farmers ?? 0}</h5>
          <small className="text-muted">
            Registered supply participants
          </small>
        </div>
      </div>

      {/* OVERCOMMITMENT RISK */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Overcommitment Load</h6>
          <h5>{d.overcommitment_rate ?? 0}%</h5>
          <small className="text-muted">
            System-wide constraint violation pressure
          </small>
        </div>
      </div>

      {/* GLOBAL RISK */}
      <div className="col-12">
        <div className="card border-0 shadow-sm p-3">
          <h6>Global Risk Interpretation</h6>

          <div
            className={`badge bg-${
              d.global_risk === "HIGH"
                ? "danger"
                : d.global_risk === "MEDIUM"
                ? "warning"
                : "success"
            }`}
          >
            {d.global_risk || "UNKNOWN"}
          </div>

          <p className="text-muted small mt-2 mb-0">
            {d.risk_summary ||
              "No system-level risk interpretation available"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminOverview;