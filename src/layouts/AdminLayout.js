import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export default function AdminLayout() {
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


        {/* WORKSPACE IDENTITY */}
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
              System Intelligence
            </div>

            <small className="text-muted">
              Administrative control center
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
            Monitor
          </small>

          <div className="d-flex flex-column gap-2 mt-3">

            <NavLink
              to="/admin/dashboard"
              className={navLinkClass}
            >
              <span>▦</span>
              <span>System Overview</span>
            </NavLink>

            <NavLink
              to="/admin/failures"
              className={navLinkClass}
            >
              <span>⚠</span>
              <span>Failure Drilldown</span>
            </NavLink>

          </div>


          <small
            className="text-uppercase text-muted fw-semibold px-3 d-block mt-4"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em"
            }}
          >
            Audit
          </small>

          <div className="d-flex flex-column gap-2 mt-3">

            <NavLink
              to="/admin/truth-audit"
              className={navLinkClass}
            >
              <span>◉</span>
              <span>Truth Audit</span>
            </NavLink>

            <NavLink
              to="/admin/truth-ledger"
              className={navLinkClass}
            >
              <span>☷</span>
              <span>Truth Ledger</span>
            </NavLink>

          </div>

        </nav>


        {/* SIDEBAR FOOTER */}
        <div className="mt-auto p-3">

          <div
            className="rounded-3 p-3 mb-3"
            style={{
              backgroundColor: "#f6f8fa"
            }}
          >

            <small className="text-muted d-block">
              System status
            </small>

            <div className="d-flex align-items-center gap-2 mt-2">

              <span
                className="rounded-circle bg-success"
                style={{
                  width: "8px",
                  height: "8px"
                }}
              />

              <small className="fw-semibold">
                Monitoring active
              </small>

            </div>

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

        {/* TOP BAR */}
        <header
          className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between"
        >

          <div>

            <small className="text-muted">
              Administrative workspace
            </small>

            <div className="fw-semibold">
              Supply network visibility and risk monitoring
            </div>

          </div>

          <div
            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "38px",
              height: "38px"
            }}
          >
            A
          </div>

        </header>


        {/* PAGE CONTENT */}
        <div className="p-3 p-md-4 p-lg-5">

          <Outlet />

        </div>

      </main>

    </div>
  );
}