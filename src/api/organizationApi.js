import client from "./client";


export async function getOrganizationMembers(
  organizationId
) {
  const { data } = await client.get(
    `/organizations/${organizationId}/members`
  );

  return data;
}


export async function getOrganizationResponsibilities(
  organizationId
) {
  const { data } = await client.get(
    `/organizations/${organizationId}/responsibilities`
  );

  return data;
}


export async function assignMemberResponsibility(
  organizationId,
  userId,
  responsibilityCode
) {
  const { data } = await client.post(
    `/organizations/${organizationId}/members/${userId}/responsibilities`,
    {
      responsibility_code:
        responsibilityCode,
    }
  );

  return data;
}