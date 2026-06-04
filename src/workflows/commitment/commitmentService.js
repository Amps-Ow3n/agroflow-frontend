import apiClient from "../../services/apiClient";

/*
-----------------------------------
COMMITMENT SERVICE (INTENT LAYER)
"What is promised"
-----------------------------------
*/

export async function createCommitment(data) {
  const res = await apiClient.post("/commitment", data);
  return res.data;
}

export async function getCommitments(params = {}) {
  const res = await apiClient.get("/commitments", { params });
  return res.data;
}

export async function updateCommitment(id, data) {
  const res = await apiClient.put(`/commitment/${id}`, data);
  return res.data;
}

export async function deleteCommitment(id) {
  const res = await apiClient.delete(`/commitment/${id}`);
  return res.data;
}