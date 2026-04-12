import api from "./api";

export async function getFarmers(token) {
  if (!token) throw new Error("No token provided");

  const response = await api.get("/farmers", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}