import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import { getApiError } from "../../utils/errors";
import PasswordInput from "../../components/common/PasswordInput";

const schoolResponsibilities = [
  ["ORGANIZATION_ADMIN", "Organization Admin"],
  ["PROCUREMENT_OFFICER", "Procurement Officer"],
  ["PROCUREMENT_REVIEWER", "Procurement Reviewer"],
  ["RECEIVING_OFFICER", "Receiving Officer"],
];

const supplierResponsibilities = [
  ["SUPPLIER_ADMIN", "Supplier Admin"],
  ["SUPPLIER_USER", "Supplier User"],
];

export default function RegisterPage() {
  const [mode, setMode] = useState("CREATE");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    organization_name: "",
    organization_type: "SCHOOL",
    responsibility: "PROCUREMENT_OFFICER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const responsibilities = (form.organization_type === "SCHOOL"
    ? schoolResponsibilities
    : supplierResponsibilities
  ).filter(([code]) => mode === "CREATE" || !["ORGANIZATION_ADMIN", "SUPPLIER_ADMIN"].includes(code));

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeMode(value) {
    setMode(value);
    setError("");
    setSuccess("");
  }

  function changeOrganizationType(value) {
    const defaultResponsibility =
      value === "SCHOOL" ? "PROCUREMENT_OFFICER" : "SUPPLIER_USER";
    setForm((current) => ({
      ...current,
      organization_type: value,
      responsibility: defaultResponsibility,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      const response = await register({
        ...form,
        registration_mode: mode,
      });
      setSuccess(response.message || "Registration submitted successfully.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(getApiError(err, "Registration failed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <form
        onSubmit={submit}
        className="card shadow-sm border-0 p-4"
        style={{ width: 520, maxWidth: "100%" }}
      >
        <h2 className="fw-bold mb-1">Create your AgroFlow account</h2>
        <p className="text-muted mb-4">
          Choose whether you are creating a new organization or requesting membership in an existing one.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <label className="form-label">Registration type</label>
        <div className="btn-group w-100 mb-4" role="group">
          <button
            type="button"
            className={`btn ${mode === "CREATE" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => changeMode("CREATE")}
            disabled={busy}
          >
            Create organization
          </button>
          <button
            type="button"
            className={`btn ${mode === "JOIN" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => changeMode("JOIN")}
            disabled={busy}
          >
            Join existing organization
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            className="form-control"
            type="text"
            value={form.full_name}
            onChange={(event) => setField("full_name", event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <PasswordInput
            id="password"
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Organization type</label>
          <select
            className="form-select"
            value={form.organization_type}
            onChange={(event) => changeOrganizationType(event.target.value)}
            disabled={busy}
          >
            <option value="SCHOOL">School</option>
            <option value="SUPPLIER">Supplier</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            {mode === "CREATE" ? "New organization name" : "Existing organization name"}
          </label>
          <input
            className="form-control"
            type="text"
            value={form.organization_name}
            onChange={(event) => setField("organization_name", event.target.value)}
            required
          />
          {mode === "JOIN" && (
            <div className="form-text">
              Your request will remain pending until an organization administrator approves it.
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Requested responsibility</label>
          <select
            className="form-select"
            value={form.responsibility}
            onChange={(event) => setField("responsibility", event.target.value)}
            disabled={busy}
          >
            {responsibilities.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-dark w-100" disabled={busy}>
          {busy
            ? "Submitting…"
            : mode === "CREATE"
              ? "Create organization"
              : "Request membership"}
        </button>

        <div className="text-center mt-3 small">
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
