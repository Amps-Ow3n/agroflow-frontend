import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { getMyFeasibility } from "../../services/feasibilityService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import FeasibilitySummary from "../../components/feasibility/FeasibilitySummary";
import OvercommitmentAlert from "../../components/feasibility/OvercommitmentAlert";
import PageNav from "../../components/navigation/PageNav";

const FeasibilityPage = () => {
  const [feasibility, setFeasibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeasibility = async () => {
    setLoading(true);
    try {
      const data = await getMyFeasibility();
      setFeasibility(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching feasibility report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeasibility();
  }, []);

  if (loading) return <LoadingSpinner message="Running feasibility analysis..." />;
  if (error) return <EmptyState message={error} />;
  if (!feasibility) return <EmptyState message="No feasibility data available" />;

  const sections = [
    { id: "overcommitment", label: "Overcommitments" },
    { id: "summary", label: "Analysis" }
  ];

  return (
    <PageContainer
      title="Feasibility Intelligence Engine"
      interpretation="Evaluate whether your commitments match your production capacity."
    >

      <PageNav sections={sections} />

      <div className="d-flex flex-column gap-4">

        {/* ALERTS */}
        {feasibility.over_commitments?.length > 0 && (
          <div id="overcommitment">
            <OvercommitmentAlert
              overcommitments={feasibility.over_commitments}
            />
          </div>
        )}

        {/* INFO TEXT */}
        <p className="text-muted small mb-0">
          The feasibility engine continuously evaluates supply commitments against production capacity and risk thresholds.
        </p>

        {/* SUMMARY */}
        <div id="summary" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <FeasibilitySummary feasibility={feasibility} />
          </div>
        </div>

      </div>

    </PageContainer>
  );
};

export default FeasibilityPage;