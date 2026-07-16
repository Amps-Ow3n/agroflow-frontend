import React, { useEffect, useState } from "react";

import {
  getReliabilityRanking
} from "../api/dashboardApi";

export default function ReliabilityRankingPanel() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getReliabilityRanking();

        setRanking(
          data.supplier_ranking || []
        );
      } catch (error) {
        console.error(
          "Reliability ranking loading failed",
          error
        );

        setRanking([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function getRiskLabel(risk) {
    const labels = {
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      UNKNOWN: "Unknown"
    };

    return labels[risk] || risk;
  }

  function getRiskClass(risk) {
    const classes = {
      LOW: "bg-success",
      MEDIUM: "bg-warning text-dark",
      HIGH: "bg-danger",
      UNKNOWN: "bg-secondary"
    };

    return classes[risk] || "bg-secondary";
  }

  if (loading) {
    return (
      <div className="card shadow-sm p-3">
        Loading reliability ranking...
      </div>
    );
  }

  if (!ranking.length) {
    return (
      <div className="card shadow-sm p-3">
        No reliability data available.
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3">

      <h5 className="fw-bold mb-3">
        Supplier Reliability Ranking
      </h5>

      {ranking.map((supplier, index) => {

        const reliability =
          supplier.reliability;

        return (

          <div
            key={supplier.supplier_id}
            className="border-bottom py-3"
          >

            <div className="d-flex justify-content-between">

              <div>

                <div className="fw-bold">
                  #{index + 1}{" "}
                  {supplier.supplier_name}
                </div>

                <div className="small text-muted">
                  {reliability.delivery_count}{" "}
                  delivery observation
                  {reliability.delivery_count === 1
                    ? ""
                    : "s"}
                </div>

              </div>

              <div className="text-end">

                <div className="fw-bold">
                  {reliability.score}%
                </div>

                <span
                  className={`badge ${getRiskClass(
                    reliability.risk
                  )}`}
                >
                  {getRiskLabel(
                    reliability.risk
                  )}
                </span>

              </div>

            </div>

            <div className="small text-muted mt-2">

              Confidence:{" "}

              {reliability.confidence ===
              "LOW_SAMPLE"
                ? "Low sample"
                : reliability.confidence}

            </div>

            {reliability.confidence_message && (

              <div className="small text-muted mt-1">

                {reliability.confidence_message}

              </div>

            )}

          </div>

        );
      })}

    </div>
  );
}