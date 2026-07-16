import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export default function SchoolLayout() {
  const {
    logout
  } = useContext(AuthContext);

  const navigate = useNavigate();

  function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    logout();

    navigate("/login");
  }

  const navLinkClass = ({ isActive }) =>
    `d-flex align-items-center gap-3 text-decoration-none rounded-3 px-3 py-2 ${
      isActive
        ? "bg-dark text-white"
        : "text-secondary"
    }`;

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        backgroundColor: "#f6f8fa"
      }}
    >

      {/* SIDEBAR */}
      <aside
        className="d-flex flex-column border-end bg-white"
        style={{
          width: "270px",
          minHeight: "100vh"
        }}
      >

        {/* BRAND */}
        <div className="px-4 py-4 border-bottom">

          <div className="d-flex align-items-center gap-2">

            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-dark text-white fw-bold"
              style={{
                width: "38px",
                height: "38px"
              }}
            >
              A
            </div>

            <div>

              <h5 className="fw-bold mb-0">
                AgroFlow
              </h5>

              <small className="text-muted">
                Supply intelligence
              </small>

            </div>

          </div>

        </div>


        {/* WORKSPACE */}
        <div className="px-4 py-4">

          <small
            className="text-uppercase text-muted fw-semibold"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em"
            }}
          >
            Workspace
          </small>

          <div className="mt-2">

            <div className="fw-semibold">
              School Procurement
            </div>

            <small className="text-muted">
              Manage demand and deliveries
            </small>

          </div>

        </div>


        {/* NAVIGATION */}
        <nav className="px-3">

          <small
            className="text-uppercase text-muted fw-semibold px-3"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em"
            }}
          >
            Operations
          </small>

          <div className="d-flex flex-column gap-2 mt-3">

            <NavLink
              to="/school"
              className={navLinkClass}
            >
              <span>▦</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/school/demands/new"
              className={navLinkClass}
            >
              <span>＋</span>
              <span>Create Demand</span>
            </NavLink>

            <NavLink
              to="/school/demands"
              className={navLinkClass}
            >
              <span>☷</span>
              <span>My Demands</span>
            </NavLink>

            <NavLink
              to="/school/deliveries"
              className={navLinkClass}
            >
              <span>✓</span>
              <span>Deliveries</span>
            </NavLink>

          </div>

        </nav>


        {/* FOOTER */}
        <div className="mt-auto p-3">

          <div
            className="rounded-3 p-3 mb-3"
            style={{
              backgroundColor: "#f6f8fa"
            }}
          >

            <small className="text-muted d-block">
              Procurement workspace
            </small>

            <small className="fw-semibold">
              Track reality, not assumptions.
            </small>

          </div>

          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            Log out
          </button>

        </div>

      </aside>


      {/* MAIN WORKSPACE */}
      <main className="flex-grow-1">

        <header
          className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between"
        >

          <div>

            <small className="text-muted">
              School workspace
            </small>

            <div className="fw-semibold">
              Procurement operations
            </div>

          </div>

          <div
            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "38px",
              height: "38px"
            }}
          >
            S
          </div>

        </header>


        <div className="p-3 p-md-4 p-lg-5">

          <Outlet />

        </div>

      </main>

    </div>
  );
}