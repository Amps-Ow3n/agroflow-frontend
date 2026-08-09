import React, { useState } from "react";

export default function DeliveryEditForm({
  delivery,
  onSave,
  mode = "supplier"
}) {
  const isSchoolCorrection = mode === "school_verification";

  const [form, setForm] = useState({
    delivered_qty: delivery.delivered_qty ?? "",
    received_qty: delivery.received_qty ?? "",
    quality_status: delivery.quality_status || "",
    delay_status: delivery.delay_status || "",
    verification_status:
      delivery.verification_status || "PENDING",
    verification_notes:
      delivery.verification_notes || ""
  });

  const [error, setError] = useState("");

  function update(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  }

  function submit(e) {
    e.preventDefault();

    const deliveredQty = Number(delivery.delivered_qty ?? 0);
    const receivedQty = Number(form.received_qty);

    /*
     * School correction is about what was verified,
     * not what the supplier originally declared.
     */
    if (isSchoolCorrection) {
      if (
        Number.isFinite(receivedQty) &&
        receivedQty > deliveredQty
      ) {
        setError(
          "Received quantity cannot exceed the supplier's delivered quantity."
        );
        return;
      }

      onSave({
        id: delivery.id,
        received_qty: receivedQty,
        quality_status: form.quality_status,
        delay_status: form.delay_status,
        verification_status: form.verification_status,
        verification_notes: form.verification_notes
      });

      return;
    }

    /*
     * Supplier mode.
     *
     * delivered_qty is intentionally included only here.
     * Backend remains the final authority.
     */
    const deliveredQtyValue = Number(form.delivered_qty);

    if (
      !Number.isFinite(deliveredQtyValue) ||
      deliveredQtyValue < 0
    ) {
      setError("Delivered quantity must be a valid non-negative number.");
      return;
    }

    onSave({
      id: delivery.id,
      delivered_qty: deliveredQtyValue,
      week_start: delivery.week_start,
      week_end: delivery.week_end
    });
  }

  return (
    <form onSubmit={submit}>
      {error && (
        <div className="alert alert-danger small">
          {error}
        </div>
      )}

      {isSchoolCorrection ? (
        <>
          <div className="mb-3">
            <label className="form-label">
              Supplier Delivered Quantity
            </label>

            <input
              type="number"
              className="form-control"
              value={delivery.delivered_qty ?? ""}
              disabled
            />

            <small className="text-muted">
              This value is supplier-reported and cannot be changed
              during school verification.
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Received Quantity
            </label>

            <input
              type="number"
              min="0"
              max={delivery.delivered_qty ?? undefined}
              className="form-control"
              name="received_qty"
              value={form.received_qty}
              onChange={update}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Verification Status
            </label>

            <select
              className="form-select"
              name="verification_status"
              value={form.verification_status}
              onChange={update}
            >
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="PARTIAL">Partial</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Quality
            </label>

            <select
              className="form-select"
              name="quality_status"
              value={form.quality_status}
              onChange={update}
            >
              <option value="">Select quality</option>
              <option value="GOOD">Good</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Delivery Time
            </label>

            <select
              className="form-select"
              name="delay_status"
              value={form.delay_status}
              onChange={update}
            >
              <option value="">Select timing</option>
              <option value="ON_TIME">On Time</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Verification Notes
            </label>

            <textarea
              className="form-control"
              name="verification_notes"
              value={form.verification_notes}
              onChange={update}
              rows="3"
            />
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">
              Delivered Quantity
            </label>

            <input
              type="number"
              min="0"
              className="form-control"
              name="delivered_qty"
              value={form.delivered_qty}
              onChange={update}
              required
            />
          </div>

          <div className="alert alert-warning small">
            Supplier delivery corrections are allowed only while
            this delivery remains unverified.
          </div>
        </>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
      >
        {isSchoolCorrection
          ? "Save Verification Correction"
          : "Save Delivery Correction"}
      </button>
    </form>
  );
}