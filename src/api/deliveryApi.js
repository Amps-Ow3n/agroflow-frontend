import client from "./client";

export const verifyDelivery = async (commitmentId, payload) => {
  const response = await client.post(
    `/delivery/verify/${commitmentId}`,
    payload
  );

  return response.data.delivery;
};

export const correctDeliveryVerification = async (
  deliveryId,
  payload
) => {
  const response = await client.put(
    `/delivery/verification/${deliveryId}`,
    payload
  );

  return response.data.delivery;
};