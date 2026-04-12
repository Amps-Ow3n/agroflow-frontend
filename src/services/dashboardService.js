import api from "./api";

/* ---------------- FARMER DASHBOARD ---------------- */
export async function getFarmerDashboard(farmerId, token) {
  if (!token) throw new Error("No token provided for authentication");
  const response = await api.get(`/dashboard/farmer/${farmerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    supply_summary: response.data.supply_summary || [],
    commitment_summary: response.data.commitment_summary || [],
    delivery_performance: response.data.delivery_performance || {},
    risk_alerts: response.data.risk_alerts || [],
    reliability_scores: response.data.reliability_scores || [],
    total_promised: response.data.total_promised || 0,
    total_delivered: response.data.total_delivered || 0,
    decision_intelligence: response.data.decision_intelligence || [],
  };
}

/* ---------------- ADMIN DASHBOARD ---------------- */
export async function getAdminDashboard(token) {
  const res = await api.get("/dashboard/admin", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    supply_summary: res.data.supply_summary || [],
    commitment_summary: res.data.commitment_summary || [],
    delivery_performance: res.data.delivery_performance || {},
    risk_alerts: res.data.risk_alerts || [],
    reliability_scores: res.data.reliability_scores || [],
    total_promised: res.data.total_promised || 0,
    total_delivered: res.data.total_delivered || 0,
  };
}

export async function getAdminFeasibilitySummary() {
  const res = await api.get("/dashboard/admin/feasibility");
  return res.data;
}

/* ---------------- RISK INTELLIGENCE ---------------- */
export async function getRiskIntelligence(token) {
  if (!token) throw new Error("No token provided for authentication");

  const res = await api.get("/risk-intelligence", {
    headers: { Authorization: `Bearer ${token}` },
  });

 

  return {
    system_status: res.data.system_status || "UNKNOWN",
    risk_alerts: res.data.risk_alerts || [],
    farmer_risk_ranking: res.data.farmer_risk_ranking || [],
    recommended_actions: res.data.recommended_actions || [],
  };
}