import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProcurement,
  submitProcurement,
  cancelProcurement,
  completeProcurement,
} from "../../api/procurementApi";

import {
  getTimeline,
  getAudit,
} from "../../api/eventApi";

import {
  getPurchaseOrder,
} from "../../api/purchaseOrderApi";

import {
  getProcurementCommitment,
  acceptCommitment,
  rejectCommitment,
} from "../../api/commitmentApi";

import {
  getProcurementDeliveries,
} from "../../api/deliveryApi";

import {
  getApiError,
} from "../../utils/errors";

import {
  Page,
  Loading,
  Status,
  Alert,
  Empty,
} from "../../components/common/Page";
import { useAuth } from "../../context/AuthContext";


export default function ProcurementDetailPage() {

  const { id } = useParams();
  const { hasPermission } = useAuth();

  const canUpdateProcurement = hasPermission("procurement:update");
  const canSubmitProcurement = hasPermission("procurement:submit");
  const canCreatePurchaseOrder = hasPermission("purchase_order:create");
  const canCreateDelivery = hasPermission("delivery:create");
  const canInspectDelivery = hasPermission("delivery:inspect") || hasPermission("inspection:create");
  const canEvaluate = hasPermission("procurement:evaluate");
  const canSeeRealityReport = hasPermission("reality_report:view");
  const canTransitionProcurement = hasPermission("procurement:transition");
  const canCompleteProcurement = canTransitionProcurement;
  const canCancelProcurement = hasPermission("procurement:cancel");


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

      const [
        procurement,
        timelineResponse,
        auditResponse,
      ] = await Promise.all([
        getProcurement(id),
        getTimeline(id),
        getAudit(id),
      ]);


      setP(procurement);
      setTimeline(timelineResponse);
      setAudit(auditResponse);


      // --------------------------------------------------
      // PURCHASE ORDER
      // --------------------------------------------------

      try {

        const poResponse =
          await getPurchaseOrder(id);

        setPo(
          poResponse.purchase_order ||
          null
        );

      } catch (_) {

        setPo(null);
      }


      // --------------------------------------------------
      // COMMITMENTS
      // --------------------------------------------------

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


      // --------------------------------------------------
      // DELIVERIES
      // --------------------------------------------------

      try {
  const deliveryResponse =
    await getProcurementDeliveries(id);

  let deliveryList = [];

  if (Array.isArray(deliveryResponse)) {
    deliveryList = deliveryResponse;
  } else if (
    Array.isArray(
      deliveryResponse?.deliveries
    )
  ) {
    deliveryList =
      deliveryResponse.deliveries;
  } else if (
    deliveryResponse?.delivery
  ) {
    deliveryList = [
      deliveryResponse.delivery,
    ];
  }

  setDeliveries(deliveryList);

} catch (e) {

  setDeliveries([]);

  setError(
    getApiError(
      e,
      "Unable to load delivery information."
    )
  );
}

    } catch (e) {

      setError(
        getApiError(e)
      );

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

      setError(
        getApiError(e)
      );

    } finally {

      setBusy(false);
    }
  }


  async function handleAcceptCommitment(
    commitmentId
  ) {

    await action(
      () =>
        acceptCommitment(
          commitmentId
        )
    );
  }


  async function handleCompleteProcurement() {
    const confirmed = window.confirm(
      "Close this procurement cycle as completed? This should only be done after the accepted inspection results are final."
    );

    if (!confirmed) return;

    await action(() => completeProcurement(id));
  }


  async function handleRejectCommitment(
    commitmentId
  ) {

    const reason =
      window.prompt(
        "Reason for rejecting this supplier commitment:"
      );

    if (!reason) {
      return;
    }

    await action(
      () =>
        rejectCommitment(
          commitmentId,
          reason
        )
    );
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

        <Alert>
          {error || "Not found."}
        </Alert>

      </Page>
    );
  }


  const x =
    p.procurement || p;

  const items =
    p.items || [];

  const status =
    x.status;


  // --------------------------------------------------
  // COMMITMENT STATE
  // --------------------------------------------------

  const submittedCommitments =
    commitments.filter(
      (c) =>
        c.status === "SUBMITTED"
    );


  const acceptedCommitments =
    commitments.filter(
      (c) =>
        c.status === "ACCEPTED"
    );


  const rejectedCommitments =
    commitments.filter(
      (c) =>
        c.status === "REJECTED"
    );


  const awaitingInspectionDelivery =
    deliveries.find(
      (d) =>
        d.delivery_status ===
        "AWAITING_INSPECTION"
    );


  const canRecordDelivery =
    acceptedCommitments.length > 0 &&
    ["COMMITTED", "DELIVERY"].includes(
      status
    ) &&
    !awaitingInspectionDelivery;


  return (

    <Page
      title={
        x.procurement_identifier ||
        `Procurement #${x.id}`
      }
      subtitle={x.title}
    >


      {/* ================================================= */}
      {/* TOP ACTIONS */}
      {/* ================================================= */}

      <div className="d-flex gap-2 mb-3 flex-wrap">

        <Status
          value={status}
        />


        {canUpdateProcurement && status === "DRAFT" && (

          <Link
            className="btn btn-outline-secondary btn-sm"
            to={`/school/procurements/${id}/edit`}
          >
            Edit
          </Link>

        )}


        {canSubmitProcurement && status === "DRAFT" && (

          <button
            className="btn btn-dark btn-sm"
            disabled={busy}
            onClick={() =>
              action(
                () =>
                  submitProcurement(id)
              )
            }
          >
            Submit
          </button>

        )}


        {canCreatePurchaseOrder && status === "SELECTED" && (

          <Link
            className="btn btn-dark btn-sm"
            to={`/school/procurements/${id}/order/new`}
          >
            Create purchase order
          </Link>

        )}


        {canCreateDelivery && canRecordDelivery && (

          <Link
            className="btn btn-dark btn-sm"
            to={`/school/procurements/${id}/delivery/new`}
          >
            Record delivery
          </Link>

        )}


        {canInspectDelivery && awaitingInspectionDelivery && (

          <Link
            className="btn btn-warning btn-sm"
            to={`/school/deliveries/${awaitingInspectionDelivery.id}/inspect`}
          >
            Inspect delivery
          </Link>

        )}


        {canEvaluate && ["SUBMITTED", "EVALUATION"].includes(
          status
        ) && (

          <Link
            className="btn btn-outline-dark btn-sm"
            to={`/school/procurements/${id}/evaluation`}
          >
            {status === "EVALUATION"
              ? "Continue evaluation"
              : "Evaluate suppliers"}
          </Link>

        )}


        {canSeeRealityReport && status !== "DRAFT" && status !== "CANCELLED" && (
          <Link
            className="btn btn-outline-primary btn-sm"
            to={`/school/procurements/${id}/reality-report`}
          >
            Reality Report
          </Link>
        )}


        {canCompleteProcurement && status === "ACCEPTED" && (
          <button
            className="btn btn-success btn-sm"
            disabled={busy}
            onClick={handleCompleteProcurement}
          >
            Complete procurement
          </button>
        )}


        {canCancelProcurement && ["DRAFT", "SUBMITTED"].includes(
          status
        ) && (

          <button
            className="btn btn-outline-danger btn-sm"
            disabled={busy}
            onClick={() => {

              const reason =
                window.prompt(
                  "Cancellation reason"
                );

              if (reason) {

                action(
                  () =>
                    cancelProcurement(
                      id,
                      reason
                    )
                );

              }

            }}
          >
            Cancel
          </button>

        )}

      </div>


      {error && (
        <Alert>
          {error}
        </Alert>
      )}


      <div className="row g-3">


        {/* ================================================= */}
        {/* LEFT COLUMN */}
        {/* ================================================= */}

        <div className="col-lg-7">


          {/* REQUIREMENT */}

          <div className="card border-0 shadow-sm p-4 mb-3">

            <h5>
              Requirement
            </h5>

            <dl className="row mb-0">

              <dt className="col-sm-4">
                Item
              </dt>

              <dd className="col-sm-8">
                {items[0]?.item_name ||
                  x.item_name ||
                  "—"}
              </dd>


              <dt className="col-sm-4">
                Required by
              </dt>

              <dd className="col-sm-8">
                {x.required_by_date}
              </dd>


              <dt className="col-sm-4">
                Location
              </dt>

              <dd className="col-sm-8">
                {x.location}
              </dd>


              <dt className="col-sm-4">
                Method
              </dt>

              <dd className="col-sm-8">
                {x.procurement_method}
              </dd>

            </dl>

          </div>


          {/* PURCHASE ORDER */}

          <div className="card border-0 shadow-sm p-4 mb-3">

            <h5>
              Purchase order
            </h5>


            {po ? (

              <>

                <dl className="row mb-3">

                  <dt className="col-sm-5">
                    Order number
                  </dt>

                  <dd className="col-sm-7">
                    {po.order_number || "—"}
                  </dd>


                  <dt className="col-sm-5">
                    Status
                  </dt>

                  <dd className="col-sm-7">
                    <Status
                      value={po.status}
                    />
                  </dd>


                  <dt className="col-sm-5">
                    Expected delivery
                  </dt>

                  <dd className="col-sm-7">
                    {po.expected_delivery_date ||
                      "—"}
                  </dd>

                </dl>

              </>

            ) : (

              <Empty>
                No purchase order recorded yet.
              </Empty>

            )}

          </div>


          {/* ================================================= */}
          {/* COMMITMENTS */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm p-4 mb-3">

            <div className="d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                Supplier commitments
              </h5>

              <Status
                value={status}
              />

            </div>


            {!commitments.length ? (

              <div className="mt-3">

                <Empty>
                  No supplier commitment has been submitted yet.
                </Empty>

              </div>

            ) : (

              <div className="mt-3">

                {commitments.map(
                  (commitment) => (

                    <div
                      className="border rounded p-3 mb-2"
                      key={commitment.id}
                    >

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <strong>
                            {commitment.item_name ||
                              `Commitment #${commitment.id}`}
                          </strong>

                          <div className="small text-muted">

                            {commitment.order_number &&
                              `${commitment.order_number} · `}

                            {commitment.promised_qty ??
                              "—"}{" "}

                            {commitment.unit ||
                              ""}

                          </div>

                          {commitment.delivery_start && (

                            <div className="small text-muted mt-1">

                              Delivery:
                              {" "}
                              {commitment.delivery_start}

                              {commitment.delivery_end &&
                                commitment.delivery_end !==
                                  commitment.delivery_start &&
                                ` → ${commitment.delivery_end}`}

                            </div>

                          )}

                        </div>


                        <Status
                          value={
                            commitment.status
                          }
                        />

                      </div>


                      {/* SUBMITTED */}

                      {commitment.status ===
                        "SUBMITTED" && (

                        <div className="mt-3 d-flex gap-2">

                          <button
                            className="btn btn-success btn-sm"
                            disabled={busy}
                            onClick={() =>
                              handleAcceptCommitment(
                                commitment.id
                              )
                            }
                          >
                            Accept commitment
                          </button>


                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={busy}
                            onClick={() =>
                              handleRejectCommitment(
                                commitment.id
                              )
                            }
                          >
                            Reject
                          </button>

                        </div>

                      )}


                      {/* ACCEPTED */}

                      {commitment.status ===
                        "ACCEPTED" && (

                        <div className="small text-success mt-2">

                          Commitment accepted.

                        </div>

                      )}


                      {/* REJECTED */}

                      {commitment.status ===
                        "REJECTED" && (

                        <div className="small text-danger mt-2">

                          Commitment rejected.

                          {commitment.rejection_reason && (

                            <div className="mt-1">

                              Reason:
                              {" "}
                              {commitment.rejection_reason}

                            </div>

                          )}

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            )}


            {/* WORKFLOW GUIDANCE */}

            {status === "ORDERED" &&
              submittedCommitments.length > 0 && (

              <div className="alert alert-info mt-3 mb-0">

                <strong>
                  Next step:
                </strong>{" "}

                Review and accept the supplier commitment.
                Once all purchase-order lines have accepted
                commitments, this procurement becomes
                <strong> COMMITTED</strong> and delivery can
                be recorded.

              </div>

            )}


            {status === "COMMITTED" && (

              <div className="alert alert-success mt-3 mb-0">

                <strong>
                  Commitment stage complete.
                </strong>{" "}

                The procurement is now ready for delivery.

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* DELIVERY */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm p-4 mt-3">

            <div className="d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                Delivery
              </h5>


              {canCreateDelivery && canRecordDelivery && (

                <Link
                  className="btn btn-outline-dark btn-sm"
                  to={`/school/procurements/${id}/delivery/new`}
                >
                  Record delivery
                </Link>

              )}


              {canInspectDelivery && awaitingInspectionDelivery && (

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

                {deliveries.map(
                  (d) => (

                    <div
                      className="border rounded p-3 mb-2"
                      key={d.id}
                    >

                      <div className="d-flex justify-content-between">

                        <strong>
                          Delivery #{d.id}
                        </strong>

                        <Status
                          value={
                            d.delivery_status
                          }
                        />

                      </div>


                      <div className="small text-muted mt-1">

                        Delivery date:
                        {" "}
                        {d.delivery_date || "—"}

                      </div>


                      {d.delivery_status ===
                        "AWAITING_INSPECTION" && (

                        <div className="small mt-2">

                          This delivery is waiting for
                          school inspection.

                        </div>

                      )}


                      {d.delivery_status ===
                        "ACCEPTED" && (

                        <div className="small mt-2">

                          Delivery accepted.

                        </div>

                      )}


                      {d.delivery_status ===
                        "REJECTED" && (

                        <div className="small mt-2">

                          Delivery rejected.

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="mt-3">

                <Empty>
                  No deliveries recorded yet.
                </Empty>

              </div>

            )}

          </div>


          {/* EVIDENCE */}

          <div className="card border-0 shadow-sm p-4 mt-3">

            <div className="d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                Evidence
              </h5>


              <Link
                className="btn btn-outline-dark btn-sm"
                to={`/school/procurements/${id}/evidence/new`}
              >
                Upload evidence
              </Link>

            </div>


            {(p.evidence || []).length ? (

              <ul className="list-group list-group-flush">

                {p.evidence.map(
                  (e) => (

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

                  )
                )}

              </ul>

            ) : (

              <Empty>
                No evidence recorded yet.
              </Empty>

            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT COLUMN */}
        {/* ================================================= */}

        <div className="col-lg-5">


          {/* TIMELINE */}

          <div className="card border-0 shadow-sm p-4 mb-3">

            <h5>
              Timeline
            </h5>


            {timeline.length ? (

              <ul className="list-group list-group-flush">

                {timeline
                  .slice(0, 12)
                  .map(
                    (e) => (

                      <li
                        className="list-group-item px-0"
                        key={e.id}
                      >

                        <strong>
                          {e.title ||
                            e.event_type}
                        </strong>

                        <div className="small text-muted">

                          {e.occurred_at}
                          {" · "}
                          {e.actor_name}

                        </div>

                      </li>

                    )
                  )}

              </ul>

            ) : (

              <Empty>
                No events.
              </Empty>

            )}

          </div>


          {/* AUDIT */}

          <div className="card border-0 shadow-sm p-4">

            <h5>
              Audit
            </h5>


            {audit.length ? (

              <div className="small">

                {audit
                  .slice(0, 10)
                  .map(
                    (e) => (

                      <div
                        className="border-bottom py-2"
                        key={e.id}
                      >

                        {e.action}

                        <div className="text-muted">

                          {e.created_at}
                          {" · "}
                          {e.actor_name}

                        </div>

                      </div>

                    )
                  )}

              </div>

            ) : (

              <Empty>
                No audit events.
              </Empty>

            )}

          </div>

        </div>

      </div>

    </Page>
  );
}