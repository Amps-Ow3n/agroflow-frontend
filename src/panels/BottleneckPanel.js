import React, { useEffect, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import {
  getSystemBottlenecks,
  getSupplierBottlenecks,
} from "../api/dashboardApi";

export default function BottleneckPanel({
  mode = "system",
}) {
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          mode === "supplier"
            ? await getSupplierBottlenecks()
            : await getSystemBottlenecks();

        setBottlenecks(data);
      } catch (err) {
        console.error("Failed to load bottlenecks", err);
        setBottlenecks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mode]);

  if (loading) {
    return (
      <div className="border rounded p-4 bg-white shadow-sm">
        Loading bottlenecks...
      </div>
    );
  }

  if (!bottlenecks.length) {
    return (
      <EmptyState
        title="No bottlenecks"
        description="Supply flow is healthy."
      />
    );
  }

  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <h5 className="fw-bold mb-3">
 Supply Capacity Intelligence
</h5>

      {bottlenecks.map((b) => (
        <div
          key={b.source_id}
          className="border-bottom py-3"
        >
          <div className="fw-semibold">
            {b.product}
          </div>

          <div className="text-muted small">
            Supplier: {b.actor_name}
          </div>

          <div className="mt-2">
            Available Capacity: <strong>{b.available} kg</strong>
          </div>

          <div>
            Committed Capacity: <strong>{b.allocated} kg</strong>
          </div>

          <div>
            Utilization:{" "}
            <strong>{b.utilization}%</strong>
          </div>

          <div className="progress mt-2">
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${Math.min(
                  b.utilization,
                  100
                )}%`,
              }}
              aria-valuenow={b.utilization}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      ))}
    </div>
  );
}