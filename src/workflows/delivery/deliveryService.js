import apiClient from "../../services/apiClient";

/*
-----------------------------------
DELIVERY SERVICE (REALITY LAYER)
"What actually happened"
-----------------------------------
*/

export async function logDelivery(payload) {
  const res = await apiClient.post("/delivery", payload);
  return res.data;
}

export async function getDeliveries(params = {}) {
  const res = await apiClient.get("/deliveries", { params });
  return res.data;
}

export async function getCommitmentDeliveryHistory(commitmentId) {
  const res = await apiClient.get(`/deliveries/${commitmentId}`);
  return res.data;
}