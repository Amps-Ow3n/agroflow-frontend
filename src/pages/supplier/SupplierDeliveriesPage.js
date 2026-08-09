import { useState, useEffect } from "react";
import client from "../../api/client";
import { getSupplierCommitments } from "../../api/commitmentApi";
import DeliveryLedgerView from "../../components/deliveries/DeliveryLedgerView";
import DeliveryEditForm from "../../components/deliveries/DeliveryEditForm";
export default function SupplierDeliveryLogPage() {
  const [commitments, setCommitments] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
  delivered_qty: "",
  week_start: "",
  week_end: ""
});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSupplierCommitments().then(setCommitments);
  }, []);

  const loadDeliveries = async () => {
    const res = await client.get("/supplier/deliveries");
    setDeliveries(res.data);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleEdit = (delivery) => {
  setEditingDelivery(delivery);
};

const handleDelete = async (delivery) => {
  const confirmed = window.confirm(
    "Delete this unverified delivery?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    /*
     * IMPORTANT:
     * Replace this endpoint with the exact backend
     * supplier-delete endpoint you created.
     */
    await client.delete(
      `/supplier/delivery/${delivery.id}`
    );

    setEditingDelivery(null);
    await loadDeliveries();
  } catch (err) {
    setError(
      err?.response?.data?.detail ||
      "Unable to delete delivery."
    );
  }
};

const handleSaveEdit = async (payload) => {
  try {
    setError("");

    /*
     * Replace with the exact backend supplier-edit
     * endpoint if your route differs.
     */
    await client.put(
      `/supplier/delivery/${payload.id}`,
      payload
    );

    setEditingDelivery(null);
    await loadDeliveries();
  } catch (err) {
    setError(
      err?.response?.data?.detail ||
      "Unable to update delivery."
    );
  }
};

  const logDelivery = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      await client.post(`/supplier/delivery/log/${selected}`, {
        delivered_qty: Number(form.delivered_qty),
        week_start: form.week_start,
        week_end: form.week_end
      });

      await loadDeliveries();

      setForm({
        delivered_qty: "",
        week_start: "",
        week_end: ""
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">

      <h2 className="fw-bold mb-4">
        Delivery Truth Ledger
      </h2>

      <div className="row g-4">

        {/* LEFT — SELECT COMMITMENT */}
        <div className="col-lg-4">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Commitments</h6>

            {commitments.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`p-2 border rounded mb-2 ${
                  selected === c.id ? "bg-light border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <div className="fw-bold">{c.product}</div>
                <div className="text-muted small">
                  {c.promised_qty} kg
                </div>
              </div>
            ))}
          </div>

          {/* FORM */}
          {selected && (
            <div className="card p-3 mt-3">
              <h6 className="fw-bold">Log Delivery</h6>

              <input
                className="form-control mb-2"
                type="number"
                placeholder="Delivered Qty"
                value={form.delivered_qty}
                onChange={(e) =>
                  setForm({ ...form, delivered_qty: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                type="date"
                value={form.week_start}
                onChange={(e) =>
                  setForm({ ...form, week_start: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                type="date"
                value={form.week_end}
                onChange={(e) =>
                  setForm({ ...form, week_end: e.target.value })
                }
              />

              <button
                className="btn btn-success w-100"
                onClick={logDelivery}
                disabled={loading}
              >
                {loading ? "Logging..." : "Log Delivery"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — LEDGER */}
        <div className="col-lg-8">
          {error && (
  <div className="alert alert-danger">
    {error}
  </div>
)}

{editingDelivery && (
  <div className="card shadow-sm border-0 p-3 mb-3">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold mb-0">
        Correct Unverified Delivery
      </h6>

      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => setEditingDelivery(null)}
      >
        Cancel
      </button>
    </div>

    <DeliveryEditForm
      delivery={editingDelivery}
      mode="supplier"
      onSave={handleSaveEdit}
    />
  </div>
)}

<DeliveryLedgerView
  deliveries={deliveries}
  mode="supplier"
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
        </div>

      </div>
    </div>
  );
}