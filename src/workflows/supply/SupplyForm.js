import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import AlertBox from "../../shared/components/AlertBox";
import { validateCrop } from "../../shared/utils/cropNormalizer";

const SupplyForm = ({ onSubmit, loading }) => {
  const [crop, setCrop] = useState("");
  const [qtyMin, setQtyMin] = useState("");
  const [qtyMax, setQtyMax] = useState("");
  const [zone, setZone] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const newErrors = {};

    if (qtyMin && qtyMax && parseInt(qtyMin) > parseInt(qtyMax)) {
      newErrors.qtyMax = "Max must be ≥ Min";
    }

    if (crop) {
      try {
        validateCrop(crop);
      } catch (e) {
        newErrors.crop = e.message;
      }
    }

    setErrors(newErrors);
  }, [crop, qtyMin, qtyMax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    const payload = {
      crop: validateCrop(crop),
      qty_min: parseInt(qtyMin),
      qty_max: parseInt(qtyMax),
      zone,
      available_from: availableFrom,
      available_to: availableTo,
    };

    await onSubmit(payload);

    setSuccess("Supply registered successfully");

    setCrop("");
    setQtyMin("");
    setQtyMax("");
    setZone("");
    setAvailableFrom("");
    setAvailableTo("");
  };

  if (loading) {
    return <LoadingSpinner message="Submitting supply..." />;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">

        <h5 className="mb-3">Register Supply</h5>

        {success && <AlertBox type="success" message={success} />}
        {errors.submit && <AlertBox type="error" message={errors.submit} />}

        <form onSubmit={handleSubmit}>

          <input className="form-control mb-2" placeholder="Crop"
            value={crop} onChange={(e) => setCrop(e.target.value)} />

          <div className="row g-2">
            <input className="form-control col"
              type="number" placeholder="Min"
              value={qtyMin} onChange={(e) => setQtyMin(e.target.value)} />

            <input className="form-control col"
              type="number" placeholder="Max"
              value={qtyMax} onChange={(e) => setQtyMax(e.target.value)} />
          </div>

          <input className="form-control mt-2" placeholder="Zone"
            value={zone} onChange={(e) => setZone(e.target.value)} />

          <div className="row g-2 mt-2">
            <input type="date" className="form-control col"
              value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />

            <input type="date" className="form-control col"
              value={availableTo} onChange={(e) => setAvailableTo(e.target.value)} />
          </div>

          <button className="btn btn-success w-100 mt-3">
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default SupplyForm;