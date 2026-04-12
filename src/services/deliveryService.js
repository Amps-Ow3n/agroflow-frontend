import api from "./api";

/*
---------------------------------------
LOG WEEKLY DELIVERY
POST /delivery
---------------------------------------
*/
export async function logDelivery({
  commitment_id,
  delivered_qty,
  week_start,
  week_end,
}) {

  const response = await api.post("/delivery", {
    commitment_id,
    delivered_qty,
    week_start,
    week_end,
  });

  return response.data;

}
/*
---------------------------------------
GET ALL DELIVERIES
GET /deliveries?farmer_id=&crop=
---------------------------------------
*/
// deliveryService.js
export async function getDeliveries({ farmer_id, crop } = {}, token) {
  if (!token) throw new Error("No token provided for authentication");
  if (!farmer_id) throw new Error("No farmer_id provided");

  const response = await api.get("/deliveries", {
    params: { farmer_id, crop },
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}
/*
---------------------------------------
GET DELIVERY HISTORY FOR COMMITMENT
GET /deliveries/{commitment_id}
---------------------------------------
*/
export async function getCommitmentDeliveryHistory(commitmentId) {
  const response = await api.get(`/deliveries/${commitmentId}`);
  return response.data;
}
