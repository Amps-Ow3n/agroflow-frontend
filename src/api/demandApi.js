import client from "./client";

export const createDemand = async (payload) => {
  const res = await client.post("/school/demand/create", payload);
  return res.data;
};

export const getSchoolDemands = async () => {
  const res = await client.get("/school/demands");
  return res.data;
};

export const getOpenDemands = async () => {
  const res = await client.get("/supplier/open-demands");
  return res.data;
};

export const updateDemand = async (id, payload) => {
  const res = await client.put(`/school/demand/${id}`, payload);
  return res.data;
};

export const deleteDemand = async (id) => {
  const res = await client.delete(`/school/demand/${id}`);
  return res.data;
};

export const getSchoolDeliveries = async () => {
  const res = await client.get("/school/deliveries");
  return res.data;
};