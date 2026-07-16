import React, { useEffect, useState } from "react";
import { getSchoolDashboard } from "../../api/dashboardApi";

import SupplierTrustPanel from "../../panels/SupplierTrustPanel";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";

export default function SchoolDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSchoolDashboard()
      .then(setData)
      .catch(() => {
        setError("Failed to load dashboard");
      });
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loader text="Loading school dashboard..." />;

  // Derived metric (UI only — no backend changes)
  const completion =
    data.expected_total > 0
      ? (data.received_total / data.expected_total) * 100
      : 0;

  return (
    <div className="container-fluid py-3">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">School Intelligence Dashboard</h2>
        <p className="text-muted mb-0">
          Monitor expected deliveries, received quantities and supplier trust.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Expected Quantity</small>

              <h3 className="fw-bold mt-2">
                {data.expected_total}
              </h3>

              <small className="text-muted">
                Planned deliveries
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Received Quantity</small>

              <h3 className="fw-bold mt-2">
                {data.received_total}
              </h3>

              <small className="text-muted">
                Successfully received
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">

              <small className="text-muted">
                Fulfillment Progress
              </small>

              <h3 className="fw-bold mt-2">
                {completion.toFixed(1)}%
              </h3>

              <div
                className="progress mt-3"
                style={{ height: "8px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${completion}%`
                  }}
                  aria-valuenow={completion}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <SupplierTrustPanel
            trustScore={data.supplier_trust_avg}
          />
        </div>

      </div>

      {/* Intelligence Panel */}
      <div className="row">

        <div className="col-12">
          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                Delivery Intelligence
              </h5>

              <p className="text-muted mb-2">
                Expected Quantity:
                <strong> {data.expected_total}</strong>
              </p>

              <p className="text-muted mb-2">
                Received Quantity:
                <strong> {data.received_total}</strong>
              </p>

              <p className="text-muted mb-2">
                Completion:
                <strong> {completion.toFixed(1)}%</strong>
              </p>

              <hr />

              <p className="mb-0 text-muted">
                This dashboard compares what your school expected to receive
                against what has actually been delivered and verified. The
                fulfillment percentage and supplier trust score help you assess
                supplier performance objectively.
              </p>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}