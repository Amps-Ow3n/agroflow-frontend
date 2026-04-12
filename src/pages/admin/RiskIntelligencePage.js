import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import AlertBox from "../../components/ui/AlertBox";
import Table from "../../components/ui/Table";
import PageNav from "../../components/navigation/PageNav";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRiskIntelligence } from "../../services/dashboardService";

const RiskIntelligencePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      const res = await getRiskIntelligence(token);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load risk intelligence data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  if (loading) return <LoadingSpinner message="Analyzing system risk signals..." />;
  if (error) return <EmptyState message={error} />;
  if (!data) return <EmptyState message="No risk intelligence data available" />;

  const { system_status, risk_alerts, farmer_risk_ranking, recommended_actions } = data;

  const sections = [
    { id: "system-status", label: "System Health" },
    { id: "active-alerts", label: "Risk Alerts" },
    { id: "reliability-ranking", label: "Risk Ranking" },
    { id: "recommendations", label: "Actions" }
  ];

  return (
    <PageContainer title="Risk Intelligence Center">

      <PageNav sections={sections} />

      {/* SYSTEM STATUS */}
      <div id="system-status" className="mb-4">
        <h6 className="text-uppercase text-muted small mb-2">
          System Status
        </h6>

        <AlertBox
          type={system_status === "STABLE" ? "success" : "warning"}
          message={`System is currently ${system_status}`}
        />
      </div>

      {/* ALERTS */}
      <div id="active-alerts" className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">

          <h6 className="mb-3">High Risk Alerts</h6>

          {risk_alerts.length === 0 ? (
            <EmptyState message="No high-risk farmers detected" />
          ) : (
            <div className="d-flex flex-column gap-2">
              {risk_alerts.map((alert, index) => (
                <AlertBox
                  key={index}
                  type="warning"
                  message={`Farmer #${alert.farmer_id} — ${alert.crop} overcommitment by ${alert.over_amount} units${
                    alert.prediction ? ` (Risk: ${alert.prediction}%)` : ""
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* TABLE */}
      <div id="reliability-ranking" className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">

          <h6 className="mb-3">Farmer Risk Ranking</h6>

          {farmer_risk_ranking.length === 0 ? (
            <EmptyState message="No reliability data available" />
          ) : (
            <div className="table-responsive">
              <Table
                columns={[
                  { Header: "Rank", accessor: "rank" },
                  { Header: "Farmer", accessor: "farmer_id" },
                  { Header: "Risk", accessor: "risk_level" },
                  { Header: "Prediction", accessor: "prediction" },
                  { Header: "Action", accessor: "actions" }
                ]}
                data={farmer_risk_ranking.map((f, idx) => ({
                  rank: idx + 1,
                  farmer_id: f.farmer_id,
                  risk_level: f.risk_level,
                  prediction: `${f.prediction}%`,
                  actions: (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/admin/farmer/${f.farmer_id}`)}
                    >
                      View
                    </button>
                  )
                }))}
              />
            </div>
          )}

        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div id="recommendations" className="card shadow-sm border-0">
        <div className="card-body p-3 p-md-4">

          <h6 className="mb-3">Recommended Actions</h6>

          {recommended_actions.length === 0 ? (
            <EmptyState message="No recommended actions" />
          ) : (
            <ul className="list-group list-group-flush small">
              {recommended_actions.map((action, idx) => (
                <li key={idx} className="list-group-item px-0">
                  {action}
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>

    </PageContainer>
  );
};

export default RiskIntelligencePage;