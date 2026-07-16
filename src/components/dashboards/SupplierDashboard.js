import React from "react";

import SupplyCapacityPanel
  from "../../panels/SupplyCapacityPanel";

import DeliveryReliabilityPanel
  from "../../panels/DeliveryReliabilityPanel";

import SupplierTrustPanel
  from "../../panels/SupplierTrustPanel";

export default function SupplierDashboard() {
  return (
    <div className="container-fluid py-3">

      <h4 className="fw-bold mb-3">
        Supplier Intelligence Dashboard
      </h4>

      <div className="row g-3">

        {/* Supply Capacity */}

        <div className="col-12 col-lg-4">
          <SupplyCapacityPanel />
        </div>

        {/* Delivery Reliability */}

        <div className="col-12 col-lg-4">
          <DeliveryReliabilityPanel />
        </div>

        {/* Supplier Trust */}

        <div className="col-12 col-lg-4">
          <SupplierTrustPanel />
        </div>

      </div>

    </div>
  );
}