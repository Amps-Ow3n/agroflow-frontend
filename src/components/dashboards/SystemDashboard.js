import React from "react";

import NetworkCapacityPanel
  from "../../panels/NetworkCapacityPanel";

import ReliabilityRankingPanel
  from "../../panels/ReliabilityRankingPanel";

import RiskAlertsPanel
  from "../../panels/RiskAlertsPanel";

export default function SystemDashboard() {
  return (
    <div className="container-fluid py-3">

      <h4 className="fw-bold mb-3">
        System Intelligence Dashboard
      </h4>

      <div className="row g-3">

        {/* Network Capacity */}

        <div className="col-12 col-lg-6">
          <NetworkCapacityPanel />
        </div>

        {/* Reliability Ranking */}

        <div className="col-12 col-lg-6">
          <ReliabilityRankingPanel />
        </div>

        {/* Risk Alerts */}

        <div className="col-12">
          <RiskAlertsPanel />
        </div>

      </div>

    </div>
  );
}