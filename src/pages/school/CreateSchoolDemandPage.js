import { useState } from "react";
import { createDemand } from "../../api/demandApi";
import { useNavigate } from "react-router-dom";

export default function CreateSchoolDemandPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product: "",
    quantity: "",
    delivery_start: "",
    delivery_end: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // hard lock

    try {
      setLoading(true);
      setError("");

      await createDemand({
        ...form,
        quantity: Number(form.quantity)
      });

      navigate("/school/demands");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Failed to create demand"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

  <h2 className="fw-bold mb-1">Declare Food Requirement</h2>

  <p className="text-muted mb-4">
    Define what your institution needs over a time period
  </p>

  {error && <p className="text-danger">{error}</p>}

  <div className="mb-3">
    <label className="form-label">Product</label>
    <input
      className="form-control"
      placeholder="e.g. Maize Flour"
      value={form.product}
      onChange={(e) =>
        setForm({ ...form, product: e.target.value })
      }
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Quantity Needed</label>
    <input
      className="form-control"
      type="number"
      placeholder="e.g. 2000 kg"
      value={form.quantity}
      onChange={(e) =>
        setForm({ ...form, quantity: e.target.value })
      }
    />
  </div>

  <div className="row">
    <div className="col-6 mb-3">
      <label className="form-label">Start Date</label>
      <input
        type="date"
        className="form-control"
        value={form.delivery_start}
        onChange={(e) =>
          setForm({ ...form, delivery_start: e.target.value })
        }
      />
    </div>

    <div className="col-6 mb-3">
      <label className="form-label">End Date</label>
      <input
        type="date"
        className="form-control"
        value={form.delivery_end}
        onChange={(e) =>
          setForm({ ...form, delivery_end: e.target.value })
        }
      />
    </div>
  </div>

  <button className="btn btn-primary w-100" disabled={loading}>
    {loading ? "Submitting..." : "Declare Demand"}
  </button>

</form>
  );
}