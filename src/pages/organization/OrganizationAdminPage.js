import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  Page,
} from "../../components/common/Page";


export default function OrganizationAdminPage() {

  const {
    workspace,
    verifiedMemberships,
  } = useAuth();

  const membership =
    verifiedMemberships.find(
      (item) =>
        item?.organization?.organization_type ===
        (workspace === "school"
          ? "SCHOOL"
          : "SUPPLIER")
    ) ||
    verifiedMemberships[0];

  const organization =
    membership?.organization;

  return (
    <Page
      title="Organization administration"
      subtitle="Manage your organization membership and responsibilities."
    >

      <div className="row g-4">

        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="small text-muted mb-2">
                Organization
              </div>

              <h4 className="fw-bold">
                {organization?.name || "—"}
              </h4>

              <div className="text-muted">
                {organization?.organization_type ||
                  "—"}
              </div>

              <div className="mt-3">

                <span className="badge text-bg-success">
                  VERIFIED
                </span>

                <span className="badge text-bg-light ms-2">
                  ACTIVE
                </span>

              </div>

            </div>

          </div>

        </div>


        <div className="col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="small text-muted mb-2">
                Membership administration
              </div>

              <h5 className="fw-bold">
                Users & responsibilities
              </h5>

              <p className="text-muted">
                View organization members and assign
                additional responsibilities to their
                existing memberships.
              </p>

              <Link
                to={
                  workspace === "supplier"
                    ? "/supplier/organization/members"
                    : "/school/organization/members"
                }
                className="btn btn-dark"
              >
                Manage members
              </Link>

            </div>

          </div>

        </div>

      </div>

    </Page>
  );
}