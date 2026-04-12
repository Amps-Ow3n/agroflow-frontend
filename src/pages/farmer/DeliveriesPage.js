import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { getDeliveries } from "../../services/deliveryService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import DeliveryForm from "../../components/deliveries/DeliveryForm";
import DeliveryHistoryTable from "../../components/deliveries/DeliveryHistoryTable";
import PageNav from "../../components/navigation/PageNav";
import DeliverySummary from "../../components/deliveries/DeliverySummary";

const DeliveriesPage = () => {
  const { userId, token } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDeliveries({ farmer_id: userId }, token);

      if (Array.isArray(data)) setDeliveries(data);
      else if (data && Array.isArray(data.deliveries)) setDeliveries(data.deliveries);
      else setDeliveries([]);
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") setError(detail);
      else if (Array.isArray(detail)) setError(detail.map(e => e.msg).join(", "));
      else if (detail && typeof detail === "object") setError(detail.msg || "Unexpected server error");
      else setError("Error fetching deliveries");

      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchDeliveries();
  }, [userId, token]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/deliveries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    setEditingDelivery(null);
    fetchDeliveries();
  };

  const sections = [
    { id: "delivery-form", label: "Log Delivery" },
    { id: "delivery-history", label: "History" }
  ];

  return (
    <PageContainer
      title="Delivery Tracking"
      interpretation="Track fulfillment performance and maintain supply reliability across all delivery cycles."
    >
      <PageNav sections={sections} />

      <p className="text-muted small mb-4">
        Record deliveries and monitor performance trends to improve reliability scoring and procurement matching.
      </p>

      <div className="d-flex flex-column gap-4">

        {/* FORM */}
        <div id="delivery-form" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {editingDelivery ? "Edit Delivery Record" : "Log New Delivery"}
              </h5>

              {editingDelivery && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setEditingDelivery(null)}
                >
                  Cancel
                </button>
              )}
            </div>

            <DeliveryForm
              onSuccess={handleFormSuccess}
              existingDelivery={editingDelivery}
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <h5 className="mb-3">Delivery Summary</h5>
            <div className="table-responsive">
              <DeliverySummary deliveries={deliveries} />
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div id="delivery-history" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">

            <h5 className="mb-3">Delivery History</h5>

            {loading && <LoadingSpinner message="Loading deliveries..." />}
            {!loading && error && <EmptyState message={error} />}
            {!loading && !error && deliveries.length === 0 && (
              <EmptyState message="No delivery records found" />
            )}

            {!loading && !error && deliveries.length > 0 && (
              <div className="table-responsive">
                <DeliveryHistoryTable
                  deliveries={deliveries}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default DeliveriesPage;