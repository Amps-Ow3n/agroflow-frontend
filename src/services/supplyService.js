import api from "./api";

export async function createSupply(data) {
  const response = await api.post("/supply", data);
  return response.data;
}

export async function getSupplies(params = {}) {
  const response = await api.get("/supply", { params });
  return response.data;
}

export async function updateSupply(id, data) {
  const response = await api.put(`/supply/${id}`, data);
  return response.data;
}

export async function deleteSupply(id) {
  const response = await api.delete(`/supply/${id}`);
  return response.data;
}