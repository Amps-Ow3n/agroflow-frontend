import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

import SupplySummaryCard from "../../components/dashboard/SupplySummaryCard";
import CommitmentSummaryCard from "../../components/dashboard/CommitmentSummaryCard";
import DeliveryPerformanceCard from "../../components/dashboard/DeliveryPerformanceCard";
import RiskAlertCard from "../../components/dashboard/RiskAlertCard";
import ReliabilityScoreCard from "../../components/dashboard/ReliabilityScoreCard";

import { getAdminDashboard, getAdminFeasibilitySummary } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";
import { formatPercentage } from "../../utils/calculatePercentage";
import PageNav from "../../components/navigation/PageNav";

const AdminDashboard = () => {

  const { token } = useAuth();

  const [data, setData] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const dashboard = await getAdminDashboard(token);
        const feasibilityData = await getAdminFeasibilitySummary();

        setData(dashboard);
        setFeasibility(feasibilityData);

      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) return <LoadingSpinner message="Loading system intelligence..." />;
  if (error) return <EmptyState message={error} />;
  if (!data) return <EmptyState message="No data available" />;

  const systemDeliveryRate =
    data.total_promised && data.total_delivered
      ? formatPercentage(data.total_delivered, data.total_promised)
      : null;

  return (
    <PageContainer title="System Intelligence Dashboard">

      <PageNav sections={[
        { id: "delivery", label: "Delivery" },
        { id: "feasibility", label: "Feasibility" },
        { id: "summary", label: "Summary" }
      ]} />

      <p className="text-muted small mb-4">
        Real-time system-wide intelligence across supply, delivery, and risk signals.
      </p>

      {systemDeliveryRate && (
        <div id="delivery" className="alert alert-success small mb-4">
          <strong>Delivery Rate:</strong> {systemDeliveryRate}
        </div>
      )}

      {feasibility && (
        <div id="feasibility" className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Feasibility Health</h6>

            <div className="row g-2 small">
              <div className="col-6 col-md-3"><strong>Farmers:</strong> {feasibility.total_farmers}</div>
              <div className="col-6 col-md-3"><strong>Overcommitted:</strong> {feasibility.overcommitted_farmers}</div>
              <div className="col-6 col-md-3"><strong>Overruns:</strong> {feasibility.total_overcommitments}</div>
              <div className="col-6 col-md-3"><strong>Score:</strong> {(feasibility.system_feasibility_score * 100).toFixed(1)}%</div>
            </div>

          </div>
        </div>
      )}

      <div id="summary" className="row g-3">

        <div className="col-12 col-md-6 col-xl-4">
          <SupplySummaryCard data={data.supply_summary} />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <CommitmentSummaryCard data={data.commitment_summary} />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <DeliveryPerformanceCard data={data.delivery_performance} />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <RiskAlertCard alerts={data.risk_alerts} />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <ReliabilityScoreCard scores={data.reliability_scores} />
        </div>

      </div>

    </PageContainer>
  );
};

export default AdminDashboard;