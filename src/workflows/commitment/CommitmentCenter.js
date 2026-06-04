import React, { useEffect, useState, useCallback } from "react";

import PageContainer from "../../shared/layout/AppLayout";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import CommitmentForm from "./CommitmentForm";
import CommitmentTable from "./CommitmentTable";

import { getCommitments } from "../../workflows/commitment/commitmentService";

const CommitmentCenter = () => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommitments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCommitments();
      setCommitments(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load commitments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommitments();
  }, [fetchCommitments]);

  const sections = [
    { id: "create", label: "Create Commitment" },
    { id: "table", label: "Commitment Records" },
  ];

  return (
    <PageContainer
      title="Commitment Intelligence Center"
      interpretation="Commitments represent farmer intent — always accepted, but continuously evaluated for risk and feasibility."
    >
      <PageNav sections={sections} />

      {/* FORM */}
      <div id="create" className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 p-md-4">
          <h6 className="mb-3">New Commitment</h6>

          <CommitmentForm onSuccess={fetchCommitments} />
        </div>
      </div>

      {/* TABLE */}
      <div id="table" className="card shadow-sm border-0">
        <div className="card-body p-3 p-md-4">
          <h6 className="mb-3">Commitment Records</h6>

          {loading && <LoadingSpinner message="Loading commitments..." />}

          {!loading && error && <EmptyState message={error} />}

          {!loading && !error && commitments.length === 0 && (
            <EmptyState message="No commitments found" />
          )}

          {!loading && commitments.length > 0 && (
            <CommitmentTable
              commitments={commitments}
              onUpdated={fetchCommitments}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CommitmentCenter;