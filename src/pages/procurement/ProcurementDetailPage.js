import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProcurement,
  submitProcurement,
  cancelProcurement,
} from "../../api/procurementApi";
import { getTimeline, getAudit } from "../../api/eventApi";
import { getPurchaseOrder } from "../../api/purchaseOrderApi";
import { getProcurementCommitment } from "../../api/commitmentApi";
import { getProcurementDeliveries } from "../../api/deliveryApi";
import { getApiError } from "../../utils/errors";
import {
  Page,
  Loading,
  Status,
  Alert,
  Empty,
} from "../../components/common/Page";

export default function ProcurementDetailPage() {
  const { id } = useParams();

  const [p, setP] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [audit, setAudit] = useState([]);
  const [po, setPo] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);

    try {
      const [r, t, a] = await Promise.all([
        getProcurement(id),
        getTimeline(id),
        getAudit(id),
      ]);

      setP(r);
      setTimeline(t);
      setAudit(a);

      try {
        const poResponse = await getPurchaseOrder(id);
        setPo(poResponse.purchase_order || null);
      } catch (_) {
        setPo(null);
      }

      try {
        const commitmentResponse =
          await getProcurementCommitment(id);

        setCommitments(
          Array.isArray(commitmentResponse)
            ? commitmentResponse
            : commitmentResponse
              ? [commitmentResponse]
              : []
        );
      } catch (_) {
        setCommitments([]);
      }

      try {
        const deliveryResponse =
          await getProcurementDeliveries(id);

        setDeliveries(
          Array.isArray(deliveryResponse)
            ? deliveryResponse
            : deliveryResponse?.deliveries || []
        );
      } catch (_) {
        setDeliveries([]);
      }
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function action(fn) {
    setBusy(true);
    setError("");

    try {
      await fn();
      await load();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Page title="Procurement">
        <Loading />
      </Page>
    );
  }

  if (!p) {
    return (
      <Page title="Procurement">
        <Alert>{error || "Not found."}</Alert>
      </Page>
    );
  }

  const x = p.procurement || p;
  const items = p.items || [];
  const status = x.status;

  const acceptedCommitment = commitments.find(
    (c) => c.status === "ACCEPTED"
  );

  const awaitingInspectionDelivery = deliveries.find(
    (d) => d.delivery_status === "AWAITING_INSPECTION"
  );

  return (
    <Page
      title={x.procurement_identifier || `Procurement #${x.id}`}
      subtitle={x.title}
    >
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <Status value={status} />

        {["DRAFT", "SUBMITTED"].includes(status) && (
          <Link
            className="btn btn-outline-secondary btn-sm"
            to={`/school/procurements/${id}/edit`}
          >
            Edit
          </Link>
        )}

        {status === "DRAFT" && (
          <button
            className="btn btn-dark btn-sm"
            disabled={busy}
            onClick={() => action(() => submitProcurement(id))}
          >
            Submit
          </button>
        )}

        {status === "SELECTED" && (
          <Link
            className="btn btn-dark btn-sm"
            to={`/school/procurements/${id}/order/new`}
          >
            Create purchase order
          </Link>
        )}

        {acceptedCommitment &&
          ["COMMITTED", "DELIVERY"].includes(status) &&
          !awaitingInspectionDelivery && (
            <Link
              className="btn btn-dark btn-sm"
              to={`/school/procurements/${id}/delivery/new`}
            >
              Record delivery
            </Link>
          )}

        {awaitingInspectionDelivery && (
          <Link
            className="btn btn-warning btn-sm"
            to={`/school/deliveries/${awaitingInspectionDelivery.id}/inspect`}
          >
            Inspect delivery
          </Link>
        )}

        {["SUBMITTED", "EVALUATION"].includes(status) && (
          <Link
            className="btn btn-outline-dark btn-sm"
            to={`/school/procurements/${id}/evaluation`}
          >
            {status === "EVALUATION"
              ? "Continue evaluation"
              : "Evaluate suppliers"}
          </Link>
        )}

        {["DRAFT", "SUBMITTED"].includes(status) && (
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={busy}
            onClick={() => {
              const r = window.prompt("Cancellation reason");

              if (r) {
                action(() => cancelProcurement(id, r));
              }
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 mb-3">
            <h5>Requirement</h5>

            <dl className="row mb-0">
              <dt className="col-sm-4">Item</dt>
              <dd className="col-sm-8">
                {items[0]?.item_name || x.item_name || "—"}
              </dd>

              <dt className="col-sm-4">Required by</dt>
              <dd className="col-sm-8">
                {x.required_by_date}
              </dd>

              <dt className="col-sm-4">Location</dt>
              <dd className="col-sm-8">
                {x.location}
              </dd>

              <dt className="col-sm-4">Method</dt>
              <dd className="col-sm-8">
                {x.procurement_method}
              </dd>
            </dl>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5>Purchase order</h5>

            {po ? (
              <>
                <dl className="row mb-3">
                  <dt className="col-sm-5">Order number</dt>
                  <dd className="col-sm-7">
                    {po.order_number || "—"}
                  </dd>

                  <dt className="col-sm-5">Status</dt>
                  <dd className="col-sm-7">
                    <Status value={po.status} />
                  </dd>

                  <dt className="col-sm-5">Expected delivery</dt>
                  <dd className="col-sm-7">
                    {po.expected_delivery_date || "—"}
                  </dd>
                </dl>

                <hr />

                <h6>Commitment</h6>

                {acceptedCommitment ? (
                  <div className="small">
                    <div>
                      <strong>Status:</strong>{" "}
                      <Status value={acceptedCommitment.status} />
                    </div>

                    <div className="mt-1">
                      <strong>Promised quantity:</strong>{" "}
                      {acceptedCommitment.promised_qty ?? "—"}
                    </div>
                  </div>
                ) : (
                  <Empty>
                    No accepted supplier commitment yet.
                  </Empty>
                )}
              </>
            ) : (
              <Empty>
                No purchase order recorded yet.
              </Empty>
            )}
          </div>

          <div className="card border-0 shadow-sm p-4 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Delivery</h5>

              {acceptedCommitment &&
                ["COMMITTED", "DELIVERY"].includes(status) &&
                !awaitingInspectionDelivery && (
                  <Link
                    className="btn btn-outline-dark btn-sm"
                    to={`/school/procurements/${id}/delivery/new`}
                  >
                    Record delivery
                  </Link>
                )}

              {awaitingInspectionDelivery && (
                <Link
                  className="btn btn-outline-warning btn-sm"
                  to={`/school/deliveries/${awaitingInspectionDelivery.id}/inspect`}
                >
                  Inspect
                </Link>
              )}
            </div>

            {deliveries.length ? (
              <div className="mt-3">
                {deliveries.map((d) => (
                  <div
                    className="border rounded p-3 mb-2"
                    key={d.id}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>
                        Delivery #{d.id}
                      </strong>

                      <Status value={d.delivery_status} />
                    </div>

                    <div className="small text-muted mt-1">
                      Delivery date:{" "}
                      {d.delivery_date || "—"}
                    </div>

                    {d.delivery_status ===
                      "AWAITING_INSPECTION" && (
                      <div className="small mt-2">
                        This delivery is waiting for school
                        inspection.
                      </div>
                    )}

                    {d.delivery_status === "ACCEPTED" && (
                      <div className="small mt-2">
                        Delivery accepted.
                      </div>
                    )}

                    {d.delivery_status === "REJECTED" && (
                      <div className="small mt-2">
                        Delivery rejected.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <Empty>
                  No deliveries recorded yet.
                </Empty>
              </div>
            )}
          </div>

          <div className="card border-0 shadow-sm p-4 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Evidence</h5>

              <Link
                className="btn btn-outline-dark btn-sm"
                to={`/school/procurements/${id}/evidence/new`}
              >
                Upload evidence
              </Link>
            </div>

            {(p.evidence || []).length ? (
              <ul className="list-group list-group-flush">
                {p.evidence.map((e) => (
                  <li
                    className="list-group-item px-0 d-flex justify-content-between"
                    key={e.id}
                  >
                    <span>
                      {e.document_name ||
                        e.original_filename}
                    </span>

                    <span className="small text-muted">
                      {e.visibility}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>
                No evidence recorded yet.
              </Empty>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 mb-3">
            <h5>Timeline</h5>

            {timeline.length ? (
              <ul className="list-group list-group-flush">
                {timeline.slice(0, 12).map((e) => (
                  <li
                    className="list-group-item px-0"
                    key={e.id}
                  >
                    <strong>
                      {e.title || e.event_type}
                    </strong>

                    <div className="small text-muted">
                      {e.occurred_at} · {e.actor_name}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No events.</Empty>
            )}
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5>Audit</h5>

            {audit.length ? (
              <div className="small">
                {audit.slice(0, 10).map((e) => (
                  <div
                    className="border-bottom py-2"
                    key={e.id}
                  >
                    {e.action}

                    <div className="text-muted">
                      {e.created_at} · {e.actor_name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No audit events.</Empty>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}