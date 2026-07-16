import React, { useEffect, useState } from "react";

import {
  getSupplierDashboard
} from "../api/dashboardApi";

import StatusBadge from "../components/common/StatusBadge";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";

export default function SupplierTrustPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getSupplierDashboard();

        setData(response);
      } catch (error) {
        console.error(
          "Supplier trust loading failed",
          error
        );

        setError(
          error?.response?.data?.detail ||
          "Unable to load supplier trust data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="card shadow-sm p-3">
        <Loader text="Loading supplier trust..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} />
    );
  }

  if (!data) {
    return null;
  }

  const trustScore =
    data.reliability_score ?? 0;

  const confidence =
    data.reliability_confidence ??
    "unknown";

  const trustStatus =
    trustScore >= 80
      ? "TRUSTED"
      : trustScore >= 60
      ? "MODERATE"
      : "LOW_TRUST";

  const confidenceLabel =
    confidence === "stable"
      ? "Stable evidence"
      : confidence === "low_sample_warning"
      ? "Low sample warning"
      : confidence;

  return (
    <div className="card shadow-sm p-3">

      <h5 className="fw-bold">
        Supplier Trust
      </h5>

      <h2 className="mt-3">
        {trustScore}%
      </h2>

      <div className="mt-2">
        <StatusBadge status={trustStatus} />
      </div>

      <div className="mt-3">

        <small className="text-muted d-block">
          Evidence confidence
        </small>

        <strong>
          {confidenceLabel}
        </strong>

      </div>

    </div>
  );
}