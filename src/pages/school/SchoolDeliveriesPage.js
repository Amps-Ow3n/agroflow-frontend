import { useEffect, useState } from "react";
import client from "../../api/client";
import DeliveryVerificationForm from "../../components/deliveries/DeliveryVerificationForm";
import DeliveryHistory from "../../components/deliveries/DeliveryHistory";
import DeliveryTruthCard from "../../components/deliveries/DeliveryTruthCard";

export default function SchoolDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
  client.get("/school/deliveries")
    .then((res) => {

      console.log("DELIVERIES FROM BACKEND:", res.data);

      setDeliveries(res.data);

    });
}, []);

  const loadDeliveries = async () => {

    const res = await client.get("/school/deliveries");

    setDeliveries(res.data);

};

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Delivery Truth System</h2>
        <p className="text-muted">
          School verifies what was actually received
        </p>
      </div>

      <div className="row g-4">

        {/* LEFT — DELIVERY INBOX */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Delivery Inbox</h6>

            {deliveries.map((d) => (
              <div
                key={d.id}
                onClick={() => {

  console.log("SELECTED DELIVERY:", d);

  setSelected(d);
  setVerificationResult(null);

}}
                className={`p-2 border rounded mb-2 ${
                  selected?.id === d.id ? "bg-light border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <div className="fw-bold">
                  Commitment #{d.commitment_id}
                </div>

                <div className="text-muted small">
                  {d.delivered_qty} kg • {d.verification_status || "PENDING"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — VERIFICATION */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3">

            <h6 className="fw-bold mb-3">
              Confirm Delivery
            </h6>

            {!selected ? (
              <p className="text-muted">
                Select a delivery to verify
              </p>
            ) : (
              <DeliveryVerificationForm
                commitmentId={selected.commitment_id}
                onVerified={(result)=>{

        setVerificationResult(result);

        loadDeliveries();

    }}
              />
            )}
          </div>
        </div>

        {/* RIGHT — RESULT */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">Truth Outcome</h6>

            {!verificationResult ? (
              <p className="text-muted">
                Verification result will appear here
              </p>
            ) : (
              <DeliveryTruthCard delivery={verificationResult} />
            )}
          </div>
        </div>

      </div>

      {/* FULL HISTORY */}
      <div className="mt-4">
        <div className="card shadow-sm border-0 p-3">
          <h6 className="fw-bold mb-3">Delivery Ledger</h6>
          <DeliveryHistory deliveries={deliveries} />
        </div>
      </div>

    </div>
  );
}