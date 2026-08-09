import React from "react";

import DeliveryTruthCard from "./DeliveryTruthCard";
import EmptyState from "../common/EmptyState";

export default function DeliveryHistory({

  deliveries,

  mode = "school",

  adminMode = false,

  onEdit,

  onDelete

}) {
  if (!deliveries || deliveries.length === 0) {
    return (
      <EmptyState
        title="No delivery records"
        description="Truth ledger will build as deliveries are verified"
      />
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {deliveries.map((delivery) => (
        <DeliveryTruthCard
  key={delivery.id}
  delivery={delivery}
  mode={adminMode ? "admin" : mode}
  onEdit={onEdit}
  onDelete={onDelete}
/>
      ))}
    </div>
  );
}