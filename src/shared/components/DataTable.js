import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  actions,
}) => {
  if (loading) return <LoadingSpinner message="Loading data..." />;

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted p-4 small">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">

        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th className="text-end">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}

              {actions && (
                <td className="text-end">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default DataTable;