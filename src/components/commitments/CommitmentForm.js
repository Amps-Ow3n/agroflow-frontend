import React, { useState } from "react";
import { createCommitment } from "../../api/commitmentApi";
import Input from "../common/Input";
import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import { useLocation } from "react-router-dom";
import CommitmentAnalysisCard from "./CommitmentAnalysisCard";
export default function CommitmentForm({ schools, onSuccess }) {
  const location = useLocation();
  const demandData = location.state;

  const [form, setForm] = useState({
    school_id: demandData?.school_id || "",
    product: demandData?.product || "",
    promised_qty: demandData?.quantity || "",
    delivery_start: demandData?.delivery_start || "",
    delivery_end: demandData?.delivery_end || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis,setAnalysis] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await createCommitment({
  ...form,
  promised_qty: Number(form.promised_qty),
});

if (res.feasibility?.status === "infeasible") {

  setAnalysis(res.feasibility);

  return;
}
      setForm({
        school_id: "",
        product: "",
        promised_qty: "",
        delivery_start: "",
        delivery_end: "",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create commitment"
      );
    } finally {
      setLoading(false);
    }
  };

  const isLocked = !!demandData?.locked;

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

      {/* DEMAND CONTEXT (TYPE C: external truth framing) */}
      {demandData && (
        <div className="alert alert-info small">
          <div className="fw-bold mb-1">Demand Context Locked</div>
          <div>School: {demandData.school_id}</div>
          <div>Product: {demandData.product}</div>
          <div>Requested: {demandData.quantity}</div>
          <div>
            Window: {demandData.delivery_start} → {demandData.delivery_end}
          </div>
        </div>
      )}

      {error && <ErrorState message={error} />}
      {
analysis &&
(
<CommitmentAnalysisCard 
    feasibility={analysis}
/>
)
}
      {/* SCHOOL SELECT */}
      <div>
        <label className="form-label fw-medium">School</label>
        <select
          name="school_id"
          onChange={handleChange}
          value={form.school_id}
          disabled={isLocked}
          className="form-select"
        >
          <option value="">Select School</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {isLocked && (
          <div className="text-muted small mt-1">
            Locked from selected demand
          </div>
        )}
      </div>

      {/* PRODUCT */}
      <Input
        label="Product"
        name="product"
        value={form.product}
        onChange={handleChange}
        placeholder="e.g. Maize Flour"
      />

      {/* QUANTITY */}
      <Input
        label="Promised Quantity"
        name="promised_qty"
        type="number"
        value={form.promised_qty}
        onChange={handleChange}
        placeholder="Enter committed quantity"
      />

      {/* DELIVERY WINDOW */}
      <div className="row g-2">
        <div className="col-6">
          <Input
            label="Delivery Start"
            name="delivery_start"
            type="date"
            value={form.delivery_start}
            onChange={handleChange}
          />
        </div>

        <div className="col-6">
          <Input
            label="Delivery End"
            name="delivery_end"
            type="date"
            value={form.delivery_end}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* DECISION BUTTON */}
      {loading ? (
        <Loader text="Creating commitment..." />
      ) : (
        <Button type="submit" className="w-100" variant="primary">
          Create Commitment
        </Button>
      )}

      {/* TYPE C WARNING LAYER */}
      <div className="text-muted small">
        <strong>Type C Rule:</strong> A commitment is not inventory.
        It is a binding promise based on planning assumptions.
      </div>

    </form>
  );
}