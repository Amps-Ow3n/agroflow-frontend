import React from "react";

export default function ChainNode({ node }) {
  return (
    <div className="border rounded p-3 bg-light">

      <div className="d-flex justify-content-between">

        <div>
          <div className="fw-bold">
            {node.actor_name || `Source #${node.source_id}`}
          </div>

          <div className="text-muted small">
            {node.actor_type}
          </div>
        </div>


        <div className="text-muted small">
          Hop {node.chain_position}
        </div>

      </div>


      <div className="text-muted small mt-2">
        Allocated:
        <b> {node.allocated_qty} kg</b>
      </div>


    </div>
  );
}