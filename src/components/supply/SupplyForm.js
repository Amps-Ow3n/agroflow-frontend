import React, { useState, useEffect } from "react";
import { createSupply } from "../../services/supplyService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import AlertBox from "../ui/AlertBox";
import { validateCrop } from "../../utils/cropNormalizer";

const SupplyForm = ({ onSuccess }) => {
  const { token } = useAuth();

  const [crop, setCrop] = useState("");
  const [qtyMin, setQtyMin] = useState("");
  const [qtyMax, setQtyMax] = useState("");
  const [zone, setZone] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const newErrors = {};

    if (qtyMin && qtyMax && parseInt(qtyMin) > parseInt(qtyMax)) {
      newErrors.qtyMax = "Maximum quantity must be greater than minimum";
    }

    if (crop) {
      try {
        validateCrop(crop);
      } catch (err) {
        newErrors.crop = err.message;
      }
    }

    setErrors(newErrors);
  }, [crop, qtyMin, qtyMax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setSuccessMsg(null);

    try {
      await createSupply({
        crop: validateCrop(crop),
        qty_min: parseInt(qtyMin),
        qty_max: parseInt(qtyMax),
        zone,
        available_from: availableFrom,
        available_to: availableTo,
      });

      setSuccessMsg("Supply registered successfully!");
      onSuccess && onSuccess();

      setCrop("");
      setQtyMin("");
      setQtyMax("");
      setZone("");
      setAvailableFrom("");
      setAvailableTo("");
    } catch (err) {
      setErrors({
        submit: err.response?.data?.detail || "Error creating supply",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Submitting supply..." />;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">

        {/* HEADER */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-1">Register Supply</h5>
          <p className="text-muted small mb-0">
            Add crop availability for market matching.
          </p>
        </div>

        {errors.submit && (
          <AlertBox type="critical" title="Submission Failed" message={errors.submit} />
        )}

        {successMsg && (
          <AlertBox type="success" title="Success" message={successMsg} />
        )}

        <form onSubmit={handleSubmit}>

          {/* Crop */}
          <div className="mb-3">
            <label className="form-label">Crop</label>
            <input
              type="text"
              className={`form-control ${errors.crop ? "is-invalid" : ""}`}
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. maize"
              required
            />
            {errors.crop && <div className="invalid-feedback">{errors.crop}</div>}
          </div>

          {/* Quantities */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Min Quantity</label>
              <input
                type="number"
                className="form-control"
                value={qtyMin}
                onChange={(e) => setQtyMin(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Max Quantity</label>
              <input
                type="number"
                className={`form-control ${errors.qtyMax ? "is-invalid" : ""}`}
                value={qtyMax}
                onChange={(e) => setQtyMax(e.target.value)}
                required
              />
              {errors.qtyMax && (
                <div className="invalid-feedback">{errors.qtyMax}</div>
              )}
            </div>
          </div>

          {/* Zone */}
          <div className="mt-3">
            <label className="form-label">Zone</label>
            <input
              type="text"
              className="form-control"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              required
            />
          </div>

          {/* Dates */}
          <div className="row g-3 mt-1">
            <div className="col-12 col-md-6">
              <label className="form-label">Available From</label>
              <input
                type="date"
                className="form-control"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Available To</label>
              <input
                type="date"
                className="form-control"
                value={availableTo}
                onChange={(e) => setAvailableTo(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn btn-success w-100 mt-4">
            Register Supply
          </button>

        </form>
      </div>
    </div>
  );
};

export default SupplyForm;