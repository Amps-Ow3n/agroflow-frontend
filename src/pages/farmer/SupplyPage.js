import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import SupplyTable from "../../components/supply/SupplyTable";
import SupplyForm from "../../components/supply/SupplyForm";
import { getSupplies } from "../../services/supplyService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageNav from "../../components/navigation/PageNav";

const SupplyPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const data = await getSupplies();
      setSupplies(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching supplies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const sections = [
    { id: "supply-form", label: "Add Supply" },
    { id: "supply-table", label: "Registry" }
  ];

  return (
    <PageContainer
      title="Supply Registry"
      interpretation="Register and manage agricultural supply records for system-wide matching and planning intelligence."
    >

      <PageNav sections={sections} />

      <p className="text-muted small mb-4">
        Supply entries feed the matching engine, enabling demand forecasting and commitment validation.
      </p>

      <div className="d-flex flex-column gap-4">

        {/* FORM */}
        <div id="supply-form" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <h5 className="mb-3">Add New Supply</h5>
            <SupplyForm onSuccess={fetchSupplies} />
          </div>
        </div>

        {/* STATES */}
        {loading && <LoadingSpinner message="Loading supply records..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && supplies.length === 0 && (
          <EmptyState message="No supply records found" />
        )}

        {/* TABLE */}
        {!loading && supplies.length > 0 && (
          <div id="supply-table" className="card shadow-sm border-0">
            <div className="card-body p-3 p-md-4">

              <h5 className="mb-3">Registered Supplies</h5>

              <div className="table-responsive">
                <SupplyTable supplies={supplies} onUpdated={fetchSupplies} />
              </div>

            </div>
          </div>
        )}

      </div>

    </PageContainer>
  );
};

export default SupplyPage;