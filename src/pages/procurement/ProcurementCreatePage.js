import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProcurement } from "../../api/procurementApi";
import { getApiError } from "../../utils/errors";
import { Page } from "../../components/common/Page";

const methods = [
  "MICRO_PROCUREMENT",
  "QUOTATION",
  "RESTRICTED_DOMESTIC_BIDDING",
  "OPEN_DOMESTIC_BIDDING",
  "FRAMEWORK_CONTRACT",
  "DIRECT_PROCUREMENT",
];

export default function ProcurementCreatePage() {
  const nav = useNavigate();

  const [f, setF] = useState({
    title: "",
    description: "",
    procurement_date: "",
    required_by_date: "",
    item_name: "",
    item_description: "",
    quantity: "",
    unit: "kg",
    location: "",
    specifications: "",
    quality_requirements: "",
    estimated_cost: "",
    procurement_method: "QUOTATION",
    notes: "",
    requesting_department: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setF((x) => ({ ...x, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const payload = {
        ...f,
        quantity: Number(f.quantity),
        estimated_cost:
          f.estimated_cost === "" ? null : Number(f.estimated_cost),
        procurement_date: f.procurement_date || null,
        description: f.description || null,
        item_description: f.item_description || null,
        specifications: f.specifications || null,
        quality_requirements: f.quality_requirements || null,
        notes: f.notes || null,
        requesting_department: f.requesting_department || null,
      };

      const r = await createProcurement(payload);
      nav(`/school/procurements/${r.id}`);
    } catch (e) {
      setError(getApiError(e, "Unable to create procurement."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page
      title="New procurement"
      subtitle="Create the requirement that begins the procurement lifecycle."
    >
      <form
        onSubmit={submit}
        className="card border-0 shadow-sm p-4"
      >
        <div className="row g-3">

          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              className="form-control"
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="item_name" className="form-label">
              Item
            </label>
            <input
              id="item_name"
              className="form-control"
              value={f.item_name}
              onChange={(e) => set("item_name", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="unit" className="form-label">
              Unit
            </label>
            <input
              id="unit"
              className="form-control"
              value={f.unit}
              onChange={(e) => set("unit", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              className="form-control"
              value={f.location}
              onChange={(e) => set("location", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="requesting_department" className="form-label">
              Department
            </label>
            <input
              id="requesting_department"
              className="form-control"
              value={f.requesting_department}
              onChange={(e) =>
                set("requesting_department", e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              id="quantity"
              className="form-control"
              type="number"
              min="0.01"
              step="0.01"
              value={f.quantity}
              onChange={(e) => set("quantity", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="required_by_date" className="form-label">
              Required by
            </label>
            <input
              id="required_by_date"
              className="form-control"
              type="date"
              value={f.required_by_date}
              onChange={(e) =>
                set("required_by_date", e.target.value)
              }
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="procurement_date" className="form-label">
              Procurement date
            </label>
            <input
              id="procurement_date"
              className="form-control"
              type="date"
              value={f.procurement_date}
              onChange={(e) =>
                set("procurement_date", e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="estimated_cost" className="form-label">
              Estimated cost (UGX)
            </label>
            <input
              id="estimated_cost"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={f.estimated_cost}
              onChange={(e) =>
                set("estimated_cost", e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="procurement_method" className="form-label">
              Method
            </label>
            <select
              id="procurement_method"
              className="form-select"
              value={f.procurement_method}
              onChange={(e) =>
                set("procurement_method", e.target.value)
              }
            >
              {methods.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              rows="2"
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label htmlFor="item_description" className="form-label">
              Item description
            </label>
            <textarea
              id="item_description"
              className="form-control"
              rows="2"
              value={f.item_description}
              onChange={(e) =>
                set("item_description", e.target.value)
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="specifications" className="form-label">
              Specifications
            </label>
            <textarea
              id="specifications"
              className="form-control"
              rows="2"
              value={f.specifications}
              onChange={(e) =>
                set("specifications", e.target.value)
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="quality_requirements" className="form-label">
              Quality requirements
            </label>
            <textarea
              id="quality_requirements"
              className="form-control"
              rows="2"
              value={f.quality_requirements}
              onChange={(e) =>
                set("quality_requirements", e.target.value)
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              className="form-control"
              rows="2"
              value={f.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

        </div>

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}

        <button
          className="btn btn-dark mt-4"
          disabled={busy}
        >
          {busy ? "Creating…" : "Create procurement"}
        </button>
      </form>
    </Page>
  );
}