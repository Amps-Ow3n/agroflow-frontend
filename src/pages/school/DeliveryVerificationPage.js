import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDelivery, inspectDelivery } from "../../api/deliveryApi";
import { getApiError } from "../../utils/errors";
import { Page, Loading, Alert } from "../../components/common/Page";

export default function DeliveryVerificationPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [received, setReceived] = useState("");
  const [result, setResult] = useState("ACCEPTED");
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDelivery(id)
      .then((r) => setDelivery(r.delivery || r))
      .catch((e) => setError(getApiError(e)));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await inspectDelivery(id, {
        received_qty: Number(String(received).replace(/,/g, "")),
        result,
        quality_status: result === "ACCEPTED" ? "GOOD" : "FAILED",
        delay_status: "ON_TIME",
        rejection_reason: result === "REJECTED" ? (rejectionReason || null) : null,
        notes: notes || null,
      });
      nav(-1);
    } catch (e) {
      setError(getApiError(e, "Unable to inspect delivery."));
    } finally {
      setBusy(false);
    }
  }

  if (!delivery) {
    return <Page title="Inspect delivery">{error ? <Alert>{error}</Alert> : <Loading />}</Page>;
  }

  const lineList = Array.isArray(delivery.lines) ? delivery.lines : [];
  const promised = Number(delivery.promised_qty ?? delivery.promised_quantity ?? 0);
  const actual = lineList.reduce((sum, line) => sum + Number(line.actual_quantity || 0), 0);
  const unit = lineList[0]?.unit || delivery.unit || "unit";
  const receivedNumber = received === "" ? null : Number(String(received).replace(/,/g, ""));
  const shortfall = receivedNumber == null ? null : Math.max(promised - receivedNumber, 0);
  const variance = promised > 0 && receivedNumber != null ? (shortfall / promised) * 100 : null;

  return (
    <Page title="Inspect delivery" subtitle="The receiving side records what was actually received and decides whether the delivery is acceptable.">
      <div className="card border-0 shadow-sm p-4">
        {error && <Alert>{error}</Alert>}
        <div className="alert alert-info">
          Promised: <strong>{promised} {unit}</strong> · Recorded delivery: <strong>{actual} {unit}</strong>
          {receivedNumber != null && <> · Received: <strong>{receivedNumber} {unit}</strong></>}
        </div>
        {receivedNumber != null && (
          <div className="alert alert-warning">
            Discrepancy: <strong>{shortfall} {unit}</strong>{variance != null && <> · Variance: <strong>{variance.toFixed(2)}%</strong></>}
          </div>
        )}
        <form onSubmit={submit}>
          <label htmlFor="received-quantity" className="form-label">Received quantity</label>
          <input id="received-quantity" className="form-control mb-3" type="text" inputMode="decimal" min="0" value={received} onChange={(e) => setReceived(e.target.value)} required />
          <label htmlFor="inspection-result" className="form-label">Inspection result</label>
          <select id="inspection-result" className="form-select mb-3" value={result} onChange={(e) => setResult(e.target.value)}>
            <option>ACCEPTED</option><option>REJECTED</option>
          </select>
          <label htmlFor="inspection-notes" className="form-label">Inspection notes</label>
          <textarea id="inspection-notes" className="form-control mb-3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Record relevant inspection observations." />
          {result === "REJECTED" && (
            <>
              <label htmlFor="inspection-rejection-reason" className="form-label">Rejection reason</label>
              <textarea id="inspection-rejection-reason" className="form-control" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} required />
            </>
          )}
          <button className="btn btn-dark mt-3" disabled={busy}>{busy ? "Saving…" : "Record inspection"}</button>
        </form>
      </div>
    </Page>
  );
}
