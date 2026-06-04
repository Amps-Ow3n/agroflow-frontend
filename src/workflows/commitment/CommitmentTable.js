import React, { useState } from "react";

import {
  deleteCommitment,
  updateCommitment,
} from "./commitmentService";

import EmptyState from "../../shared/components/LoadingSpinner";
import { formatDate } from "../../shared/utils/formatters";

const CommitmentTable = ({ commitments, onUpdated }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this commitment?")) return;

    await deleteCommitment(id);
    onUpdated?.();
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      promised_qty: c.promised_qty,
      delivery_start: c.delivery_start,
      delivery_end: c.delivery_end,
    });
  };

  const handleUpdate = async () => {
    await updateCommitment(editing.id, form);
    setEditing(null);
    onUpdated?.();
  };

  if (!commitments?.length) {
    return <EmptyState message="No commitments found" />;
  }

  const statusBadge = (status) => (
    <span className={`badge bg-${status === "COMPLETED" ? "success" : status === "PARTIAL" ? "warning" : "secondary"}`}>
      {status}
    </span>
  );

  return (
    <div className="table-responsive">

      <table className="table table-hover align-middle">

        <thead className="table-light">
          <tr>
            <th>Crop</th>
            <th>Zone</th>
            <th>Qty</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {commitments.map((c) => (
            <tr key={c.id}>
              <td>{c.crop}</td>
              <td>{c.zone}</td>
              <td>{c.promised_qty}</td>
              <td>{formatDate(c.delivery_start)}</td>
              <td>{formatDate(c.delivery_end)}</td>
              <td>{statusBadge(c.status)}</td>

              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(c)}>
                  Edit
                </button>

                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Edit Commitment</h5>
                <button className="btn-close" onClick={() => setEditing(null)} />
              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-2"
                  value={form.promised_qty}
                  onChange={(e) => setForm({ ...form, promised_qty: e.target.value })}
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.delivery_start}
                  onChange={(e) => setForm({ ...form, delivery_start: e.target.value })}
                />

                <input
                  type="date"
                  className="form-control"
                  value={form.delivery_end}
                  onChange={(e) => setForm({ ...form, delivery_end: e.target.value })}
                />

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleUpdate}>
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

export default CommitmentTable;