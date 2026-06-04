import BuyerOverview from "../../dashboards/buyer/BuyerOverview";
import VerificationCenter from "../../workflows/verification/VerificationCenter";

const BuyerDashboard = () => {
  return (
    <div className="d-flex flex-column gap-4">

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h4 className="fw-bold">
            Buyer Intelligence Dashboard
          </h4>

          <p className="text-muted small mb-0">
            Review available supply capacity,
            farmer reliability and execution signals.
          </p>

        </div>
      </div>

      <BuyerOverview />

      <VerificationCenter />

    </div>
  );
};

export default BuyerDashboard;