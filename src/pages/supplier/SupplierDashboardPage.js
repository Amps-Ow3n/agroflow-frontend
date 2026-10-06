import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSupplierCommitments } from "../../api/commitmentApi";
import { getMySupplierPerformance, getSupplierHistory } from "../../api/performanceApi";
import { getMySupplier } from "../../api/supplierApi";

import {
  Page,
  Loading,
  Empty,
  Status,
  Alert,
} from "../../components/common/Page";
import { getApiError } from "../../utils/errors";
import { useAuth } from "../../context/AuthContext";

function value(v) {
  return v == null ? "—" : v;
}

export default function SupplierDashboardPage() {
  const { activeOrganization } = useAuth();
  const [commitments, setCommitments] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getSupplierCommitments(),
        getMySupplier(),
        getMySupplierPerformance(),
        getSupplierHistory(),
      ]);

      if (!mounted) return;

      const [commitmentResult, supplierResult, performanceResult, historyResult] = results;

      if (commitmentResult.status === "fulfilled") {
        const value = commitmentResult.value;
        setCommitments(Array.isArray(value) ? value : value?.commitments || []);
      } else {
        setCommitments([]);
        setError(getApiError(commitmentResult.reason, "Unable to load supplier commitments."));
      }

      if (supplierResult.status === "fulfilled") {
        setSupplier(supplierResult.value);
      } else {
        setSupplier(null);
        setError((current) => current || getApiError(supplierResult.reason, "Unable to load supplier profile."));
      }

      if (performanceResult.status === "fulfilled") {
        setPerformance(performanceResult.value?.performance || null);
      } else {
        setPerformance(null);
      }

      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value?.history || []);
      } else {
        setHistory([]);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      title="Supplier operations"
      subtitle={`Manage ${activeOrganization?.name || "your supplier organization"}, commitments and historical performance.`}
      actions={
        <Link className="btn btn-dark" to="/supplier/profile">
          Supplier profile
        </Link>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && <Alert>{error}</Alert>}

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <small className="text-muted">Supplier</small>
                <strong>
                  {supplier?.supplier?.organization_name ||
                    supplier?.supplier?.supplier_code ||
                    "—"}
                </strong>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <small className="text-muted">Commitments</small>
                <strong className="fs-4">{commitments.length}</strong>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <small className="text-muted">Historical procurement cycles</small>
                <strong className="fs-4">{performance?.completed_procurement_count || history.length || 0}</strong>
                <span className="small text-muted">
                  {performance?.status === "AVAILABLE" ? "History available" : "No completed history yet"}
                </span>
              </div>
            </div>
          </div>

          {performance?.status === "AVAILABLE" && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">Supplier performance history</h5>
                  <div className="small text-muted">
                    Based on completed procurement cycles and verified delivery/inspection evidence.
                  </div>
                </div>
                <span className="badge text-bg-success">Available</span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted">Fulfilment</div>
                    <strong>{value(performance.fulfilment_rate)}{performance.fulfilment_rate != null ? "%" : ""}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted">Quantity variance</div>
                    <strong>{value(performance.quantity_variance_rate)}{performance.quantity_variance_rate != null ? "%" : ""}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted">On time</div>
                    <strong>{value(performance.on_time_delivery_rate)}{performance.on_time_delivery_rate != null ? "%" : ""}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted">Quality acceptance</div>
                    <strong>{value(performance.quality_acceptance_rate)}{performance.quality_acceptance_rate != null ? "%" : ""}</strong>
                  </div>
                </div>
              </div>

              <h6>Completed procurement cycles</h6>
              {history.length === 0 ? (
                <Empty>No completed procurement cycle records are available.</Empty>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Procurement</th>
                        <th>Promised</th>
                        <th>Delivered</th>
                        <th>Accepted</th>
                        <th>Deliveries</th>
                        <th>Inspections</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((cycle) => (
                        <tr key={`${cycle.procurement_id}-${cycle.commitment_id}`}>
                          <td>
                            <div className="fw-semibold">{cycle.procurement_identifier}</div>
                            <div className="small text-muted">{cycle.title}</div>
                          </td>
                          <td>{cycle.promised_qty}</td>
                          <td>{cycle.delivered_quantity}</td>
                          <td>{cycle.accepted_quantity}</td>
                          <td>{cycle.delivery_count}</td>
                          <td>
                            {cycle.inspection_count}
                            {Number(cycle.rejected_inspections || 0) > 0 && (
                              <span className="text-danger ms-1">({cycle.rejected_inspections} rejected)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="card border-0 shadow-sm p-4">
            <h5>Recent commitments</h5>
            {!commitments.length ? (
              <Empty>No commitments yet.</Empty>
            ) : (
              commitments.slice(0, 8).map((commitment) => (
                <div className="d-flex justify-content-between border-bottom py-2" key={commitment.id}>
                  <div>
                    <strong>
                      {commitment.item_name || commitment.product || `Commitment #${commitment.id}`}
                    </strong>
                    <div className="small text-muted">
                      {commitment.order_number && `${commitment.order_number} · `}
                      {commitment.promised_qty != null && `${commitment.promised_qty} ${commitment.unit || ""}`}
                    </div>
                  </div>
                  <Status value={commitment.status} />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Page>
  );
}
