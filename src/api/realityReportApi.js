import client from "./client";

export async function getRealityReport(procurementId) {
  const { data } = await client.get(
    `/procurements/${procurementId}/reality-report`
  );
  return data;
}
