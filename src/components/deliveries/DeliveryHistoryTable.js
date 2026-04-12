import React from "react";
import EmptyState from "../ui/EmptyState";
import { formatDate } from "../../utils/formatDate";

const DeliveryHistoryTable = ({ deliveries, onEdit, onDelete }) => {
  if (!deliveries || deliveries.length === 0) {
    return <EmptyState message="No deliveries logged yet" />;
  }

  const statusBadge = (status) => {
    const colors = {
      COMPLETED: "success",
      PARTIAL: "warning",
      MISSED: "danger",
    };

    return (
      <span className={`badge bg-${colors[status] || "secondary"}`}>
        {status || "UNKNOWN"}
      </span>
    );
  };

  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body p-0">

        <div className="table-responsive">
          <table className="table align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>Crop</th>
                <th>Qty</th>
                <th>Week Start</th>
                <th>Week End</th>
                <th className="text-center">Status / Actions</th>
              </tr>
            </thead>

            <tbody>
              {deliveries
                .filter((d) => d && typeof d === "object")
                .map((d) => (
                  <tr key={d.id || Math.random()}>

                    <td className="fw-semibold">{d.crop || "-"}</td>
                    <td>{d.delivered_qty ?? "-"}</td>
                    <td>{formatDate(d.week_start)}</td>
                    <td>{formatDate(d.week_end)}</td>

                    <td style={{ minWidth: "160px" }}>
                      <div className="d-flex flex-column align-items-center">

                        {statusBadge(d.status)}

                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(d)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(d.id)}
                          >
                            Delete
                          </button>
                        </div>

                      </div>
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

export default DeliveryHistoryTable;