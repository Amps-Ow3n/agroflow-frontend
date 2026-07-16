import client from "./client";

export const verifyDelivery = async (commitmentId, payload) => {
  const response = await client.post(
    `/delivery/verify/${commitmentId}`,
    payload
  );

  return response.data.delivery; // ✅ IMPORTANT CHANGE
};