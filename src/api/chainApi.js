import client from "./client";

export const buildChain = async (commitmentId) => {
  const response = await client.post(`/chain/build/${commitmentId}`);
  return response.data;
};

export const getChain = async (commitmentId) => {
  const response = await client.get(
    `/commitments/${commitmentId}/chain`
  );
  return response.data;
};

export const getChainFeasibility = async (commitmentId) => {
  const response = await client.get(
    `/chain/feasibility/${commitmentId}`
  );
  return response.data;
};

export const getChainRisk = async (commitmentId) => {
  const response = await client.get(
    `/chain/risk/${commitmentId}`
  );
  return response.data;
};