import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";


export default function OrganizationSelectionPage() {

  const {
    isAuthenticated,
    loading,
    verifiedMemberships,
    selectOrganization,
  } = useAuth();


  if (loading) {
    return (
      <div className="container py-5">
        Loading…
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  function handleSelect(
    organizationId
  ) {
    selectOrganization(
      organizationId
    );
  }


  return (
    <div className="container py-5">

      <div
        className="mx-auto"
        style={{
          maxWidth: 720,
        }}
      >

        <div className="mb-4">

          <h2 className="fw-bold">
            Select organization
          </h2>

          <p className="text-muted mb-0">
            Choose the organization you want
            to work with.
          </p>

        </div>


        <div className="row g-3">

          {verifiedMemberships.map(
            (membership) => {

              const organization =
                membership.organization;

              return (
                <div
                  className="col-12"
                  key={
                    organization.id
                  }
                >

                  <button
                    type="button"
                    className="btn btn-light border rounded-3 w-100 text-start p-4"
                    onClick={() =>
                      handleSelect(
                        organization.id
                      )
                    }
                  >

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <div className="fw-semibold fs-5">
                          {
                            organization.name
                          }
                        </div>

                        <div className="small text-muted mt-1">

                          {
                            organization.organization_type
                          }

                        </div>

                      </div>

                      <span className="text-secondary">
                        Select →
                      </span>

                    </div>

                  </button>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}