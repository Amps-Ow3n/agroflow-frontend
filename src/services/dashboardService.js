import apiClient from "./apiClient";

/* FARMER DASHBOARD (aggregation of supply + commitments + deliveries) */
export async function getFarmerDashboard(farmerId) {
  const res = await apiClient.get(`/dashboard/farmer/${farmerId}`);
  return res.data;
}

/* ADMIN DASHBOARD (system-wide intelligence view) */
export async function getAdminDashboard() {
  const res = await apiClient.get("/dashboard/admin");
  return res.data;
}

/* ADMIN FEASIBILITY (risk + feasibility aggregation) */
export async function getAdminFeasibilitySummary() {
  const res = await apiClient.get("/dashboard/admin/feasibility");

  return {
    system_status: res.data.system_status || "UNKNOWN",
    feasibility_score: res.data.feasibility_score || 0,
    risk_distribution: res.data.risk_distribution || {},
    flagged_farmers: res.data.flagged_farmers || [],
  };
}