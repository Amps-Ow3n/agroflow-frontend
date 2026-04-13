import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFarmerDashboard } from "../../services/dashboardService";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

import SupplySummaryCard from "../../components/dashboard/SupplySummaryCard";
import CommitmentSummaryCard from "../../components/dashboard/CommitmentSummaryCard";
import DeliveryPerformanceCard from "../../components/dashboard/DeliveryPerformanceCard";
import RiskAlertCard from "../../components/dashboard/RiskAlertCard";
import ReliabilityScoreCard from "../../components/dashboard/ReliabilityScoreCard";
import WhyExplanationsCard from "../../components/dashboard/WhyExplanationsCard";

import PageContainer from "../../components/layout/PageContainer";
import PageNav from "../../components/navigation/PageNav";
import { useCallback } from "react";

const FarmerDashboard = () => {
  const { userId, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = useCallback(async () => {
  setLoading(true);
  try {
    const data = await getFarmerDashboard(userId, token);
    setDashboardData(data);
  } catch (err) {
    setError(err.response?.data?.detail || "Error fetching dashboard data");
  } finally {
    setLoading(false);
  }
}, [userId, token]);

useEffect(() => {
  if (!userId || !token) return;
  fetchDashboard();
}, [fetchDashboard, userId, token]);

  if (loading) return <LoadingSpinner message="Loading intelligence dashboard..." />;
  if (error) return <EmptyState message={error} />;
  if (!dashboardData) return <EmptyState message="No dashboard data available" />;

  const sections = [{ id: "overview", label: "Overview" }];

  const decisionData = Array.isArray(dashboardData.decision_intelligence)
    ? dashboardData.decision_intelligence
    : [];

  const fallbackCrop =
    dashboardData?.supply_summary?.[0]?.crop ||
    dashboardData?.commitment_summary?.[0]?.crop ||
    null;

  const fallbackZone =
    dashboardData?.supply_summary?.[0]?.zone ||
    dashboardData?.commitment_summary?.[0]?.zone ||
    null;

  const deliveryDataWithCrop = {
    ...(dashboardData.delivery_performance || {}),
    crop: dashboardData.delivery_performance?.crop || fallbackCrop,
    zone: dashboardData.delivery_performance?.zone || fallbackZone,
  };

  return (
    <PageContainer
      title="Farmer Intelligence Dashboard"
      interpretation="Real-time operational intelligence across supply, commitments, delivery performance, and risk signals."
    >

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-danger btn-sm"
          onClick={async () => {
            const confirmDelete = window.confirm("Permanently delete your account?");
            if (!confirmDelete) return;

            await fetch("https://agroflow-backend-ghom.onrender.com/farmer/delete-account", {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            alert("Account deleted");
            window.location.href = "/login";
          }}
        >
          Delete Account
        </button>
      </div>

      <p className="text-muted small mb-3">
        Monitor your agricultural operations, risk exposure, and fulfillment reliability in one unified system view.
      </p>

      <PageNav sections={sections} />

      {/* MAIN GRID */}
      <div id="overview" className="card shadow-sm border-0">
        <div className="card-body p-3 p-md-4">

          <h6 className="mb-4">Operational Overview</h6>

          <div className="row g-3">

            <div className="col-12 col-md-6 col-xl-4">
              <SupplySummaryCard data={dashboardData.supply_summary || []} decisionData={decisionData} />
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <CommitmentSummaryCard data={dashboardData.commitment_summary || []} decisionData={decisionData} />
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <DeliveryPerformanceCard data={deliveryDataWithCrop} decisionData={decisionData} />
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <RiskAlertCard alerts={dashboardData.risk_alerts || []} decisionData={decisionData} />
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <ReliabilityScoreCard scores={dashboardData.reliability_scores || []} />
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <WhyExplanationsCard decisionData={decisionData} />
            </div>

          </div>

        </div>
      </div>

    </PageContainer>
  );
};

export default FarmerDashboard;