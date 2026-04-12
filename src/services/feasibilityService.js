import api from "./api";

/*
---------------------------------------
GET FEASIBILITY FOR ONE FARMER
GET /feasibility/{farmer_id}
(Admin only)
---------------------------------------
*/
export async function getMyFeasibility() {
  const response = await api.get("/feasibility/me");
  return response.data;
}
/*
---------------------------------------
GET FEASIBILITY FOR ALL FARMERS
GET /feasibility/all
(Admin only)
---------------------------------------
*/
export async function getAllFeasibility() {
  const response = await api.get("/feasibility/all");
  return response.data;
}

export async function getFarmerFeasibility(farmerId, token) {
  const response = await api.get(`/feasibility/${farmerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}