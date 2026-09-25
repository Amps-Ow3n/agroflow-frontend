import { useEffect, useState } from "react";

import {
  getPendingVerifications,
  decideOrganizationVerification,
} from "../../api/verificationApi";

import {
  Page,
  Loading,
  Empty,
} from "../../components/common/Page";


export default function AdminDashboardPage() {

  const [verifications, setVerifications] = useState(null);

  const [error, setError] = useState("");

  const [busyId, setBusyId] = useState(null);

  const [reason, setReason] = useState("");


  async function loadVerifications() {

    try {

      setError("");

      const response =
        await getPendingVerifications();

      setVerifications(
        response.verifications || []
      );

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to load pending organization verifications."
      );

    }

  }


  useEffect(() => {

    loadVerifications();

  }, []);


  async function handleDecision(
    organizationId,
    decision
  ) {

    if (
      decision === "REJECTED" &&
      !reason.trim()
    ) {

      setError(
        "A rejection reason is required."
      );

      return;
    }


    try {

      setBusyId(organizationId);

      setError("");


      await decideOrganizationVerification(
        organizationId,
        {
          decision,
          reason:
            reason.trim() || null,
        }
      );


      setReason("");


      await loadVerifications();


    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to process organization verification."
      );

    } finally {

      setBusyId(null);

    }

  }


  if (verifications === null) {

    return (
      <Page
        title="Organization verification"
        subtitle="Review organizations awaiting platform verification."
      >
        <Loading />
      </Page>
    );

  }


  if (error && verifications.length === 0) {

    return (
      <Page
        title="Organization verification"
        subtitle="Review organizations awaiting platform verification."
      >

        <div className="alert alert-danger">
          {error}
        </div>

      </Page>
    );

  }


  return (

    <Page
      title="Organization verification"
      subtitle="Review organizations awaiting platform verification."
    >

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}


      {verifications.length === 0 ? (

        <Empty>
          No pending organization verifications.
        </Empty>

      ) : (

        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Pending organizations
            </h5>


            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>
                      Organization
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Submitted By
                    </th>

                    <th>
                      Submitted At
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {verifications.map(
                    (verification) => (

                      <tr
                        key={
                          verification.id
                        }
                      >

                        <td>

                          <div className="fw-semibold">
                            {
                              verification.organization_name
                            }
                          </div>

                          <div className="small text-muted">
                            Organization ID:{" "}
                            {
                              verification.organization_id
                            }
                          </div>

                        </td>


                        <td>

                          {verification.organization_type}

                        </td>


                        <td>

                          <div>
                            {
                              verification.submitted_by_name ||
                              "—"
                            }
                          </div>

                          <div className="small text-muted">
                            {
                              verification.submitted_by_email ||
                              "—"
                            }
                          </div>

                        </td>


                        <td>

                          {verification.submitted_at
                            ? new Date(
                                verification.submitted_at
                              ).toLocaleString()
                            : "—"}

                        </td>


                        <td>

                          <div
                            className="d-flex flex-column gap-2"
                            style={{
                              minWidth: "240px",
                            }}
                          >

                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Reason (required for rejection)"
                              value={reason}
                              onChange={(e) =>
                                setReason(
                                  e.target.value
                                )
                              }
                              disabled={
                                busyId !== null
                              }
                            />


                            <div className="d-flex gap-2">

                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={
                                  busyId !== null
                                }
                                onClick={() =>
                                  handleDecision(
                                    verification.organization_id,
                                    "VERIFIED"
                                  )
                                }
                              >

                                {busyId ===
                                verification.organization_id
                                  ? "Processing..."
                                  : "Verify"}

                              </button>


                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                disabled={
                                  busyId !== null
                                }
                                onClick={() =>
                                  handleDecision(
                                    verification.organization_id,
                                    "REJECTED"
                                  )
                                }
                              >

                                Reject

                              </button>

                            </div>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </Page>

  );

}