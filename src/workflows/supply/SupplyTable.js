import React, { useState } from "react";
import EmptyState from "../../shared/components/EmptyState";
import { formatDate } from "../../shared/utils/dateHelpers";
import { normalizeCrop } from "../../shared/utils/cropNormalizer";

const SupplyTable = ({ supplies, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(null);

  if (!supplies?.length) {
    return <EmptyState message="No supply records" />;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Crop</th>
          <th>Zone</th>
          <th>Min</th>
          <th>Max</th>
          <th>Dates</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {supplies.map((s) => (
          <React.Fragment key={s.id}>
            <tr onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <td>{normalizeCrop(s.crop)}</td>
              <td>{s.zone}</td>
              <td>{s.qty_min}</td>
              <td>{s.qty_max}</td>
              <td>{formatDate(s.available_from)} → {formatDate(s.available_to)}</td>

              <td>
                <button onClick={() => onEdit(s)}>Edit</button>
                <button onClick={() => onDelete(s.id)}>Delete</button>
              </td>
            </tr>

            {expanded === s.id && (
              <tr>
                <td colSpan="6">
                  Range: {s.qty_min} - {s.qty_max}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default SupplyTable;