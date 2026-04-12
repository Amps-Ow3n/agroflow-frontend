import React, { useState, useEffect } from "react";
import { createCommitment } from "../../services/commitmentService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import AlertBox from "../ui/AlertBox";
import { validateCrop } from "../../utils/cropNormalizer";

const CommitmentForm = ({ onSuccess, maxSupply }) => {
  const { token } = useAuth();

  const [crop, setCrop] = useState("");
  const [promisedQty, setPromisedQty] = useState("");
  const [zone, setZone] = useState("");
  const [deliveryStart, setDeliveryStart] = useState("");
  const [deliveryEnd, setDeliveryEnd] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const newErrors = {};

    if (promisedQty && maxSupply && parseInt(promisedQty) > maxSupply) {
      newErrors.promisedQty = `Exceeds capacity (${maxSupply})`;
    }

    if (crop) {
      try {
        validateCrop(crop);
      } catch (err) {
        newErrors.crop = err.message;
      }
    }

    setErrors(newErrors);
  }, [crop, promisedQty, maxSupply]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setSuccessMsg(null);

    try {
      await createCommitment(
        {
          crop: validateCrop(crop),
          promised_qty: parseInt(promisedQty),
          zone,
          delivery_start: deliveryStart,
          delivery_end: deliveryEnd,
        },
        token
      );

      setSuccessMsg("Commitment registered successfully!");
      onSuccess && onSuccess();

      setCrop("");
      setPromisedQty("");
      setZone("");
      setDeliveryStart("");
      setDeliveryEnd("");
    } catch (err) {
      setErrors({
        submit: err.response?.data?.detail || "Error creating commitment",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Submitting commitment..." />;

  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body">

        {/* HEADER */}
        <div className="mb-4">
          <h5 className="fw-bold mb-1">Register Commitment</h5>
          <p className="text-muted small mb-0">
            Declare future delivery commitments based on your supply capacity.
          </p>
        </div>

        {/* ALERTS */}
        {errors.submit && <AlertBox type="error" message={errors.submit} />}
        {successMsg && <AlertBox type="success" message={successMsg} />}

        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            {/* Crop */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Crop</label>
              <input
                type="text"
                placeholder="e.g. maize"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                required
                className={`form-control ${errors.crop ? "is-invalid" : ""}`}
              />
              {errors.crop && (
                <div className="invalid-feedback">{errors.crop}</div>
              )}
            </div>

            {/* Quantity */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Promised Quantity
              </label>
              <input
                type="number"
                value={promisedQty}
                onChange={(e) => setPromisedQty(e.target.value)}
                required
                className="form-control"
              />
              {errors.promisedQty && (
                <div className="text-warning small mt-1">
                  ⚠ {errors.promisedQty}
                </div>
              )}
            </div>

            {/* Zone */}
            <div className="col-12">
              <label className="form-label fw-semibold">Zone</label>
              <input
                type="text"
                placeholder="e.g. East, Central"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                required
                className="form-control"
              />
            </div>

            {/* Dates */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Delivery Start
              </label>
              <input
                type="date"
                value={deliveryStart}
                onChange={(e) => setDeliveryStart(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Delivery End
              </label>
              <input
                type="date"
                value={deliveryEnd}
                onChange={(e) => setDeliveryEnd(e.target.value)}
                required
                className="form-control"
              />
            </div>

          </div>

          {/* CTA */}
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
            >
              Register Commitment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CommitmentForm;