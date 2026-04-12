import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "farmer") {
        navigate("/farmer/dashboard", { replace: true });
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100">

      <div className="row min-vh-100">

        {/* LEFT PANEL */}
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

        {/* RIGHT PANEL */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-light p-3 p-md-4">

          <div className="w-100" style={{ maxWidth: 420 }}>

            <div className="card border-0 shadow-sm rounded-3">

              <div className="card-body p-3 p-md-4">

                <h5 className="fw-semibold mb-1">Welcome back</h5>

                <p className="text-muted small mb-4">
                  Sign in to continue to your dashboard
                </p>

                {error && (
                  <div className="alert alert-danger small py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Password
                    </label>

                    <div className="input-group">

                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>

                    </div>
                  </div>

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
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3 small">
                    New user?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => navigate("/register")}
                    >
                      Create account
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;