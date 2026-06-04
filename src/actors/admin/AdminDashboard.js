import AdminOverview from "../../dashboards/admin/AdminOverview";
import SystemHealth from "../../dashboards/admin/SystemHealth";
import Reports from "../../dashboards/admin/Reports";

import RiskDashboard from "../../intelligence/risk/RiskDashboard";
import FeasibilityDashboard from "../../intelligence/feasibility/FeasibilityDashboard";
import WhyCenter from "../../intelligence/decisionLedger/WhyCenter";

const AdminDashboard = () => {
  return (
    <div className="d-flex flex-column gap-4">

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h4 className="fw-bold">
            AgroFlow Intelligence Dashboard
          </h4>

          <p className="text-muted small mb-0">
            Constraint-aware monitoring of supply,
            commitments, deliveries and system risk.
          </p>

        </div>
      </div>

      <AdminOverview />

      <SystemHealth />

      <RiskDashboard />

      <FeasibilityDashboard />

      <Reports />

      <WhyCenter />

    </div>
  );
};

export default AdminDashboard;