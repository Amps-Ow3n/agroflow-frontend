import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import DecisionTimeline from "./DecisionTimeline";
import apiClient from "../../services/apiClient";

const WhyCenter = () => {
  const [state, setState] = useState({
    reasons: [],
    loading: true,
    error: null,
  });

  const fetchReasons = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await apiClient.get("/decision-ledger");

      setState({
        reasons: res.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        reasons: [],
        loading: false,
        error:
          err.response?.data?.detail ||
          "Failed to load decision explanations",
      });
    }
  }, []);

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  const sections = [
    { id: "why-timeline", label: "Decision History" },
  ];

  return (
    <PageContainer
      title="Decision Ledger (Explainability Engine)"
      interpretation="Shows why the system made predictions, alerts, and classifications."
    >
      <PageNav sections={sections} />

      {/* STATES */}
      {state.loading && (
        <LoadingSpinner message="Reconstructing decision history..." />
      )}

      {!state.loading && state.error && (
        <EmptyState message={state.error} />
      )}

      {/* CONTENT */}
      {!state.loading && !state.error && (
        <div id="why-timeline" className="card border-0 shadow-sm">
          <div className="card-body">

            <h6 className="fw-bold mb-3">
              System Decision Timeline
            </h6>

            <DecisionTimeline events={state.reasons} />

          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default WhyCenter;