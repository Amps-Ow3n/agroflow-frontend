import React from "react";

export default function Table({
  columns = [],
  data = []
}) {

  if (data.length === 0) {

    return (

      <div className="alert alert-light border">

        No records found.

      </div>

    );

  }

  return (

    <div className="table-responsive">

      <table className="table table-bordered table-hover align-middle">

        <thead className="table-light">

          <tr>

            {columns.map((col) => (

              <th
                key={col.accessor || col.header}
              >
                {col.header}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row) => (

            <tr
              key={
                row.id ??
                row.uuid ??
                JSON.stringify(row)
              }
            >

              {columns.map((col) => (

                <td
                  key={col.accessor || col.header}
                >

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