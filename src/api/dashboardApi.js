import client from "./client";

export const getSupplierDashboard = async () => {
  const response = await client.get("/dashboard/supplier/overview");

  const data = response.data;

  return {
    ...data,

    // normalize reliability into flat number for UI safety
    reliability_score: data.reliability_score?.score ?? 0,
    reliability_confidence: data.reliability_score?.confidence ?? "unknown"
  };
};

export const getSchoolDashboard = async () => {
  const response = await client.get(
    "/school/overview"
  );
  return response.data;
};

export const getSystemDashboard = async () => {
  const response = await client.get(
    "/dashboard/system/overview"
  );
  return response.data;
};

export const getSystemFailureMap = async () => {
  const response = await client.get(
    "/dashboard/system/failure-map"
  );
  return response.data;
};

export const getSystemBottlenecks = async () => {
  const response = await client.get(
    "/dashboard/system/bottlenecks"
  );
  return response.data;
};

export const getSupplierBottlenecks = async () => {
  const response = await client.get("/supplier/bottlenecks");
  return response.data;
};

// ------------------------------------------
// Supplier Capacity Intelligence
// ------------------------------------------

export const getSupplierCapacity = async () => {

  const response = await client.get(
    "/supplier/capacity"
  );

  return response.data;

};




// ------------------------------------------
// Supplier Delivery Reliability
// ------------------------------------------

export const getSupplierReliability = async () => {

  const response = await client.get(
    "/supplier/reliability"
  );

  return response.data;

};




// ------------------------------------------
// Admin Network Capacity
// ------------------------------------------

export const getNetworkCapacity = async () => {

  const response = await client.get(
    "/dashboard/system/capacity-network"
  );

  return response.data;

};




// ------------------------------------------
// Admin Supplier Ranking
// ------------------------------------------

export const getReliabilityRanking = async () => {

  const response = await client.get(
    "/dashboard/system/reliability-ranking"
  );

  return response.data;

};




// ------------------------------------------
// Admin Risk Alerts
// ------------------------------------------

export const getRiskAlerts = async () => {

  const response = await client.get(
    "/dashboard/system/risk-alerts"
  );

  return response.data;

};