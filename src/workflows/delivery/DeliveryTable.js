import React from "react";
import { formatDate } from "../../shared/utils/formatters";

const DeliveryTable = ({ deliveries, onUpdated }) => {
  if (!deliveries?.length) {
    return <p className="text-muted">No deliveries yet</p>;
  }

  return (
    <div className="table-responsive">

      <table className="table table-hover">

        <thead className="table-light">
          <tr>
            <th>Crop</th>
            <th>Qty</th>
            <th>Week</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((d) => (
            <tr key={d.id}>
              <td>{d.crop}</td>
              <td>{d.delivered_qty}</td>
              <td>
                {formatDate(d.week_start)} → {formatDate(d.week_end)}
              </td>
              <td>
                <span className="badge bg-secondary">
                  {d.status || "RECORDED"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default DeliveryTable;