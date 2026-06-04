import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";
import apiClient from "../../services/apiClient";

const BuyerOverview = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const res = await apiClient.get("/dashboard/buyer/overview");

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
            "Failed to load buyer dashboard",
        });
      }
    };

    fetchBuyer();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Loading market intelligence..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  const d = state.data || {};

  return (
    <div className="row g-3">

      {/* MARKET SUPPLY */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Total Supply Pool</h6>
          <h4>{d.total_supply_pool ?? 0}</h4>
          <small className="text-muted">
            Available agricultural output
          </small>
        </div>
      </div>

      {/* RELIABILITY */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Farmer Reliability</h6>
          <h4>{d.avg_reliability ?? 0}%</h4>
          <small className="text-muted">
            Historical delivery consistency
          </small>
        </div>
      </div>

      {/* RISK EXPOSURE */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm p-3">
          <h6>Market Risk</h6>

          <div className={`badge bg-${d.market_risk === "HIGH" ? "danger" : d.market_risk === "MEDIUM" ? "warning" : "success"}`}>
            {d.market_risk || "UNKNOWN"}
          </div>

          <p className="text-muted small mt-2 mb-0">
            {d.risk_note || "No risk data available"}
          </p>

        </div>
      </div>

    </div>
  );
};

export default BuyerOverview;