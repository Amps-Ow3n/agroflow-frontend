import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function ChainExplorerPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
     client.get(`/dashboard/system/chain/${id}`)
      .then(res => setData(res.data));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Chain Explorer - Commitment {data.commitment_id}</h2>

      {data.chain_trace.map((c, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <h4>Source #{c.source.id}</h4>

          <p>Actor: {c.source.actor_name}</p>
          <p>Product: {c.source.product}</p>
          <p>Qty Available: {c.source.qty_available}</p>

          <p><b>Utilization:</b> {c.utilization}%</p>

          <hr />
        </div>
      ))}
    </div>
  );
}