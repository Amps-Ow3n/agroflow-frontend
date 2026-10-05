import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrganizationDashboard } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../utils/errors";
import { Page, Loading, Empty, Status, Alert } from "../../components/common/Page";

const cards = [
  ["active", "Active procurements"],
  ["awaiting_selection", "Awaiting selection"],
  ["awaiting_delivery", "Awaiting delivery"],
  ["awaiting_inspection", "Awaiting inspection"],
  ["discrepancies", "Discrepancies"],
  ["completed", "Completed cycles"],
];

export default function SchoolDashboardPage() {
  const { activeOrganizationId, activeMembership, loading: authLoading, hasPermission } = useAuth();
  const canCreateProcurement = hasPermission("procurement:create");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const organizationId =
      activeMembership?.organization?.id || activeOrganizationId;

    if (authLoading || !organizationId) return;

    setLoading(true);
    setError("");
    getOrganizationDashboard(organizationId)
      .then(setData)
      .catch((err) => setError(getApiError(err, "Unable to load the school dashboard.")))
      .finally(() => setLoading(false));
  }, [authLoading, activeMembership, activeOrganizationId]);

  return (
    <Page
      title="School procurement"
      subtitle="Monitor procurement work, responsibilities and verified outcomes."
      actions={canCreateProcurement ? <Link className="btn btn-dark" to="/school/procurements/new">New procurement</Link> : null}
    >
      {loading ? <Loading /> : error ? <Alert>{error}</Alert> : !data ? <Empty>No organization context is available.</Empty> : (
        <>
          <div className="alert alert-light border d-flex justify-content-between align-items-center gap-3 mb-4">
            <div>
              <div className="fw-semibold">Organization view</div>
              <div className="small text-muted">This dashboard reflects procurement records for the active organization, regardless of which authorized member performed the work.</div>
            </div>
            <span className="badge text-bg-dark">{data.organization?.name || "Active organization"}</span>
          </div>

          <div className="row g-3 mb-4">
            {cards.map(([key, label]) => (
              <div className="col-6 col-lg-2" key={key}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="small text-muted">{label}</div>
                    <div className="fs-3 fw-bold">{data.overview?.[key] || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent procurement activity</h5>
                    <Link to="/school/procurements" className="small">View all</Link>
                  </div>
                  {data.recent_procurements?.length ? (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead><tr><th>Procurement</th><th>Status</th><th>Last action</th><th>Actor</th></tr></thead>
                        <tbody>
                          {data.recent_procurements.map((p) => (
                            <tr key={p.id}>
                              <td><Link to={`/school/procurements/${p.id}`}>{p.procurement_identifier || `#${p.id}`}</Link><div className="small text-muted">{p.title}</div></td>
                              <td><Status value={p.status} /></td>
                              <td className="small">{p.last_event_title || "—"}</td>
                              <td className="small">{p.last_actor_name || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <Empty>No procurement records yet.</Empty>}
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h5>Attention required</h5>
                  {data.attention_required?.length ? data.attention_required.map((item) => (
                    <div className="border rounded p-3 mb-2" key={`${item.inspection_id}-${item.procurement_id}`}>
                      <div className="d-flex justify-content-between">
                        <Link to={`/school/procurements/${item.procurement_id}`}>{item.procurement_identifier}</Link>
                        <Status value={item.result} />
                      </div>
                      <div className="small text-muted mt-1">{item.quality_status} quality · {item.delay_status}</div>
                    </div>
                  )) : <div className="alert alert-success mb-0">No rejected, delayed or failed-quality inspections are currently recorded.</div>}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5>Pending inspections</h5>
                  {data.pending_inspections?.length ? data.pending_inspections.map((item) => (
                    <div className="border-bottom py-2" key={item.id}>
                      <Link to={`/school/procurements/${item.procurement_id}`}>{item.procurement_identifier}</Link>
                      <div className="small text-muted">Delivery {item.id} · {item.supplier_name}</div>
                    </div>
                  )) : <Empty>No deliveries are awaiting inspection.</Empty>}
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5>Team activity</h5>
                  {data.team_activity?.length ? data.team_activity.map((member) => (
                    <div className="border-bottom py-2" key={member.user_id}>
                      <div className="fw-semibold">{member.user_name}</div>
                      <div className="small text-muted">{member.event_count} recorded action(s) · last active {member.last_activity_at || "—"}</div>
                    </div>
                  )) : <Empty>No procurement activity has been recorded.</Empty>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}
