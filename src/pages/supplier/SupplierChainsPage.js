import { useEffect, useState } from "react";
import { getSupplierCommitments } from "../../api/commitmentApi";
import client from "../../api/client";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import ChainNode from "../../components/chains/ChainNode";
import ChainValidationPanel from "../../components/chains/ChainValidationPanel";
import { getChainFeasibility, getChainRisk } from "../../api/chainApi";

export default function SupplierChainsPage() {
  const [commitments, setCommitments] = useState([]);
  const [selected, setSelected] = useState(null);

  const [chain, setChain] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOAD COMMITMENTS
  useEffect(() => {
    async function load() {
      try {
        const data = await getSupplierCommitments();
        setCommitments(data);
      } catch (err) {
        setError("Failed to load commitments");
      }
    }

    load();
  }, []);

  // BUILD CHAIN (LOGIC UNCHANGED)
  const buildChain = async (commitmentId) => {
    if (!commitmentId) return;

    try {
      setLoading(true);
      setError("");
      setChain(null);

      const res = await client.post(`/chain/build/${commitmentId}`);
      setChain(res.data);
      const [f, r] = await Promise.all([
  client.get(`/chain/feasibility/${commitmentId}`),
  client.get(`/chain/risk/${commitmentId}`)
]);

setFeasibility(f.data);
setRisk(r.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Chain build failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !chain) {
    return <Loader text="Building procurement intelligence..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Procurement Chain Intelligence</h2>
        <p className="text-muted">
          Trace how commitments are fulfilled through supply sources
        </p>
      </div>

      <div className="row g-4">

        {/* LEFT — COMMITMENT SELECTION */}
        <div className="col-lg-4">

          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Select Commitment</h6>

            <div className="d-flex flex-column gap-2">
              {commitments.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelected(c.id);
                    setChain(null);
                  }}
                  className={`p-2 border rounded cursor-pointer ${
                    selected === c.id ? "border-primary bg-light" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="fw-bold">{c.product}</div>
                  <div className="text-muted small">
                   {c.promised_qty} kg • {c.school_name}
                  </div>
                </div>
              ))}
            </div>

            {!selected && (
              <div className="text-muted small mt-3">
                Select a commitment to analyze allocation flow
              </div>
            )}

            {selected && (
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => buildChain(selected)}
                disabled={loading}
              >
                {loading ? "Building..." : "Build Allocation Chain"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — INTELLIGENCE OUTPUT */}
        <div className="col-lg-8">

          {/* EMPTY STATE */}
          {!chain && (
            <div className="card p-4 text-muted">
              <h6 className="fw-bold">Allocation Intelligence</h6>
              <p>
                Select a commitment to visualize how supply sources
                fulfill demand over time.
              </p>
            </div>
          )}

          {/* CHAIN RESULT */}
          {chain && (
            <div className="d-flex flex-column gap-3">

              {/* SUMMARY CARD */}
              <div className="card shadow-sm border-0 p-3">
                <h5 className="fw-bold">Chain Summary</h5>

                <div className="row">
                  <div className="col-md-6">
                    <div>Status: <b>{chain.status}</b></div>
                    <div>Promised: {chain.promised_qty} kg</div>
                    <div>Allocated: {chain.allocated_qty} kg</div>
                    <div>Shortfall: {chain.shortfall} kg</div>
                  </div>

                  <div className="col-md-6">
                    <div>Risk Level: {chain.risk?.risk_level}</div>
                    <div>Chain Hops: {chain.risk?.hops}</div>
                  </div>
                </div>
              </div>
              {/* STEP 8 — VALIDATION ENGINE OUTPUT */}
{chain && (
  <div className="mt-3">
    <ChainValidationPanel
      feasibility={feasibility}
      risk={risk}
    />
  </div>
)}
              {/* TRACEABILITY LAYER */}
              <div className="card shadow-sm border-0 p-3">
                <h5 className="fw-bold mb-3">
                  Traceability Map (Source → Commitment)
                </h5>

                {chain.plan?.allocations?.length === 0 ? (
                  <p className="text-muted">No allocations found</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {chain.plan.allocations.map((a, index) => (
  <ChainNode
    key={`${a.source_id}-${index}`}
    node={{
      source_id: a.source_id,
      actor_name: a.source_name,
      actor_type: a.source_type,
      allocated_qty: a.allocated_qty,
      chain_position: index + 1
    }}
  />
))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}