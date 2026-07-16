import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOpenDemands } from "../../api/demandApi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

export default function SupplierOpenDemandsPage() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function loadDemands() {
    try {
      setLoading(true);
      const data = await getOpenDemands();
      setDemands(data);
    } catch (err) {
      setError(err.message || "Failed to load open demands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDemands();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Open Demands</h2>

      {demands.length === 0 ? (
        <p>No open demands available.</p>
      ) : (
        <div className="grid gap-4">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className="border p-4 rounded shadow bg-white"
            >
              <h3 className="font-bold">
                {demand.school_name}
              </h3>

              <p>Product: {demand.product}</p>
              <p>Quantity: {demand.quantity}</p>
              <p>
                Delivery: {demand.delivery_start} → {demand.delivery_end}
              </p>

              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() =>
                  navigate("/supplier/commitments/new", {
                    state: {
                      school_id: demand.school_id,
                      product: demand.product,
                      quantity: demand.quantity,
                      delivery_start: demand.delivery_start,
                      delivery_end: demand.delivery_end,
                      locked: true
                    },
                  })
                }
              >
                Accept Demand
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}