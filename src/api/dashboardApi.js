import client from "./client";

export async function getOrganizationDashboard(organizationId) {
  const { data } = await client.get(
    `/organizations/${organizationId}/dashboard`
  );
  return data;
}
