import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

const Reports = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiClient.get("/admin/report/term");

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
            "Failed to load system report",
        });
      }
    };

    fetchReport();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Generating system report..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  const r = state.data || {};

  return (
    <div className="card border-0 shadow-sm p-3">

      <h5 className="fw-bold mb-3">System Intelligence Report</h5>

      {/* SYSTEM SUMMARY */}
      <div className="row g-3 small">

        <div className="col-6 col-md-3">
          <div className="text-muted">Supply</div>
          <div className="fw-semibold">{r.system_summary?.total_supply ?? 0}</div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-muted">Committed</div>
          <div className="fw-semibold">{r.system_summary?.total_committed ?? 0}</div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-muted">Delivered</div>
          <div className="fw-semibold">{r.system_summary?.total_delivered ?? 0}</div>
        </div>

        <div className="col-6 col-md-3">
          <div className="text-muted">Fulfillment</div>
          <div className="fw-semibold">
            {r.system_summary?.fulfillment_rate ?? 0}%
          </div>
        </div>

      </div>

      {/* FARMER RISK LAYER */}
      <div className="mt-4">

        <h6 className="fw-bold mb-3">
          Farmer Risk Intelligence (Decision Layer)
        </h6>

        <div className="d-flex flex-column gap-2">

          {r.farmer_performance?.map((f, idx) => (
            <div key={idx} className="border rounded p-3 bg-light">

              <div className="fw-semibold">
                Farmer #{f.farmer_id}
              </div>

              <div
                className={`small fw-semibold ${
                  f.risk_level === "HIGH"
                    ? "text-danger"
                    : f.risk_level === "MEDIUM"
                    ? "text-warning"
                    : "text-success"
                }`}
              >
                {f.risk_level} Risk
              </div>

              <div className="small text-muted mt-1">
                {f.message}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Reports;