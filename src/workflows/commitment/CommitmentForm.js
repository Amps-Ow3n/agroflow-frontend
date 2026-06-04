import React, { useState, useEffect } from "react";

import { createCommitment } from "./commitmentService";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import AlertBox from "../../shared/components/StatusBadge"; // or AlertBox if you have it

const CommitmentForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    crop: "",
    promised_qty: "",
    zone: "",
    delivery_start: "",
    delivery_end: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const e = {};

    if (form.promised_qty && Number(form.promised_qty) <= 0) {
      e.promised_qty = "Quantity must be greater than 0";
    }

    if (
      form.delivery_start &&
      form.delivery_end &&
      new Date(form.delivery_start) > new Date(form.delivery_end)
    ) {
      e.date = "Invalid delivery window";
    }

    setErrors(e);
  }, [form]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setSuccess(null);

    try {
      await createCommitment({
        crop: form.crop,
        promised_qty: Number(form.promised_qty),
        zone: form.zone,
        delivery_start: form.delivery_start,
        delivery_end: form.delivery_end,
      });

      setSuccess("Commitment recorded (risk evaluation will be computed separately)");

      setForm({
        crop: "",
        promised_qty: "",
        zone: "",
        delivery_start: "",
        delivery_end: "",
      });

      onSuccess?.();
    } catch (err) {
      setErrors({
        submit: err.response?.data?.detail || "Failed to create commitment",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Recording commitment..." />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}

      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-3">

        <div className="col-md-6">
          <label>Crop</label>
          <input
            className="form-control"
            value={form.crop}
            onChange={(e) => update("crop", e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label>Promised Quantity</label>
          <input
            type="number"
            className="form-control"
            value={form.promised_qty}
            onChange={(e) => update("promised_qty", e.target.value)}
            required
          />
          {errors.promised_qty && (
            <small className="text-danger">{errors.promised_qty}</small>
          )}
        </div>

        <div className="col-12">
          <label>Zone</label>
          <input
            className="form-control"
            value={form.zone}
            onChange={(e) => update("zone", e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label>Delivery Start</label>
          <input
            type="date"
            className="form-control"
            value={form.delivery_start}
            onChange={(e) => update("delivery_start", e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <label>Delivery End</label>
          <input
            type="date"
            className="form-control"
            value={form.delivery_end}
            onChange={(e) => update("delivery_end", e.target.value)}
            required
          />
        </div>

      </div>

      <button className="btn btn-success w-100 mt-3">
        Create Commitment
      </button>
    </form>
  );
};

export default CommitmentForm;