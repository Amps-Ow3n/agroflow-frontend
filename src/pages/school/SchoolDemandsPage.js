import { useEffect, useState } from "react";
import {
  getSchoolDemands,
  deleteDemand
} from "../../api/demandApi";
import DemandEditForm from "../../components/demands/DemandEditForm";
export default function SchoolDemandsPage() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemand,setSelectedDemand]=useState(null);
  const [error, setError] = useState("");

  async function loadDemands() {
    try {
      setLoading(true);

      const data = await getSchoolDemands();
      setDemands(data);

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Failed to load demands"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDemands();
  }, []);

  async function handleDelete(demandId) {


  const confirmed = window.confirm(
    "Are you sure you want to remove this demand?"
  );


  if (!confirmed) {
    return;
  }


  try {

    await deleteDemand(demandId);


    setDemands(prev =>
      prev.filter(
        d => d.id !== demandId
      )
    );


  } catch (err) {

    alert(
      err?.response?.data?.detail ||
      "Failed to delete demand."
    );

  }

}

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid">

      <h2 className="fw-bold mb-1">
        Demand Pressure Board
      </h2>

      <p className="text-muted mb-4">
        Active institutional food requirements
      </p>

{demands.length === 0 ? (

  <div className="text-center p-4 border rounded bg-light">
    <h6>No active demand</h6>

    <p className="text-muted">
      No institutions currently require supply
    </p>
  </div>

) : (

  <>
    {demands.map((d) => (

      <div
        key={d.id}
        className="card p-3 mb-3 shadow-sm"
      >

        <h5>{d.product}</h5>

        <p className="mb-1">
          Quantity: <b>{d.quantity}</b>
        </p>

        <p className="mb-3">
          Window: {d.delivery_start} → {d.delivery_end}
        </p>

        {d.status === "OPEN" ? (

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setSelectedDemand(d)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(d.id)}
            >
              Remove
            </button>

          </div>

        ) : (

          <div className="text-muted">
            Locked ({d.status})
          </div>

        )}

      </div>

    ))}

    {selectedDemand && (
      <DemandEditForm
        demand={selectedDemand}
        onCancel={() => setSelectedDemand(null)}
        onSuccess={() => {
          setSelectedDemand(null);
          loadDemands();
        }}
      />
    )}

  </>

)}
    </div>
  );
}