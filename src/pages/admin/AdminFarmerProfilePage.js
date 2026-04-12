import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

import SupplySummaryCard from "../../components/dashboard/SupplySummaryCard";
import CommitmentSummaryCard from "../../components/dashboard/CommitmentSummaryCard";
import DeliveryPerformanceCard from "../../components/dashboard/DeliveryPerformanceCard";
import RiskAlertCard from "../../components/dashboard/RiskAlertCard";
import ReliabilityScoreCard from "../../components/dashboard/ReliabilityScoreCard";

import FeasibilitySummary from "../../components/feasibility/FeasibilitySummary";
import OvercommitmentAlert from "../../components/feasibility/OvercommitmentAlert";
import DeliveryHistoryTable from "../../components/deliveries/DeliveryHistoryTable";

import { getFarmerDashboard } from "../../services/dashboardService";
import { getDeliveries } from "../../services/deliveryService";
import { getAllFeasibility } from "../../services/feasibilityService";

import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import { formatPercentage } from "../../utils/calculatePercentage";
import PageNav from "../../components/navigation/PageNav";

const AdminFarmerProfilePage = () => {
  const { farmerId } = useParams();
  const { token } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarmerData = async () => {
    if (!farmerId) return;
    setLoading(true);
    setError(null);

    try {
      const [dashboardRes, deliveriesRes, allFeasibility] = await Promise.all([
        getFarmerDashboard(farmerId, token),
        getDeliveries({ farmer_id: farmerId }, token),
        getAllFeasibility(token)
      ]);

      setDashboard(dashboardRes || {});
      setDeliveries(Array.isArray(deliveriesRes) ? deliveriesRes : []);

      if (Array.isArray(allFeasibility)) {
        const farmerFeas = allFeasibility.find(
          f => String(f.farmer_id) === String(farmerId)
        );
        setFeasibility(farmerFeas || null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load farmer data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, [farmerId]);

  if (loading) return <LoadingSpinner message="Loading farmer intelligence profile..." />;
  if (error) return <EmptyState message={error} />;
  if (!dashboard) return <EmptyState message="Farmer data not found" />;

  const farmerDeliveryRate =
    dashboard.total_promised && dashboard.total_delivered
      ? formatPercentage(dashboard.total_delivered, dashboard.total_promised)
      : null;

  const sections = [
    { id: "delivery-summary", label: "Delivery Overview" },
    { id: "supply-commitments", label: "Supply & Commitments" },
    { id: "feasibility", label: "Feasibility Engine" },
    { id: "deliveries", label: "Delivery History" },
    { id: "reliability-risk", label: "Risk & Reliability" }
  ];

  return (
    <PageContainer title={`Farmer Intelligence Profile — ${farmerId}`}>

      <PageNav sections={sections} />

      {farmerDeliveryRate && (
        <div
          id="delivery-summary"
          className="alert alert-primary small shadow-sm border-0"
        >
          <strong>Delivery Fulfillment Rate:</strong>{" "}
          <span className="ms-1">{farmerDeliveryRate}</span>
        </div>
      )}

      {/* SUPPLY + COMMITMENT */}
      <div id="supply-commitments" className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-lg-6">
          <SupplySummaryCard data={dashboard.supply_summary} />
        </div>
        <div className="col-12 col-lg-6">
          <CommitmentSummaryCard data={dashboard.commitment_summary} />
        </div>
      </div>

      {/* FEASIBILITY */}
      <div id="feasibility" className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">

          <div className="mb-3">
            <OvercommitmentAlert
              overcommitments={feasibility?.over_commitments || []}
            />
          </div>

          <FeasibilitySummary farmerId={farmerId} />
        </div>
      </div>

      {/* DELIVERIES */}
      <div id="deliveries" className="row g-3 g-md-4 mb-4">

        <div className="col-12 col-xl-5">
          <DeliveryPerformanceCard data={dashboard.delivery_performance} />
        </div>

        <div className="col-12 col-xl-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-2 p-md-3">
              <div className="table-responsive">
                <DeliveryHistoryTable
                  deliveries={deliveries.map(d => ({
                    ...d,
                    week_start: formatDate(d.week_start),
                    week_end: formatDate(d.week_end),
                    logged_at: d.logged_at ? formatDate(d.logged_at) : undefined
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RISK + RELIABILITY */}
      <div id="reliability-risk" className="row g-3 g-md-4">

        <div className="col-12 col-md-6">
          <ReliabilityScoreCard scores={dashboard.reliability_scores} />
        </div>

        <div className="col-12 col-md-6">
          <RiskAlertCard alerts={dashboard.risk_alerts} />
        </div>

      </div>

    </PageContainer>
  );
};

export default AdminFarmerProfilePage;