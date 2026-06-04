import apiClient from "../../services/apiClient";

/*
-----------------------------------
DECISION LEDGER
"Why the system thinks this"
-----------------------------------
*/

export async function getDecisionLedger(farmerId) {
  const res = await apiClient.get(`/decision-ledger/${farmerId}`);
  return res.data;
}

export async function getSystemDecisions() {
  const res = await apiClient.get("/decision-ledger/system");
  return res.data;
}