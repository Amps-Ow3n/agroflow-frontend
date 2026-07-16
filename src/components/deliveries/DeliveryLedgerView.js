import React from "react";
import DeliveryTruthCard from "./DeliveryTruthCard";

export default function DeliveryLedgerView({ deliveries }) {
  const grouped = deliveries.reduce((acc, d) => {
    const key = `${d.week_start} → ${d.week_end}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  return (
    <div className="d-flex flex-column gap-4">

      {Object.keys(grouped).length === 0 && (
        <div className="card p-3 text-muted">
          No delivery history yet
        </div>
      )}

      {Object.entries(grouped).map(([week, items]) => (
        <div key={week} className="card shadow-sm border-0 p-3">

          <h6 className="fw-bold mb-3">
            Week: {week}
          </h6>

          <div className="d-flex flex-column gap-2">
            {items.map((d) => (
              <DeliveryTruthCard key={d.id} delivery={d} />
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}