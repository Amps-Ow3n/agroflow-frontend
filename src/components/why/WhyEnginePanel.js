import React, { useEffect, useState } from "react";
import api from "../../services/api";

const WhyEnginePanel = ({ farmerId }) => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    const fetchWhy = async () => {
      try {
        const res = await api.get(`/why/${farmerId}`);
        setLogs(res.data || []);
      } catch (err) {
        console.error("WHY fetch failed", err);
      }
    };

    if (farmerId) fetchWhy();

  }, [farmerId]);

  if (!logs.length) {
    return <p className="text-muted small">No decision insights yet</p>;
  }

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-body p-3 p-md-4">

        <h5 className="fw-semibold mb-3">
          Decision Intelligence (WHY Engine)
        </h5>

        <div className="d-flex flex-column gap-3">
          {logs.map((log, idx) => (
            <div key={idx} className="border rounded p-3 bg-light">

              <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                <div>
                  <div className="fw-semibold">{log.crop}</div>
                  <div className="small text-muted">{log.week}</div>
                </div>

                <div className="text-md-end">
                  <div className="text-warning fw-semibold">
                    Overcommitment: {log.over_amount}
                  </div>
                </div>
              </div>

              <div className="small text-muted mt-2">
                WHY: {log.explanation}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WhyEnginePanel;