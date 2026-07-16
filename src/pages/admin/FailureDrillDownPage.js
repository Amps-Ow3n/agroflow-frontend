import { useEffect, useState } from "react";
import client from "../../api/client";

export default function FailureDrillDownPage() {
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    client.get("/dashboard/system/failure-map")
      .then(res => setFailures(res.data));
  }, []);

  const openCommitment = (id) => {
    window.location.href = `/admin/commitment/${id}`;
  };

  return (
    <div>
      <h2>System Failures</h2>

      {failures.map(f => (
        <div
          key={f.commitment_id}
          onClick={() => openCommitment(f.commitment_id)}
          style={{
            border: "1px solid gray",
            padding: 10,
            marginBottom: 10,
            cursor: "pointer"
          }}
        >
          <p><b>Commitment:</b> {f.commitment_id}</p>
          <p><b>Type:</b> {f.failure_type}</p>
          <p><b>Severity:</b> {f.severity}</p>
          <p><b>Supplier:</b> {f.supplier}</p>
          <p><b>School:</b> {f.school}</p>
        </div>
      ))}
    </div>
  );
}