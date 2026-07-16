import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      login({
        access_token: data.access_token,
        role: data.role,
      });

      if (data.role === "supplier") navigate("/supplier");
      else if (data.role === "school") navigate("/school");
      else if (data.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* LEFT PANEL (desktop only) */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-dark text-white p-5">
          <div style={{ maxWidth: "500px" }}>
            <h1 className="fw-bold mb-4">AgroFlow</h1>

            <h3 className="mb-4">
              Access your supply network intelligence system
            </h3>

            <p className="mb-4 text-light">
              Login verifies your identity and unlocks your operational workspace.
            </p>

            <div>
              <p>✔ Supplier dashboard</p>
              <p>✔ Commitments & chains</p>
              <p>✔ Delivery tracking</p>
              <p>✔ Trust analytics</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light p-4">

          <div className="card shadow-sm border-0 p-4 w-100" style={{ maxWidth: "450px" }}>

            <h2 className="fw-bold mb-2">Welcome back</h2>
            <p className="text-muted mb-4">
              Sign in to continue operating your supply network
            </p>

            {error && <ErrorState message={error} />}

            {!loading ? (
              <form onSubmit={handleLogin}>

                <Input
                  label="Business Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />

                <Button type="submit" className="w-100">
                  Login
                </Button>

                <p className="mt-4 text-center text-muted">
                  New here?{" "}
                  <Link to="/register" className="text-decoration-none">
                    Create account
                  </Link>
                </p>
              </form>
            ) : (
              <Loader text="Authenticating..." />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}