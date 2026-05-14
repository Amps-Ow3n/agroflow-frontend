import React from "react";
import AlertBox from "../ui/AlertBox";

const OvercommitmentAlert = ({ overcommitments }) => {
  if (!overcommitments || overcommitments.length === 0) return null;

  const worstOvercommit = Math.max(
    ...overcommitments.map((o) =>
      o.capacity > 0 ? (o.promised / o.capacity) * 100 : 0
    )
  );

  const severity =
    worstOvercommit >= 150
      ? "error"
      : worstOvercommit >= 110
      ? "warning"
      : "info";

  const grouped = {};

  overcommitments.forEach((o) => {
    const key = `${o.crop} - ${o.week}`;

    if (!grouped[key]) {
      grouped[key] = {
        totalPromised: 0,
        capacity: o.capacity,
        items: [],
      };
    }

    grouped[key].totalPromised += o.promised;
    grouped[key].items.push(`${o.promised} ${o.crop}`);
  });

  return (
    <div className="mb-3 position-sticky top-0" style={{ zIndex: 10 }}>

      <AlertBox
        type={severity}
        message={
          <div className="d-flex flex-column gap-3">

            {Object.entries(grouped).map(([key, g]) => {
              const percent = (g.totalPromised / g.capacity) * 100;

              return (
                <div key={key} className="small">

                  <div className="fw-bold">
                    ⚠ {key}
                  </div>
                  <div className="fw-semibold text-danger">
  CRITICAL: Exceeds capacity by {(percent - 100).toFixed(1)}%
</div>

<div className="small">
  Capacity: {g.capacity}
</div>

<div className="small">
  Total committed: {g.totalPromised}
</div>

<div className="small text-warning">
  Recommended action: Reduce commitments or stagger delivery windows
</div>
                  <div className="text-muted">
                    {g.items.join(", ")}
                  </div>

                </div>
              );
            })}

          </div>
        }
      />

    </div>
  );
};

export default OvercommitmentAlert;