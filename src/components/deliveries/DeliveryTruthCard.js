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

  const deliveredQty = Number(delivery.delivered_qty ?? 0);
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

  const supplierCanEdit =
    mode === "supplier" &&
    isUnverified;

  const supplierCanDelete =
    mode === "supplier" &&
    isUnverified;

  const schoolCanCorrect =
    mode === "school" &&
    delivery.id;

  return (
    <div className="border rounded p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold">
            {delivery.product || "Delivery"}
          </div>

          <div className="text-muted small">
            Delivery #{delivery.id}
          </div>
        </div>

        <StatusBadge
          status={verificationStatus}
        />
      </div>

      <div className="mt-3 small">
        <div>
          <span className="text-muted">
            Delivered:
          </span>{" "}
          <strong>{deliveredQty} kg</strong>
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
            <strong>{gap} kg</strong>
          </div>
        )}

        <div>
          <span className="text-muted">
            Quality:
          </span>{" "}
          {delivery.quality_status || "Not verified"}
        </div>

        <div>
          <span className="text-muted">
            Delay:
          </span>{" "}
          {delivery.delay_status || "Not verified"}
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

      {(supplierCanEdit ||
        supplierCanDelete ||
        schoolCanCorrect) && (
        <div className="d-flex gap-2 mt-3">
          {supplierCanEdit && onEdit && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(delivery)}
            >
              Edit Delivery
            </button>
          )}

          {supplierCanDelete && onDelete && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(delivery)}
            >
              Delete Delivery
            </button>
          )}

          {schoolCanCorrect && onEdit && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(delivery)}
            >
              Correct Verification
            </button>
          )}
        </div>
      )}
    </div>
  );
}