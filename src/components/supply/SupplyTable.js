import React, { useState } from "react";
import { deleteSupply, updateSupply } from "../../services/supplyService";
import { formatDate } from "../../utils/formatDate";
import { normalizeCrop } from "../../utils/cropNormalizer";
import EmptyState from "../ui/EmptyState";

const SupplyTable = ({ supplies, onUpdated }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingSupply, setEditingSupply] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supply?")) return;

    await deleteSupply(id);
    onUpdated();
  };

  const openEditModal = (supply) => {
    setEditingSupply(supply);
    setFormData({
      qty_min: supply.qty_min,
      qty_max: supply.qty_max,
      available_from: supply.available_from,
      available_to: supply.available_to,
    });
  };

  const handleUpdate = async () => {
    await updateSupply(editingSupply.id, formData);
    setEditingSupply(null);
    onUpdated();
  };

  if (!supplies?.length) {
    return <EmptyState message="No supply registered yet" />;
  }

  const availabilityBadge = (from, to) => {
    const today = new Date();
    const fromDate = new Date(from);
    const toDate = new Date(to);

    let color = "secondary";
    if (today >= fromDate && today <= toDate) color = "success";
    else if (today < fromDate) color = "warning";
    else color = "danger";

    return (
      <span className={`badge bg-${color}`}>
        {formatDate(from)} → {formatDate(to)}
      </span>
    );
  };

  return (
    <div className="card shadow-sm border-0">

      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle text-nowrap mb-0">

          <thead className="table-light">
            <tr>
              <th>Crop</th>
              <th>Zone</th>
              <th>Min</th>
              <th>Max</th>
              <th>Availability</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {supplies.map((s) => (
              <React.Fragment key={s.id}>

                <tr onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}>
                  <td className="fw-semibold">{normalizeCrop(s.crop)}</td>
                  <td>{s.zone}</td>
                  <td>{s.qty_min}</td>
                  <td>{s.qty_max}</td>
                  <td>{availabilityBadge(s.available_from, s.available_to)}</td>

                  <td style={{ minWidth: "140px" }}>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(s);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRow === s.id && (
                  <tr className="table-light">
                    <td colSpan="6" className="small text-muted">
                      Range: {s.qty_min} – {s.qty_max}
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>

      {/* EDIT MODAL (UNCHANGED LOGIC) */}
      {editingSupply && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Supply</h5>
                <button className="btn-close" onClick={() => setEditingSupply(null)} />
              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-2"
                  value={formData.qty_min}
                  onChange={(e) => setFormData({ ...formData, qty_min: e.target.value })}
                />

                <input
                  className="form-control mb-2"
                  value={formData.qty_max}
                  onChange={(e) => setFormData({ ...formData, qty_max: e.target.value })}
                />

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingSupply(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupplyTable;