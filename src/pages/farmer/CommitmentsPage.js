import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import CommitmentForm from "../../components/commitments/CommitmentForm";
import CommitmentTable from "../../components/commitments/CommitmentTable";
import { getCommitments } from "../../services/commitmentService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageNav from "../../components/navigation/PageNav";
import { useCallback } from "react";
const CommitmentsPage = () => {
  const { token } = useAuth();
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommitments = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getCommitments(token);
    setCommitments(data);
  } catch (err) {
    setError(err.response?.data?.detail || "Error fetching commitments");
  } finally {
    setLoading(false);
  }
}, [token]);

useEffect(() => {
  fetchCommitments();
}, [fetchCommitments]);

  const sections = [
    { id: "commitment-form", label: "Create" },
    { id: "commitment-table", label: "Records" }
  ];

  return (
    <PageContainer
      title="Commitment Management"
      interpretation="Manage supply commitments within safe production capacity."
    >

      <PageNav sections={sections} />

      <p className="text-muted small mb-4">
        Commitments are validated against capacity and risk models to prevent overcommitment.
      </p>

      <div className="d-flex flex-column gap-4">

        {/* FORM */}
        <div id="commitment-form" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">

            <h6 className="mb-3">New Commitment</h6>

            <CommitmentForm onSuccess={fetchCommitments} />

          </div>
        </div>

        {/* TABLE */}
        <div id="commitment-table" className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">

            <h6 className="mb-3">Commitment Records</h6>

            {loading && <LoadingSpinner message="Loading commitments..." />}
            {!loading && error && <EmptyState message={error} />}
            {!loading && !error && commitments.length === 0 && (
              <EmptyState message="No commitments found" />
            )}

            {!loading && !error && commitments.length > 0 && (
              <div className="table-responsive">
                <CommitmentTable
                  commitments={commitments}
                  onUpdated={fetchCommitments}
                />
              </div>
            )}

          </div>
        </div>

      </div>

    </PageContainer>
  );
};

export default CommitmentsPage;