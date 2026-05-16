import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminReport = () => {

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/admin/report/term");
        setReport(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReport();
  }, []);

  if (!report) {
    return (
      <div className="card shadow-sm border-0 p-4 text-center">
        <p className="text-muted mb-0">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 p-4">

      <h5 className="fw-semibold mb-3">System Report</h5>

      <div className="row g-3 small">

        <div className="col-6 col-md-4">
          <div className="text-muted">Supply</div>
          <div className="fw-semibold">{report.system_summary.total_supply}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Committed</div>
          <div className="fw-semibold">{report.system_summary.total_committed}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Delivered</div>
          <div className="fw-semibold">{report.system_summary.total_delivered}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Fulfillment</div>
          <div className="fw-semibold">{report.system_summary.fulfillment_rate}%</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Overcommitment</div>
          <div className="fw-semibold">{report.system_summary.overcommitment}</div>
        </div>

      </div>
      
      <div className="mt-4">

  <h6 className="fw-semibold mb-3">
    Farmer Risk Intelligence
  </h6>

  <div className="d-flex flex-column gap-2">

    {report.farmer_performance?.map((farmer, idx) => (

      <div
        key={idx}
        className="border rounded p-3 bg-light"
      >

        <div className="fw-semibold">
          Farmer #{farmer.farmer_id}
        </div>

        <div
          className={`small fw-semibold ${
            farmer.risk_level === "HIGH"
              ? "text-danger"
              : farmer.risk_level === "MEDIUM"
              ? "text-warning"
              : "text-success"
          }`}
        >
          {farmer.risk_level} Risk
        </div>

        <div className="small text-muted">
          {farmer.message}
        </div>

      </div>

    ))}

  </div>

</div>
    </div>
  );
};

export default AdminReport;