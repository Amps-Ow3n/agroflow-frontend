import React, { useState } from "react";
import {
  deleteCommitment,
  updateCommitment,
} from "../../services/commitmentService";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../ui/EmptyState";
import { formatDate } from "../../utils/formatDate";
import { normalizeCrop } from "../../utils/cropNormalizer";

const CommitmentTable = ({ commitments, onUpdated }) => {
  const { token } = useAuth();
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingCommitment, setEditingCommitment] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this commitment?")) return;

    try {
      await deleteCommitment(id, token);
      onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (commitment) => {
    setEditingCommitment(commitment);
    setFormData({
      promised_qty: commitment.promised_qty,
      delivery_start: commitment.delivery_start,
      delivery_end: commitment.delivery_end,
    });
  };

  const handleUpdate = async () => {
    try {
      await updateCommitment(editingCommitment.id, formData);
      setEditingCommitment(null);
      onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  if (!commitments || commitments.length === 0) {
    return <EmptyState message="No commitment records found" />;
  }

  const statusBadge = (status) => {
    const colors = {
      COMPLETED: "success",
      PARTIAL: "warning",
      MISSED: "danger",
    };
    return (
      <span className={`badge bg-${colors[status] || "secondary"}`}>
        {status}
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
                <th>Zone</th>
                <th>Qty</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {commitments.map((c) => (
                <React.Fragment key={c.id}>

                  <tr
                    onClick={() =>
                      setExpandedRow(expandedRow === c.id ? null : c.id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td className="fw-semibold">
                      {normalizeCrop(c.crop) || c.crop}
                    </td>
                    <td>{c.zone}</td>
                    <td>{c.promised_qty}</td>
                    <td>{formatDate(c.delivery_start)}</td>
                    <td>{formatDate(c.delivery_end)}</td>
                    <td>{statusBadge(c.status)}</td>

                    <td style={{ minWidth: "150px" }}>
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(c);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(c.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === c.id && (
                    <tr>
                      <td colSpan="7" className="bg-light small">
                        <div className="p-2">
                          <strong>Details:</strong>{" "}
                          {normalizeCrop(c.crop)} — {c.zone} — Qty:{" "}
                          {c.promised_qty}
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal unchanged */}
      {editingCommitment && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Commitment</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingCommitment(null)}
                />
              </div>

              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Promised Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.promised_qty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promised_qty: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Delivery Start</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.delivery_start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_start: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Delivery End</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.delivery_end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_end: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingCommitment(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommitmentTable;