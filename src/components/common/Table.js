import React from "react";

/**
 * Type-C rule:
 * Table is a renderer, NOT a decision maker
 */
export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left p-2 border-b">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b">
              {columns.map((col, j) => (
                <td key={j} className="p-2">
                  {col.render
                    ? col.render(row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}