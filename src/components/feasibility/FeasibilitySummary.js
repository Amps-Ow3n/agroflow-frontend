import React, { useState } from "react";
import EmptyState from "../ui/EmptyState";
import Card from "../ui/Card";
import { normalizeCrop, isSupportedCrop } from "../../utils/cropNormalizer";

const FeasibilitySummary = ({ feasibility }) => {
  const [showCalculation, setShowCalculation] = useState(false);

  if (!feasibility) {
    return <EmptyState message="No feasibility data available" />;
  }

  const groupedFeasible = {};
  feasibility.feasible_commitments.forEach((c) => {
    const key = `${c.crop} - ${c.week}`;
    if (!groupedFeasible[key]) groupedFeasible[key] = { total: 0, items: [] };
    groupedFeasible[key].total += c.promised;
    groupedFeasible[key].items.push(c);
  });

  const isFeasible =
    feasibility.over_commitments?.length === 0;

  return (
    <div className="d-flex flex-column gap-4">

      {/* HEADER CARD */}
      <Card>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">

          <div>
            <h5 className="fw-bold mb-1">
              Feasibility Verdict:{" "}
              <span className={isFeasible ? "text-success" : "text-danger"}>
                {isFeasible ? "Feasible" : "Not Feasible"}
              </span>
            </h5>

            <div className="small text-muted">
              Confidence: {feasibility.confidence_score || 0}%
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => setShowCalculation(!showCalculation)}
          >
            {showCalculation ? "Hide calculation" : "Show calculation"}
          </button>

        </div>

        {/* CALCULATION SECTION */}
        {showCalculation && (
          <div className="bg-light border rounded p-3 mb-3">

            <div className="fw-semibold small text-muted mb-2">
              Calculation Breakdown
            </div>

            <div className="table-responsive">
              <table className="table table-sm table-bordered mb-0">

                <thead className="table-light">
                  <tr>
                    <th>Crop</th>
                    <th>Week</th>
                    <th>Promised</th>
                    <th>Capacity</th>
                    <th>Util%</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(feasibility.calculation_details).map(
                    ([key, value], idx) => {
                      const cleaned = key.replace(/[()']/g, "");
                      const [cropRaw, week] = cleaned.split(", ");
                      const normalizedCrop = normalizeCrop(cropRaw);

                      const utilization =
                        value.capacity > 0
                          ? (value.promised / value.capacity) * 100
                          : 0;

                      return (
                        <tr
                          key={idx}
                          className={
                            !isSupportedCrop(normalizedCrop)
                              ? "table-danger"
                              : ""
                          }
                        >
                          <td className="fw-semibold">{normalizedCrop}</td>
                          <td>{week}</td>
                          <td>{value.promised}</td>
                          <td>{value.capacity}</td>
                          <td>{utilization.toFixed(1)}%</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {/* FEASIBLE TABLE */}
        {feasibility.feasible_commitments?.length === 0 ? (
          <EmptyState message="No feasible commitments at the moment" />
        ) : (
          <div className="table-responsive border rounded">

            <table className="table table-sm table-hover mb-0">

              <thead className="table-light">
                <tr>
                  <th>Crop / Week</th>
                  <th>Promised</th>
                  <th>Capacity</th>
                  <th>Util%</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groupedFeasible).map(([key, g], idx) => {
                  const [crop, week] = key.split(" - ");
                  const normalizedCrop = normalizeCrop(crop);

                  const capacity = g.items[0]?.capacity || 0;
                  const utilization =
                    capacity > 0 ? (g.total / capacity) * 100 : 0;

                  return (
                    <tr
                      key={idx}
                      className={
                        !isSupportedCrop(normalizedCrop)
                          ? "table-danger"
                          : ""
                      }
                    >
                      <td className="fw-semibold">
                        {normalizedCrop} / {week}
                      </td>

                      <td>{g.total}</td>
                      <td>{capacity}</td>
                      <td>{utilization.toFixed(1)}%</td>

                      <td>
                        <div className="small text-muted">
                          {g.items.map((item, i) => (
                            <div key={i}>
                              {item.promised} {item.crop}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </Card>
    </div>
  );
};

export default FeasibilitySummary;