import React, { useState, useEffect } from "react";
import { logDelivery } from "../../services/deliveryService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import AlertBox from "../ui/AlertBox";
import api from "../../services/api";

const DeliveryForm = ({ onSuccess, existingDelivery }) => {
  const { token } = useAuth();

  const [commitments, setCommitments] = useState([]);
  const [commitmentId, setCommitmentId] = useState("");
  const [deliveredQty, setDeliveredQty] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const isEdit = !!existingDelivery;

  useEffect(() => {
    const fetchCommitments = async () => {
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const farmerId = payload.id;

        const res = await api.get("/commitments", {
          params: { farmer_id: farmerId },
        });

        setCommitments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch commitments", err);
        setCommitments([]);
      }
    };

    fetchCommitments();
  }, [token]);

  useEffect(() => {
    if (existingDelivery) {
      setCommitmentId(existingDelivery.commitment_id);
      setDeliveredQty(existingDelivery.delivered_qty);
      setWeekStart(existingDelivery.week_start);
      setWeekEnd(existingDelivery.week_end);
    }
  }, [existingDelivery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isEdit) {
        await api.put(`/deliveries/${existingDelivery.id}`, {
          delivered_qty: parseInt(deliveredQty),
          week_start: weekStart,
          week_end: weekEnd,
        });

        setSuccessMsg("Delivery updated successfully");
      } else {
        const response = await logDelivery(
          {
            commitment_id: parseInt(commitmentId),
            delivered_qty: parseInt(deliveredQty),
            week_start: weekStart,
            week_end: weekEnd,
          },
          token
        );

        setSuccessMsg(`Delivery logged: ${response.status || "Recorded"}`);
      }

      onSuccess && onSuccess();

      if (!isEdit) {
        setCommitmentId("");
        setDeliveredQty("");
        setWeekStart("");
        setWeekEnd("");
      }

    } catch (err) {
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((e) => e.msg).join(", "));
      } else if (detail && typeof detail === "object") {
        setError(detail.msg || "Unexpected server error");
      } else {
        setError("Error submitting delivery");
      }

    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Submitting..." />;

  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body">

        {/* HEADER */}
        <div className="mb-4">
          <h5 className="fw-bold mb-1">
            {isEdit ? "Edit Delivery" : "Log Weekly Delivery"}
          </h5>
          <p className="text-muted small mb-0">
            {isEdit
              ? "Update your delivery record."
              : "Record actual deliveries against your commitments."}
          </p>
        </div>

        {/* ALERTS */}
        {error && <AlertBox type="error" message={error} />}
        {successMsg && <AlertBox type="success" message={successMsg} />}

        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            {/* Commitment */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Commitment
              </label>
              <select
                value={commitmentId}
                onChange={(e) => setCommitmentId(e.target.value)}
                required
                className="form-control"
                disabled={isEdit}
              >
                <option value="">Select Commitment</option>
                {commitments.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.crop} ({c.promised_qty})
                  </option>
                ))}
              </select>
            </div>

            {/* Delivered Qty */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Delivered Quantity
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={deliveredQty}
                onChange={(e) => setDeliveredQty(e.target.value)}
                required
                className="form-control"
              />
            </div>

            {/* Dates */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Week Start
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Week End
              </label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                required
                className="form-control"
              />
            </div>

          </div>

          {/* CTA */}
          <div className="mt-4">
            <button className="btn btn-success w-100 py-2 fw-semibold">
              {isEdit ? "Update Delivery" : "Log Delivery"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default DeliveryForm;