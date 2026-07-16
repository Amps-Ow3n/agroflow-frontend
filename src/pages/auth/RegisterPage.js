import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../api/authApi";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "supplier",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    if (!name) {
      console.warn(
        "Missing input name:",
        e.target
      );

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser(form);

      setSuccess(
        "Account created successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        "Registration failed"
      );

      console.log(
        "REGISTER ERROR FULL:",
        err?.response?.data
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100">

      <div className="row min-vh-100">

        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-dark text-white p-5">

          <div style={{ maxWidth: "500px" }}>

            <h1 className="fw-bold mb-4">
              AgroFlow
            </h1>

            <h3 className="mb-4">
              Make supply chains visible before failure happens.
            </h3>

            <div className="mb-4">

              <h5>
                Why register?
              </h5>

              <p className="text-light">
                Registration creates your operational identity in the supply network.
              </p>

            </div>

            <div className="mb-3">

              <p>
                1. Register operational identity
              </p>

              <p>
                2. Connect supply sources
              </p>

              <p>
                3. Build commitments
              </p>

              <p>
                4. Deliver and build trust
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light p-4">

          <div
            className="card shadow-sm border-0 p-4 w-100"
            style={{ maxWidth: "500px" }}
          >

            <h2 className="fw-bold mb-2">
              Create Account
            </h2>

            <p className="text-muted mb-4">
              Create your operational identity
            </p>

            {error && (
              <ErrorState message={error} />
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            {!success && (

              <form onSubmit={handleSubmit}>

                <Input
                  label="Business / Organization Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Traders Ltd"
                />

                <Input
                  label="Business Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@supply.com"
                  type="email"
                />

                <Input
                  label="Create Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  type="password"
                />

                <div className="mb-4">

                  <label className="form-label fw-medium">
                    Account Type
                  </label>

                  <select
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                  >

                    <option value="supplier">
                      Supplier
                    </option>

                    <option value="school">
                      School
                    </option>

                  </select>

                </div>

                {loading ? (

                  <Loader
                    text="Creating account..."
                  />

                ) : (

                  <>

                    <Button
                      type="submit"
                      className="w-100"
                    >
                      Create Account
                    </Button>

                    <p className="mt-4 text-center text-muted">

                      Already have an account?{" "}

                      <Link
                        to="/login"
                        className="text-decoration-none"
                      >
                        Sign in
                      </Link>

                    </p>

                  </>

                )}

              </form>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}