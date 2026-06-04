import apiClient from "../../services/apiClient";

/*
-----------------------------------
RISK ENGINE
"What might fail"
-----------------------------------
*/

export async function getRiskIntelligence() {
  const res = await apiClient.get("/risk-intelligence");

  return {
    system_status: res.data.system_status || "UNKNOWN",
    risk_alerts: res.data.risk_alerts || [],
    farmer_risk_ranking: res.data.farmer_risk_ranking || [],
    recommended_actions: res.data.recommended_actions || [],
  };
}