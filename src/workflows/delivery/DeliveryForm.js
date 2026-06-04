import React, { useEffect, useState } from "react";

import { logDelivery } from "./deliveryService";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

const DeliveryForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    commitment_id: "",
    delivered_qty: "",
    week_start: "",
    week_end: "",
  });

  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // optional: later connect to commitmentService
    setCommitments([]);
  }, []);

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await logDelivery({
        commitment_id: Number(form.commitment_id),
        delivered_qty: Number(form.delivered_qty),
        week_start: form.week_start,
        week_end: form.week_end,
      });

      setForm({
        commitment_id: "",
        delivered_qty: "",
        week_start: "",
        week_end: "",
      });

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Recording delivery..." />;

  return (
    <form onSubmit={submit}>

      <div className="mb-3">
        <label>Commitment ID</label>
        <input
          className="form-control"
          value={form.commitment_id}
          onChange={(e) => update("commitment_id", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Delivered Quantity</label>
        <input
          type="number"
          className="form-control"
          value={form.delivered_qty}
          onChange={(e) => update("delivered_qty", e.target.value)}
          required
        />
      </div>

      <div className="row g-2">
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={form.week_start}
            onChange={(e) => update("week_start", e.target.value)}
            required
          />
        </div>

        <div className="col">
          <input
            type="date"
            className="form-control"
            value={form.week_end}
            onChange={(e) => update("week_end", e.target.value)}
            required
          />
        </div>
      </div>

      <button className="btn btn-success w-100 mt-3">
        Log Delivery
      </button>

    </form>
  );
};

export default DeliveryForm;