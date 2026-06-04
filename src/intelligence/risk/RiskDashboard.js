import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import RiskAlerts from "./RiskAlerts";
import apiClient from "../../services/apiClient";

const RiskDashboard = () => {
  const [state, setState] = useState({
    summary: null,
    alerts: [],
    loading: true,
    error: null,
  });

  const fetchRisk = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await apiClient.get("/risk/overview");

      setState({
        summary: res.data?.summary || null,
        alerts: res.data?.alerts || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        summary: null,
        alerts: [],
        loading: false,
        error:
          err.response?.data?.detail ||
          "Failed to load risk intelligence",
      });
    }
  }, []);

  useEffect(() => {
    fetchRisk();
  }, [fetchRisk]);

  const getStatusBadge = (status) => {
    const map = {
      STABLE: "success",
      WARNING: "warning",
      UNSTABLE: "danger",
    };
    return map[status] || "secondary";
  };

  const sections = [{ id: "risk-alerts", label: "Alerts" }];

  return (
    <PageContainer
      title="Risk Intelligence Dashboard"
      interpretation="Predicts failure probability across supply, commitments, and delivery behavior."
    >
      <PageNav sections={sections} />

      {/* SUMMARY */}
      {state.summary && (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body d-flex justify-content-between flex-wrap">

            <div>
              <div className="text-muted small">System Status</div>
              <span
                className={`badge bg-${getStatusBadge(state.summary.system_state)}`}
              >
                {state.summary.system_state}
              </span>
            </div>

            <div>
              <div className="text-muted small">Avg Risk Score</div>
              <div className="fw-bold">
                {state.summary.avg_risk_score ?? "N/A"}
              </div>
            </div>

            <div>
              <div className="text-muted small">High Risk Farmers</div>
              <div className="fw-bold">
                {state.summary.high_risk_count ?? 0}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STATES */}
      {state.loading && (
        <LoadingSpinner message="Analyzing system risk..." />
      )}

      {!state.loading && state.error && (
        <EmptyState message={state.error} />
      )}

      {/* ALERTS */}
      {!state.loading && !state.error && (
        <div id="risk-alerts">
          <RiskAlerts alerts={state.alerts} />
        </div>
      )}
    </PageContainer>
  );
};

export default RiskDashboard;