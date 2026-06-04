import React from "react";

const DeliverySummary = ({ deliveries }) => {
  if (!deliveries?.length) return <p className="text-muted">No data</p>;

  const grouped = {};

  deliveries.forEach((d) => {
    const id = d.commitment_id;

    if (!grouped[id]) {
      grouped[id] = {
        crop: d.crop,
        committed: d.promised_qty || 0,
        delivered: 0,
      };
    }

    grouped[id].delivered += Number(d.delivered_qty || 0);
  });

  return (
    <div className="row g-3">

      {Object.values(grouped).map((g, i) => {
        const pct = g.committed
          ? Math.round((g.delivered / g.committed) * 100)
          : 0;

        return (
          <div key={i} className="col-md-6">

            <div className="card p-3 shadow-sm">

              <div className="d-flex justify-content-between">
                <strong>{g.crop}</strong>
                <span>{pct}%</span>
              </div>

              <div className="progress mt-2">
                <div
                  className="progress-bar"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <small className="text-muted mt-2">
                {g.delivered} / {g.committed}
              </small>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default DeliverySummary;