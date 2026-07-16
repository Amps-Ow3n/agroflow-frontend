import client from "./client";

export const getSchools = async () => {
  const response = await client.get("/schools");
  return response.data;
};