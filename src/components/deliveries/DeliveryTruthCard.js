import React from "react";
import StatusBadge from "../common/StatusBadge";

export default function DeliveryTruthCard({
  delivery,
  mode = "school",
  onEdit,
  onDelete
}) {
  if (!delivery) {
    return null;
  }

  const deliveredQty = Number(
    delivery.delivered_qty ?? 0
  );

  const receivedQty =
    delivery.received_qty === null ||
    delivery.received_qty === undefined
      ? null
      : Number(delivery.received_qty);

  const gap =
    receivedQty === null
      ? null
      : deliveredQty - receivedQty;

  const verificationStatus =
    delivery.verification_status || "PENDING";

  const isUnverified =
    !delivery.verification_status ||
    verificationStatus === "PENDING";

  /*
   * =====================================================
   * ACTOR CAPABILITIES
   * =====================================================
   *
   * Supplier:
   * Can edit/delete only while delivery is unverified.
   *
   * School:
   * Can correct verification truth after verification.
   * This does NOT allow changing supplier delivered_qty.
   *
   * Admin:
   * Can correct the delivery record through the
   * administrative correction endpoint.
   */

  const supplierCanEdit =
    mode === "supplier" &&
    isUnverified;

  const supplierCanDelete =
    mode === "supplier" &&
    isUnverified;

  const schoolCanCorrect =
    mode === "school" &&
    !isUnverified;

  const adminCanCorrect =
    mode === "admin";

  const canShowActions =
    supplierCanEdit ||
    supplierCanDelete ||
    schoolCanCorrect ||
    adminCanCorrect;

  return (
    <div className="card border-0 shadow-sm p-3">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="d-flex justify-content-between align-items-start">

        <div>
          <h6 className="fw-bold mb-1">
            {delivery.product || "Delivery"}
          </h6>

          <div className="text-muted small">
            Delivery #{delivery.id}
          </div>
        </div>

        <StatusBadge
          status={verificationStatus}
        />

      </div>


      {/* =================================================
          DELIVERY TRUTH
          ================================================= */}

      <div className="mt-3 small">

        <div>
          <span className="text-muted">
            Delivered:
          </span>{" "}
          <strong>
            {deliveredQty} kg
          </strong>
        </div>


        <div>
          <span className="text-muted">
            Received:
          </span>{" "}
          <strong>
            {receivedQty === null
              ? "Not verified"
              : `${receivedQty} kg`}
          </strong>
        </div>


        {gap !== null && (
          <div>
            <span className="text-muted">
              Difference:
            </span>{" "}
            <strong>
              {gap} kg
            </strong>
          </div>
        )}


        <div>
          <span className="text-muted">
            Quality:
          </span>{" "}
          {delivery.quality_status ||
            "Not verified"}
        </div>


        <div>
          <span className="text-muted">
            Delay:
          </span>{" "}
          {delivery.delay_status ||
            "Not verified"}
        </div>


        {delivery.confidence_score !== null &&
          delivery.confidence_score !== undefined && (
            <div>
              <span className="text-muted">
                Confidence:
              </span>{" "}
              {delivery.confidence_score}
            </div>
          )}

      </div>


      {/* =================================================
          ACTIONS
          ================================================= */}

      {canShowActions && (
        <div className="d-flex gap-2 mt-3">

          {/* SUPPLIER EDIT */}

          {supplierCanEdit && onEdit && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(delivery)}
            >
              Edit Delivery
            </button>
          )}


          {/* SUPPLIER DELETE */}

          {supplierCanDelete && onDelete && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(delivery)}
            >
              Delete Delivery
            </button>
          )}


          {/* SCHOOL VERIFICATION CORRECTION */}

          {schoolCanCorrect && onEdit && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(delivery)}
            >
              Correct Verification
            </button>
          )}


          {/* ADMIN DELIVERY CORRECTION */}

          {adminCanCorrect && onEdit && (
            <button
              type="button"
              className="btn btn-outline-warning btn-sm"
              onClick={() => onEdit(delivery)}
            >
              Correct Delivery
            </button>
          )}

        </div>
      )}

    </div>
  );
}
