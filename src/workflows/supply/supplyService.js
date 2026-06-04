import apiClient from "../../services/apiClient";

/*
-----------------------------------
SUPPLY SERVICE (CAPACITY LAYER)
"What is possible"
-----------------------------------
*/

export async function createSupply(data) {
  const res = await apiClient.post("/supply", data);
  return res.data;
}

export async function getSupplies(params = {}) {
  const res = await apiClient.get("/supply", { params });
  return res.data;
}

export async function updateSupply(id, data) {
  const res = await apiClient.put(`/supply/${id}`, data);
  return res.data;
}

export async function deleteSupply(id) {
  const res = await apiClient.delete(`/supply/${id}`);
  return res.data;
}