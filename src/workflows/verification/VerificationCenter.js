import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import VerificationCard from "./VerificationCard";
import apiClient from "../../services/apiClient";

const VerificationCenter = () => {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchVerification = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      // V2 INTEL LAYER: expected backend aggregation endpoint
      const res = await apiClient.get("/verification/overview");

      const data = res.data || [];

      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error:
          err.response?.data?.detail ||
          "Failed to load verification intelligence",
      });
    }
  }, []);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  const sections = [
    { id: "verification-grid", label: "Truth Map" },
  ];

  return (
    <PageContainer
      title="Verification Intelligence Center"
      interpretation="System-wide consistency check across supply, commitments, and deliveries."
    >
      <PageNav sections={sections} />

      {/* HEADER STATE */}
      <div className="mb-3 text-muted small">
        Detects mismatches between capacity, intent, and execution.
      </div>

      {/* STATES */}
      {state.loading && (
        <LoadingSpinner message="Evaluating system consistency..." />
      )}

      {!state.loading && state.error && (
        <EmptyState message={state.error} />
      )}

      {/* GRID */}
      {!state.loading && !state.error && (
        <div id="verification-grid" className="row g-3">

          {state.data.length === 0 ? (
            <div className="col-12">
              <EmptyState message="No verification data available" />
            </div>
          ) : (
            state.data.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <VerificationCard item={item} />
              </div>
            ))
          )}

        </div>
      )}
    </PageContainer>
  );
};

export default VerificationCenter;