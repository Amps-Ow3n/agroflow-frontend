import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import DeliveryForm from "./DeliveryForm";
import DeliveryTable from "./DeliveryTable";
import DeliverySummary from "./DeliverySummary";

import { getDeliveries } from "./deliveryService";

const DeliveryCenter = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDeliveries();

      const normalized = Array.isArray(data) ? data : data?.deliveries || [];

      setDeliveries(normalized);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const sections = [
    { id: "input", label: "Log Delivery" },
    { id: "analysis", label: "Performance" },
    { id: "history", label: "Records" },
  ];

  return (
    <PageContainer
      title="Delivery Reality Center"
      interpretation="Tracks real-world execution of commitments. This is the system’s truth layer."
    >
      <PageNav sections={sections} />

      <div className="d-flex flex-column gap-4">

        {/* INPUT */}
        <div id="input" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <DeliveryForm onSuccess={fetchDeliveries} />
          </div>
        </div>

        {/* ANALYSIS (light aggregation only) */}
        <div id="analysis" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <h6 className="mb-3">Delivery Performance Overview</h6>
            <DeliverySummary deliveries={deliveries} />
          </div>
        </div>

        {/* HISTORY */}
        <div id="history" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <h6 className="mb-3">Delivery Records</h6>

            {loading && <LoadingSpinner message="Loading deliveries..." />}
            {!loading && error && <EmptyState message={error} />}
            {!loading && !error && deliveries.length === 0 && (
              <EmptyState message="No deliveries found" />
            )}

            {!loading && deliveries.length > 0 && (
              <DeliveryTable
                deliveries={deliveries}
                onUpdated={fetchDeliveries}
              />
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default DeliveryCenter;