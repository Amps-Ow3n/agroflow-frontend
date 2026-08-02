import client from "./client";

/*
------------------------------------------
Build Procurement Chain
------------------------------------------
*/

export const buildChain = async (commitmentId) => {
  const response = await client.post(
    `/chain/build/${commitmentId}`
  );

  return response.data;
};

/*
------------------------------------------
Read Existing Chain
------------------------------------------
*/

export const getChain = async (commitmentId) => {
  const response = await client.get(
    `/commitments/${commitmentId}/chain`
  );

  return response.data;
};

/*
------------------------------------------
Chain Feasibility
------------------------------------------
*/

export const getChainFeasibility = async (commitmentId) => {
  const response = await client.get(
    `/chain/feasibility/${commitmentId}`
  );

  return response.data;
};

/*
------------------------------------------
Chain Risk
------------------------------------------
*/

export const getChainRisk = async (commitmentId) => {
  const response = await client.get(
    `/chain/risk/${commitmentId}`
  );

  return response.data;
};