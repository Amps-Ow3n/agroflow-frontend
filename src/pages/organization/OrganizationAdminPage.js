import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getOrganizationDashboard } from "../../api/dashboardApi";
import { getApiError } from "../../utils/errors";
import { Page, Loading, Empty, Status, Alert } from "../../components/common/Page";

const overviewCards = [
  ["active", "Active"],
  ["awaiting_selection", "Awaiting selection"],
  ["awaiting_delivery", "Awaiting delivery"],
  ["awaiting_inspection", "Awaiting inspection"],
  ["discrepancies", "Discrepancies"],
  ["completed", "Completed cycles"],
];

export default function OrganizationAdminPage() {
  const { activeMembership, activeOrganization, activeOrganizationId, hasPermission } = useAuth();
  const canManageOrganization = hasPermission("organization:manage_members") || hasPermission("organization:update");
  const organization = activeOrganization || activeMembership?.organization;
  const organizationType = organization?.organization_type;
  const membersPath = organizationType === "SUPPLIER" ? "/supplier/organization/members" : "/school/organization/members";
  const procurementBase = organizationType === "SUPPLIER" ? "/supplier" : "/school";

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canManageOrganization || !activeOrganizationId) return;

    setLoading(true);
    getOrganizationDashboard(activeOrganizationId)
      .then(setDashboard)
      .catch((err) => setError(getApiError(err, "Unable to load organization oversight.")))
      .finally(() => setLoading(false));
  }, [canManageOrganization, organizationType, activeOrganizationId]);

  if (!canManageOrganization) {
    return (
      <Page
        title="Organization administration"
        subtitle="This area is restricted to organization administrators."
      >
        <Alert type="warning">You have organization-level visibility, but you are not assigned the responsibility required to manage organization governance.</Alert>
      </Page>
    );
  }

  return (
    <Page
      title="Organization administration"
      subtitle="Govern the organization, see what members are doing and manage responsibilities."
    >
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="small text-muted mb-2">Organization</div>
              <h4 className="fw-bold">{organization?.name || "—"}</h4>
              <div className="text-muted">{organizationType || "—"}</div>
              <div className="mt-3">
                <span className="badge text-bg-success">VERIFIED</span>
                <span className="badge text-bg-light ms-2">ACTIVE</span>
              </div>
              <Link to={membersPath} className="btn btn-outline-dark btn-sm mt-4">Manage members & responsibilities</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="small text-muted mb-2">Governance role</div>
              <h5 className="fw-bold">Oversight without responsibility confusion</h5>
              <p className="text-muted mb-0">
                Organization administrators can see organization-level procurement activity,
                member actions and exceptions. Operational actions remain governed by the
                member responsibilities assigned to each user.
              </p>
            </div>
          </div>
        </div>
      </div>

            {loading ? (
        <Loading />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : dashboard ? (
        <>
          <div className="row g-3 mb-4">
            {overviewCards.map(([key, label]) => (
              <div className="col-6 col-lg-2" key={key}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="small text-muted">{label}</div>
                    <div className="fs-3 fw-bold">
                      {dashboard.overview?.[key] || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5>
                    {organizationType === "SUPPLIER"
                      ? "Recent supplier activity"
                      : "Recent procurement activity"}
                  </h5>

                  {dashboard.recent_procurements?.length ? (
                    dashboard.recent_procurements.map((item) => (
                      <div
                        className="border-bottom py-3"
                        key={item.id}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            {organizationType === "SUPPLIER" ? (
                              <Link
                                to="/supplier/commitments"
                                className="fw-semibold"
                              >
                                {item.procurement_identifier ||
                                  `Commitment #${item.id}`}
                              </Link>
                            ) : (
                              <Link
                                to={`${procurementBase}/procurements/${item.id}`}
                                className="fw-semibold"
                              >
                                {item.procurement_identifier}
                              </Link>
                            )}

                            <div className="small text-muted">
                              {item.title ||
                                item.status ||
                                "Supplier commitment"}
                            </div>
                          </div>

                          <Status value={item.status} />
                        </div>

                        <div className="small text-muted mt-2">
                          {item.last_event_title || "No activity"} ·{" "}
                          {item.last_actor_name || "Unknown actor"} ·{" "}
                          {item.last_event_at || "—"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty>No procurement activity yet.</Empty>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h5>Attention required</h5>

                  {dashboard.attention_required?.length ? (
                    dashboard.attention_required.map((item) => (
                      <div
                        className="border rounded p-3 mb-2"
                        key={`${item.procurement_id}-${item.inspection_id}`}
                      >
                        <Link
                          to={`/school/procurements/${item.procurement_id}`}
                        >
                          {item.procurement_identifier}
                        </Link>

                        <div className="small text-muted">
                          {item.result} · {item.quality_status} ·{" "}
                          {item.delay_status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert alert-success mb-0">
                      No recorded exceptions require attention.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5>Team activity</h5>

                  {dashboard.team_activity?.length ? (
                    dashboard.team_activity.map((member) => (
                      <div
                        className="border-bottom py-2"
                        key={member.user_id}
                      >
                        <div className="fw-semibold">
                          {member.user_name}
                        </div>

                        <div className="small text-muted">
                          {member.event_count} action(s) ·{" "}
                          {member.last_activity_at || "—"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty>No activity recorded.</Empty>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Members</h5>

                    <Link to={membersPath} className="small">
                      Manage
                    </Link>
                  </div>

                  {dashboard.members?.length ? (
                    dashboard.members.map((member) => (
                      <div
                        className="border-bottom py-2"
                        key={member.membership_id}
                      >
                        <div className="fw-semibold">
                          {member.name}
                        </div>

                        <div className="small text-muted">
                          {member.responsibilities?.join(", ") ||
                            "No responsibility assigned"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty>No members recorded.</Empty>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Page>
  );
}
