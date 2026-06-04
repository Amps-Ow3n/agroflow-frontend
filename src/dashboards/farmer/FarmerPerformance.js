import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";
import apiClient from "../../services/apiClient";

const FarmerPerformance = () => {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await apiClient.get("/dashboard/farmer/performance");

        setState({
          data: res.data || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          data: [],
          loading: false,
          error:
            err.response?.data?.detail ||
            "Failed to load performance data",
        });
      }
    };

    fetchPerformance();
  }, []);

  if (state.loading) {
    return <LoadingSpinner message="Analyzing farmer performance..." />;
  }

  if (state.error) {
    return <EmptyState message={state.error} />;
  }

  if (!state.data.length) {
    return <EmptyState message="No performance history available" />;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">

        <h6 className="fw-bold mb-3">Performance Trends</h6>

        <div className="table-responsive">
          <table className="table table-sm align-middle">

            <thead className="table-light">
              <tr>
                <th>Period</th>
                <th>Commitments</th>
                <th>Delivered</th>
                <th>Accuracy</th>
                <th>Risk</th>
              </tr>
            </thead>

            <tbody>
              {state.data.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.period}</td>
                  <td>{p.commitments}</td>
                  <td>{p.delivered}</td>
                  <td>{p.accuracy}%</td>

                  <td>
                    <span
                      className={`badge bg-${
                        p.risk === "HIGH"
                          ? "danger"
                          : p.risk === "MEDIUM"
                          ? "warning"
                          : "success"
                      }`}
                    >
                      {p.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default FarmerPerformance;