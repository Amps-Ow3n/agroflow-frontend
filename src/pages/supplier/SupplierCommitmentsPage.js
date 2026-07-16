import { useEffect, useState } from "react";
import CommitmentForm from "../../components/commitments/CommitmentForm";
import CommitmentList from "../../components/commitments/CommitmentList";
import { getSupplierCommitments } from "../../api/commitmentApi";
import { getSchools } from "../../api/schoolApi";
import { getMySources } from "../../api/sourceApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

export default function SupplierCommitmentsPage() {
  const [commitments, setCommitments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCommitments() {
    const data = await getSupplierCommitments();
    setCommitments(data);
  }

  async function loadSchools() {
    const data = await getSchools();
    setSchools(data);
  }

  async function loadSources() {
    const data = await getMySources();
    setSources(data);
  }

  async function loadAll() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        loadCommitments(),
        loadSchools(),
        loadSources()
      ]);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <Loader text="Loading commitment system..." />;
  if (error) return <ErrorState message={error} />;

  // derived planning metrics (Type C: computed view, not stored truth)
  const totalCapacity = sources.reduce(
    (sum, s) => sum + (Number(s.qty_available) || 0),
    0
  );

  const activeSources = sources.length;

  const uniqueProducts = new Set(sources.map(s => s.product)).size;

  const earliestAvailability = sources.reduce((earliest, s) => {
    if (!s.available_from) return earliest;
    if (!earliest) return s.available_from;
    return new Date(s.available_from) < new Date(earliest)
      ? s.available_from
      : earliest;
  }, null);

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Create Supplier Commitment</h2>
        <p className="text-muted">
          Create a delivery promise based on verified demand
        </p>
      </div>

      {/* TOP CONTEXT GRID */}
      <div className="row g-3 mb-4">

        {/* DEMAND CONTEXT WILL COME FROM FORM (LEFT INTEL PANEL) */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h6 className="fw-bold mb-2">School Demand Summary</h6>
            <p className="text-muted small mb-3">
              Selected demand will appear when creating a commitment
            </p>

            <div className="text-muted small">
              <div>No demand selected</div>
              <div className="mt-2">
                Choose from Open Demands or pass a demand context
              </div>
            </div>
          </div>
        </div>

        {/* SUPPLIER PLANNING */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h6 className="fw-bold mb-3">Supplier Planning Summary</h6>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Active Sources</span>
              <span className="fw-bold">{activeSources}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Capacity</span>
              <span className="fw-bold">{totalCapacity} kg</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Products</span>
              <span className="fw-bold">{uniqueProducts}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted">Earliest Availability</span>
              <span className="fw-bold">
                {earliestAvailability || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKFLOW */}
      <div className="row g-4">

        {/* FORM */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-2">Commitment Declaration</h6>
            <p className="text-muted small mb-3">
              Convert demand into a binding delivery promise
            </p>

            <CommitmentForm
              schools={schools}
              onSuccess={loadCommitments}
            />
          </div>
        </div>

        {/* REGISTRY */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Commitment Registry</h6>
            <CommitmentList commitments={commitments} />
          </div>
        </div>

      </div>
    </div>
  );
}