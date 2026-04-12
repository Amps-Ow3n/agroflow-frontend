import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { ROLES } from "../../utils/roleHelpers";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.FARMER,
    adminCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.role === ROLES.ADMIN && !form.adminCode) {
      setError("Admin access code is required.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        admin_access_code:
          form.role === ROLES.ADMIN ? form.adminCode : null
      });

      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100">

      <div className="row min-vh-100">

        {/* LEFT PANEL (MATCHED STYLE WITH LOGIN) */}
        <div
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5 text-white"
          style={{
            background: "linear-gradient(135deg,#14532d,#0f172a)"
          }}
        >
          <h1 className="fw-bold display-5">AgroFlow</h1>

          <p className="lead mt-3 text-white-50">
            Agricultural intelligence system for supply coordination, risk monitoring, and delivery tracking.
          </p>

          <div className="mt-4">
            <div className="mb-2">✔ Supply capacity verification</div>
            <div className="mb-2">✔ Commitment risk detection</div>
            <div className="mb-2">✔ Delivery performance tracking</div>
            <div>✔ Role-based secure access</div>
          </div>
        </div>

        {/* RIGHT PANEL (MATCHED TO LOGIN CARD STYLE) */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-light p-3 p-md-4">

          <div className="w-100" style={{ maxWidth: 420 }}>

            <div className="card border-0 shadow-sm rounded-3">

              <div className="card-body p-3 p-md-4">

                <h5 className="fw-semibold mb-1">Create account</h5>

                <p className="text-muted small mb-4">
                  Request operator access to AgroFlow
                </p>

                {error && (
                  <div className="alert alert-danger small py-2">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success small py-2">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* ROLE */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Role
                    </label>
                    <select
                      name="role"
                      className="form-select"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value={ROLES.FARMER}>Farmer Operator</option>
                      <option value={ROLES.ADMIN}>System Administrator</option>
                    </select>
                  </div>

                  {/* ADMIN CODE */}
                  {form.role === ROLES.ADMIN && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Admin Access Code
                      </label>
                      <input
                        type="password"
                        name="adminCode"
                        className="form-control"
                        value={form.adminCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  {/* SUBMIT */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

            {/* FOOTER LINK (MATCH LOGIN STYLE) */}
            <div className="text-center mt-3 small">
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;