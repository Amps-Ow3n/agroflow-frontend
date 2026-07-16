import client from "./client";

export const createCommitment = async (payload) => {
  const response = await client.post("/commitment/create", payload);
  return response.data;
};

export const getSupplierCommitments = async () => {
  const response = await client.get("/supplier/commitments");
  return response.data;
};