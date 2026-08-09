import React, { useEffect, useState } from "react";

import {
    getSupplierDashboard
} from "../api/dashboardApi";

import StatusBadge from "../components/common/StatusBadge";

export default function SupplierTrustPanel({
    trustScore = null,
    trustConfidence = null
}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(
        trustScore === null
    );
    const [error, setError] = useState("");

    /*
     * SCHOOL CONTEXT
     *
     * If the school dashboard supplies trust data,
     * use that data directly.
     *
     * Do NOT call /dashboard/supplier/overview.
     */
    useEffect(() => {

        if (trustScore !== null) {

            setData({
                reliability_score: trustScore,
                reliability_confidence:
                    trustConfidence || "UNKNOWN"
            });

            setLoading(false);
            setError("");

            return;
        }

        /*
         * SUPPLIER CONTEXT
         *
         * Only suppliers without supplied trust data
         * fetch their own supplier dashboard.
         */
        async function loadDashboard() {

            try {

                const response =
                    await getSupplierDashboard();

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

    }, [trustScore, trustConfidence]);


    if (loading) {

        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                    Loading supplier trust...
                </div>
            </div>
        );

    }


    if (error) {

        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                    <div className="text-danger">
                        {error}
                    </div>
                </div>
            </div>
        );

    }


    if (!data) {
        return null;
    }


    const score =
        Number(
            data.reliability_score ??
            data.supplier_trust_avg ??
            0
        );


    const confidence =
        data.reliability_confidence ??
        data.supplier_trust_confidence ??
        "UNKNOWN";


    const trustStatus =
        score >= 80
            ? "TRUSTED"
            : score >= 60
                ? "MODERATE"
                : "LOW_TRUST";


    const confidenceLabel =
        confidence === "STABLE"
            ? "Stable evidence"
            : confidence === "LOW_SAMPLE"
                ? "Low sample warning"
                : confidence === "LOW_SAMPLE_WARNING"
                    ? "Low sample warning"
                    : confidence === "NO_DATA"
                        ? "No verified history"
                        : confidence;


    return (

        <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

                <h5 className="fw-bold">
                    Supplier Trust
                </h5>

                <h2 className="mt-3">
                    {score.toFixed(1)}%
                </h2>

                <div className="mt-2">
                    <StatusBadge
                        status={trustStatus}
                    />
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

        </div>

    );
}