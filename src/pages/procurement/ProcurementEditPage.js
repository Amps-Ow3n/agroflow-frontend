import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProcurement, updateProcurement } from "../../api/procurementApi";
import { getApiError } from "../../utils/errors";
import { Page, Loading, Alert } from "../../components/common/Page";
import { parseNumericInput, displayNumericInput, allowedUnitsForProduct } from "../../utils/formatters";

export default function ProcurementEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProcurement(id).then((r) => {
      const p = r.procurement || r;
      const item = (r.items || [])[0] || {};

      setForm({
        title: p.title || "",
        description: p.description || "",
        required_by_date: p.required_by_date || "",
        location: p.location || "",
        item_name: item.item_name || p.item_name || "",
        quantity: item.quantity ?? p.quantity ?? "",
        unit: item.unit || p.unit || "kg",
        procurement_date: p.procurement_date || "",
        procurement_method: p.procurement_method || "QUOTATION",
      });
    }).catch((e) => setError(getApiError(e)));
  }, [id]);

  function set(k, v) {
    setForm((x) => ({ ...x, [k]: v }));
  }

  function setItemName(value) {
    const allowed = allowedUnitsForProduct(value);
    setForm((x) => ({ ...x, item_name: value, unit: allowed.includes(x.unit) ? x.unit : allowed[0] }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await updateProcurement(id, {
        title: form.title,
        description: form.description || null,
        required_by_date: form.required_by_date,
        location: form.location,
        item_name: form.item_name,
        quantity: parseNumericInput(form.quantity),
        unit: form.unit,
        procurement_date: form.procurement_date || null,
        procurement_method: form.procurement_method,
      });

      nav(`/school/procurements/${id}`);
    } catch (e) {
      setError(getApiError(e, "Unable to update procurement."));
    } finally {
      setBusy(false);
    }
  }

  if (!form) {
    return (
      <Page title="Edit procurement">
        {error ? <Alert>{error}</Alert> : <Loading />}
      </Page>
    );
  }

  return (
    <Page
      title="Edit procurement"
      subtitle="Update the requirement before it reaches a state where editing is no longer allowed."
    >
      <form
        onSubmit={submit}
        className="card border-0 shadow-sm p-4"
      >
        {error && <Alert>{error}</Alert>}

        <label
          htmlFor="edit-title"
          className="form-label"
        >
          Title
        </label>
        <input
          id="edit-title"
          className="form-control mb-3"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />

        <label
          htmlFor="edit-item"
          className="form-label"
        >
          Item
        </label>
        <input
          id="edit-item"
          className="form-control mb-3"
          value={form.item_name}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <label
          htmlFor="edit-quantity"
          className="form-label"
        >
          Quantity
        </label>
        <input
          id="edit-quantity"
          className="form-control mb-3"
          type="text"
          inputMode="decimal"
          value={displayNumericInput(form.quantity)}
          onChange={(e) => set("quantity", e.target.value)}
          required
        />

        <label
          htmlFor="edit-unit"
          className="form-label"
        >
          Unit
        </label>
        <select
          id="edit-unit"
          className="form-select mb-3"
          value={form.unit}
          onChange={(e) => set("unit", e.target.value)}
          required
        >
          {allowedUnitsForProduct(form.item_name).map((unit) => <option key={unit} value={unit}>{unit}</option>)}
        </select>

        <label
          htmlFor="edit-procurement-date"
          className="form-label"
        >
          Procurement date
        </label>
        <input
          id="edit-procurement-date"
          className="form-control mb-3"
          type="date"
          value={form.procurement_date}
          onChange={(e) => set("procurement_date", e.target.value)}
        />

        <label htmlFor="edit-method" className="form-label">
          Procurement method
        </label>
        <select
          id="edit-method"
          className="form-select mb-3"
          value={form.procurement_method}
          onChange={(e) => set("procurement_method", e.target.value)}
        >
          <option>MICRO_PROCUREMENT</option>
          <option>QUOTATION</option>
          <option>RESTRICTED_DOMESTIC_BIDDING</option>
          <option>OPEN_DOMESTIC_BIDDING</option>
          <option>FRAMEWORK_CONTRACT</option>
          <option>DIRECT_PROCUREMENT</option>
        </select>

        <label
          htmlFor="edit-required-by"
          className="form-label"
        >
          Required by
        </label>
        <input
          id="edit-required-by"
          className="form-control mb-3"
          type="date"
          value={form.required_by_date}
          onChange={(e) =>
            set("required_by_date", e.target.value)
          }
          required
        />

        <label
          htmlFor="edit-location"
          className="form-label"
        >
          Location
        </label>
        <input
          id="edit-location"
          className="form-control mb-3"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          required
        />

        <label
          htmlFor="edit-description"
          className="form-label"
        >
          Description
        </label>
        <textarea
          id="edit-description"
          className="form-control"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />

        {error && <Alert>{error}</Alert>}

        <button
          className="btn btn-dark mt-4"
          disabled={busy}
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
    </Page>
  );
}