import client from "./client";


export async function getOrganizationMembers(
  organizationId
) {

  const { data } = await client.get(
    `/organizations/${organizationId}/memberships`
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
    `/organizations/${organizationId}/memberships/${userId}/responsibilities`,
    {
      responsibility_code:
        responsibilityCode,
    }
  );

  return data;
}

export async function addOrganizationMember(
  organizationId,
  email,
  responsibilityCode
) {
  const { data } = await client.post(
    `/organizations/${organizationId}/memberships`,
    {
      email,
      responsibility_code:
        responsibilityCode,
    }
  );

  return data;
}