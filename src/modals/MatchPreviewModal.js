import React from "react";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";

export default function MatchPreviewModal({
  open,
  onClose,
  matchData,
}) {
  if (!open) return null;

  const allocations = matchData?.allocations || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-[600px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Match Preview
        </h2>

        {allocations.length === 0 ? (
          <EmptyState
            title="No allocations"
            description="No candidate sources found"
          />
        ) : (
          <div className="space-y-3">
            {allocations.map((a, index) => (
              <div
                key={index}
                className="border rounded p-3"
              >
                <p>
                  Source ID: {a.source_id}
                </p>

                <p>
                  Allocated Qty: {a.allocated_qty}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p>
            Confidence: {matchData?.confidence || 0}
          </p>

          <p>
            Feasible:{" "}
            {matchData?.feasible ? "Yes" : "No"}
          </p>
        </div>

        <div className="mt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}