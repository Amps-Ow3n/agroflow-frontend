import React, { useState } from "react";
import { verifyDelivery } from "../../api/deliveryApi";

import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";

export default function DeliveryVerificationForm({
  commitmentId,
  onVerified,
}) {
  const [form, setForm] = useState({
    received_qty: "",
    verification_status: "VERIFIED",
    quality_status: "GOOD",
    delay_status: "ON_TIME",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
console.log("COMMITMENT ID RECEIVED:", commitmentId);

    setLoading(true);
    setError("");
    
    try {
      const payload = {
        ...form,
        received_qty: Number(form.received_qty),
      };
console.log("PAYLOAD SENT:", payload);
      const result = await verifyDelivery(
        commitmentId,
        payload
      );

      if (onVerified) {
        onVerified(result);
      }
    } 
    catch (err) {
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((e) => e.msg).join(", ")
        );
      } else {
        setError(
          detail || "Verification failed"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded bg-white"
    >
      <h5 className="fw-bold mb-3">
        Verify Delivery
      </h5>

      {error && (
        <ErrorState message={error} />
      )}

      <div className="mb-3">
        <label className="form-label">
          Received Quantity
        </label>

        <input
          type="number"
          name="received_qty"
          className="form-control"
          placeholder="e.g. 500"
          value={form.received_qty}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Verification Status
        </label>

        <select
          name="verification_status"
          className="form-select"
          value={form.verification_status}
          onChange={handleChange}
        >
          <option value="VERIFIED">
            Verified
          </option>

          <option value="PARTIAL">
            Partial
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Quality
        </label>

        <select
          name="quality_status"
          className="form-select"
          value={form.quality_status}
          onChange={handleChange}
        >
          <option value="GOOD">
            Good
          </option>

          <option value="FAILED">
            Failed
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Delivery Time
        </label>

        <select
          name="delay_status"
          className="form-select"
          value={form.delay_status}
          onChange={handleChange}
        >
          <option value="ON_TIME">
            On Time
          </option>

          <option value="DELAYED">
            Delayed
          </option>
        </select>
      </div>

      {loading ? (
        <Loader text="Verifying..." />
      ) : (
        <Button
          type="submit"
          className="w-100"
        >
          Submit Verification
        </Button>
      )}
    </form>
  );
}