import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseLinks = {
  school: [
    ["/school", "Dashboard"],
    ["/school/procurements", "Procurements"],
    ["/school/procurements/new", "New Procurement"],
  ],

  supplier: [
    ["/supplier", "Dashboard"],
    ["/supplier/commitments", "Commitments"],
    ["/supplier/profile", "Supplier Profile"],
  ],

  admin: [
    ["/admin", "System Overview"],
  ],
};

export default function WorkspaceLayout({ type }) {
  const { user, logout, isOrganizationAdmin, isSupplierAdmin } = useAuth();
  const navigate = useNavigate();
  const nav = [
  ...(baseLinks[type] || []),
];

if (
  (type === "school" && isOrganizationAdmin) ||
  (
    type === "supplier" &&
    (isOrganizationAdmin || isSupplierAdmin)
  )
) {
  nav.push([
    type === "supplier"
      ? "/supplier/organization"
      : "/school/organization",
    "Organization",
  ]);
}

  return (
    <div className="af-workspace d-flex min-vh-100 bg-light">
      <aside className="af-sidebar bg-white border-end p-3" style={{ width: 260 }}>
        <div className="fw-bold fs-5 mb-1">AgroFlow</div>
        <div className="small text-muted mb-4">
          {type === "school" ? "School procurement" : type === "supplier" ? "Supplier operations" : "System administration"}
        </div>
        <nav className="af-workspace-nav d-flex flex-column gap-1">
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === `/${type}`} className={({isActive}) =>
              `text-decoration-none rounded-3 px-3 py-2 ${isActive ? "bg-dark text-white" : "text-secondary"}`
            }>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-5">
          <div className="small text-muted mb-2">{user?.full_name || user?.name}</div>
          <button
            className="btn btn-outline-danger btn-sm w-100"
            onClick={async () => {
              const confirmed = window.confirm(
                "Are you sure you want to log out?"
              );

              if (!confirmed) return;

              try {
                await logout();
              } finally {
                navigate("/login", { replace: true });
              }
            }}
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="af-workspace-main flex-grow-1 p-3 p-md-4 p-lg-5"><Outlet /></main>
    </div>
  );
}
