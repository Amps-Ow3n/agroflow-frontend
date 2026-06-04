import apiClient from "./apiClient";

/* GET CURRENT USER PROFILE */
export async function getCurrentUser() {
  const res = await apiClient.get("/users/me");
  return res.data;
}

/* ADMIN: LIST ALL USERS */
export async function getAllUsers(params = {}) {
  const res = await apiClient.get("/users", { params });
  return res.data;
}

/* ADMIN: UPDATE USER ROLE OR STATUS */
export async function updateUser(userId, data) {
  const res = await apiClient.put(`/users/${userId}`, data);
  return res.data;
}

/* ADMIN: DELETE USER */
export async function deleteUser(userId) {
  const res = await apiClient.delete(`/users/${userId}`);
  return res.data;
}