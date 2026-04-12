import React from "react";

const DeliverySummary = ({ deliveries }) => {
  if (!deliveries || deliveries.length === 0) {
    return <p className="text-muted">No delivery data available</p>;
  }

  const grouped = {};

  deliveries.forEach((d) => {
    const key = d.commitment_id;

    if (!grouped[key]) {
      grouped[key] = {
        crop: d.crop,
        commitment_id: key,
        totalDelivered: 0,
        commitmentQty: d.promised_qty || 0,
        records: [],
      };
    }

    grouped[key].totalDelivered += d.delivered_qty;
    grouped[key].records.push(d);
  });

  return (
    <div className="row g-3">

      {Object.values(grouped).map((item) => {
        const completion =
          item.commitmentQty > 0
            ? Math.round((item.totalDelivered / item.commitmentQty) * 100)
            : 0;

        let status = "COMPLETED";
        let risk = "On Track";
        let why = "Delivery meets commitment";

        if (completion < 100) {
          status = "PARTIAL";
          risk = "Under-delivering";
          why = "Total delivered is below committed quantity";
        }

        if (completion > 100) {
          status = "OVER";
          risk = "Over-delivering";
          why = "Delivered quantity exceeds commitment";
        }

        return (
          <div key={item.commitment_id} className="col-12 col-md-6">

            <div className="card border-0 shadow-sm h-100 p-3">

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">{item.crop}</h6>
                <span className="fw-bold">{completion}%</span>
              </div>

              <div className="progress mb-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="small text-muted">
                {item.totalDelivered} / {item.commitmentQty} delivered
              </div>

              <div className="mt-2 text-warning small">
                {risk}
              </div>

              <div className="small text-muted mt-1">
                WHY: {item.why_reason || why}
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default DeliverySummary;