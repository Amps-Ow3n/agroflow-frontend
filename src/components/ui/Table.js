import React, { useState } from "react";

const Table = ({
  columns,
  data = [],
  riskField = null,
  expandable = false,
  renderExpanded = null,
}) => {
  const [openRow, setOpenRow] = useState(null);

  const riskRowStyles = {
    low: "",
    medium: "bg-warning bg-opacity-10",
    high: "bg-danger bg-opacity-10",
    critical: "bg-danger bg-opacity-25",
  };

  const statusBadge = (value) => {
    if (!value || typeof value !== "object") return value;

    const colors = {
      success: "bg-success-subtle text-success",
      warning: "bg-warning-subtle text-warning",
      critical: "bg-danger-subtle text-danger",
      info: "bg-primary-subtle text-primary",
    };

    return (
      <span className={`px-2 py-1 rounded-pill small fw-medium ${colors[value.status] || "bg-light"}`}>
        {value.label}
      </span>
    );
  };

  return (
    <div className="table-responsive rounded-3 border bg-white shadow-sm">

      <table className="table table-hover align-middle mb-0">

        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-3 py-2 small text-muted fw-semibold"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-muted small">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const risk = riskField ? row[riskField] : null;

              return (
                <React.Fragment key={idx}>

                  <tr
                    className={`${risk ? riskRowStyles[risk] : ""}`}
                    style={{ cursor: expandable ? "pointer" : "default" }}
                    onClick={() =>
                      expandable && setOpenRow(openRow === idx ? null : idx)
                    }
                  >
                    {columns.map((col, i) => (
                      <td
                        key={col.accessor}
                        className={`px-3 py-2 small ${
                          i === 0 ? "fw-semibold text-dark" : ""
                        }`}
                      >
                        {statusBadge(row[col.accessor])}
                      </td>
                    ))}
                  </tr>

                  {expandable && openRow === idx && renderExpanded && (
                    <tr className="bg-light">
                      <td colSpan={columns.length} className="p-3 small text-muted">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              );
            })
          )}

        </tbody>

      </table>
    </div>
  );
};

export default Table;