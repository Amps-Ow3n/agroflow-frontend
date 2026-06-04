import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import apiClient from "../../services/apiClient";

const FeasibilityDashboard = () => {
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: null,
  });

  const fetchFeasibility = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await apiClient.get("/feasibility/overview");

      setState({
        items: res.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        items: [],
        loading: false,
        error:
          err.response?.data?.detail ||
          "Failed to load feasibility data",
      });
    }
  }, []);

  useEffect(() => {
    fetchFeasibility();
  }, [fetchFeasibility]);

  const getColor = (score) => {
    if (score >= 0.8) return "success";
    if (score >= 0.5) return "warning";
    return "danger";
  };

  const sections = [{ id: "feasibility-grid", label: "Feasibility Map" }];

  return (
    <PageContainer
      title="Feasibility Intelligence Dashboard"
      interpretation="Evaluates whether commitments are realistically achievable based on supply constraints."
    >
      <PageNav sections={sections} />

      {/* STATES */}
      {state.loading && (
        <LoadingSpinner message="Computing feasibility constraints..." />
      )}

      {!state.loading && state.error && (
        <EmptyState message={state.error} />
      )}

      {/* GRID */}
      {!state.loading && !state.error && (
        <div id="feasibility-grid" className="row g-3">

          {state.items.length === 0 ? (
            <div className="col-12">
              <EmptyState message="No feasibility data available" />
            </div>
          ) : (
            state.items.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">

                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold">{item.crop}</h6>

                      <span
                        className={`badge bg-${getColor(item.feasibility_score)}`}
                      >
                        {Math.round(item.feasibility_score * 100)}%
                      </span>
                    </div>

                    <div className="text-muted small mt-2">
                      Farmer: {item.farmer || "Unknown"}
                    </div>

                    <div className="mt-2 small">
                      Supply Capacity: <strong>{item.supply_capacity}</strong>
                    </div>

                    <div className="small">
                      Committed: <strong>{item.committed}</strong>
                    </div>

                    <div className="small">
                      Delivery Window Fit:{" "}
                      <strong>{item.window_fit ? "YES" : "NO"}</strong>
                    </div>

                    <div className="progress mt-3" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${Math.round(
                            (item.feasibility_score || 0) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="small text-muted mt-2">
                      {item.reason || "Evaluated by feasibility engine"}
                    </div>

                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      )}
    </PageContainer>
  );
};

export default FeasibilityDashboard;