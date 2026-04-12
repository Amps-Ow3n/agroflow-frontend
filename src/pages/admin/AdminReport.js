import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminReport = () => {

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/admin/report/term");
        setReport(res.data.system_summary);
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
          <div className="fw-semibold">{report.total_supply}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Committed</div>
          <div className="fw-semibold">{report.total_committed}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Delivered</div>
          <div className="fw-semibold">{report.total_delivered}</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Fulfillment</div>
          <div className="fw-semibold">{report.fulfillment_rate}%</div>
        </div>

        <div className="col-6 col-md-4">
          <div className="text-muted">Overcommitment</div>
          <div className="fw-semibold">{report.overcommitment}</div>
        </div>

      </div>

    </div>
  );
};

export default AdminReport;