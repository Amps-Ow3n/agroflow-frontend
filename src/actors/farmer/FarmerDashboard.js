import FarmerOverview from "../../dashboards/farmer/FarmerOverview";
import FarmerPerformance from "../../dashboards/farmer/FarmerPerformance";
import FeasibilityDashboard from "../../intelligence/feasibility/FeasibilityDashboard";
import WhyCenter from "../../intelligence/decisionLedger/WhyCenter";

const FarmerDashboard = () => {
  return (
    <div className="d-flex flex-column gap-4">

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h4 className="fw-bold">
            Farmer Intelligence Dashboard
          </h4>

          <p className="text-muted small mb-0">
            AgroFlow evaluates consistency between
            supply capacity, commitments and actual
            delivery behavior.
          </p>

        </div>
      </div>

      <FarmerOverview />

      <FarmerPerformance />

      <FeasibilityDashboard />

      <WhyCenter />

    </div>
  );
};

export default FarmerDashboard;