import api from "./api";

/*
---------------------------------------
CREATE COMMITMENT
POST /commitment
---------------------------------------
*/
export async function createCommitment(data) {
  const response = await api.post("/commitment", data);
  return response.data;
}

/*
---------------------------------------
GET ALL COMMITMENTS
GET /commitments
---------------------------------------
*/
export async function getCommitments(token) {
  const response = await api.get("/commitments", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
/*
---------------------------------------
UPDATE COMMITMENT
PUT /commitment/{id}
---------------------------------------
*/
export async function updateCommitment(id, data) {
  const response = await api.put(`/commitment/${id}`, data);
  return response.data;
}

/*
---------------------------------------
DELETE COMMITMENT
DELETE /commitment/{id}
---------------------------------------
*/
export async function deleteCommitment(id) {
  const response = await api.delete(`/commitment/${id}`);
  return response.data;
}
