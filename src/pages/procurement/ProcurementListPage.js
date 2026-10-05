import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProcurements } from "../../api/procurementApi";
import { Page, Loading, Empty, Status } from "../../components/common/Page";
import { getApiError } from "../../utils/errors";
import { useAuth } from "../../context/AuthContext";

export default function ProcurementListPage() {
  const { hasPermission } = useAuth();
  const canCreateProcurement = hasPermission("procurement:create");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    getProcurements()
      .then((r) => setData(r.procurements || []))
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <Page
      title="Procurements"
      subtitle="The authoritative school procurement records."
      actions={
        canCreateProcurement ? (
          <Link className="btn btn-dark" to="/school/procurements/new">
            New procurement
          </Link>
        ) : null
      }
    >
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loading />
      ) : data.length === 0 ? (
        <Empty>No procurements found.</Empty>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body border-bottom">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <div className="fw-semibold">Procurement register</div>
                <div className="small text-muted">Open a record for its operational details, evidence and traceability history.</div>
              </div>
              <span className="badge text-bg-light">{data.length} record{data.length === 1 ? "" : "s"}</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Identifier</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Required by</th>
                  <th>Last updated</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to={`/school/procurements/${p.id}`} className="fw-semibold">
                        {p.procurement_identifier || `#${p.id}`}
                      </Link>
                    </td>
                    <td>{p.title}</td>
                    <td><Status value={p.status} /></td>
                    <td>{p.required_by_date || "—"}</td>
                    <td className="small text-muted">{p.updated_at || p.created_at || "—"}</td>
                    <td className="text-end">
                      <Link className="btn btn-sm btn-outline-secondary" to={`/school/procurements/${p.id}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Page>
  );
}
