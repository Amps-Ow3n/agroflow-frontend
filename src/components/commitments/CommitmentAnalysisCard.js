import React from "react";

export default function CommitmentAnalysisCard({ feasibility }) {

  if (!feasibility) return null;


  const {
    quantity,
    timing
  } = feasibility;


  const capacityPassed = quantity?.feasible;

  const timingPassed = timing?.time_feasible;


  return (
    <div className="card shadow-sm border-0 p-3">

      <h5 className="fw-bold mb-3">
        Commitment Analysis
      </h5>


      {/* CAPACITY CHECK */}

      <div className="mb-4">

        <h6>
          {capacityPassed ? "✔ Capacity" : "✖ Capacity"}
        </h6>


        <div className="small text-muted">

          Available:
          {" "}
          {quantity.available_capacity}
          {" "}kg

          <br/>

          Requested:
          {" "}
          {quantity.requested_qty || "unknown"}
          {" "}kg


          {!capacityPassed && (
            <>
              <br/>

              Shortfall:
              {" "}
              {quantity.shortfall}
              {" "}kg
            </>
          )}

        </div>

      </div>



      <hr/>


      {/* TIME CHECK */}

      <div className="mb-4">

        <h6>
          {timingPassed ? "✔ Time Window" : "✖ Time Window"}
        </h6>


        <div className="small text-muted">

          {timingPassed ? (

            <>
              {
                timing.valid_sources_count
              }
              {" "}
              eligible sources found.
            </>

          ) : (

            <>
              No eligible supply sources
              match the requested delivery period.
            </>

          )}

        </div>

      </div>


      <hr/>


      {/* RECOMMENDATION */}

      <div>

        <h6 className="fw-bold">
          Recommendation
        </h6>


        {!capacityPassed && (
          <p className="small">
            Add more supply sources
            or reduce commitment quantity.
          </p>
        )}


        {!timingPassed && (
          <p className="small">
            Add sources with suitable availability
            dates or choose a later delivery window.
          </p>
        )}

      </div>


    </div>
  );
}