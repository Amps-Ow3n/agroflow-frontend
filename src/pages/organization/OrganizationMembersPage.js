import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  addOrganizationMember,
  getOrganizationMembers,
  getOrganizationResponsibilities,
  assignMemberResponsibility,
  decideOrganizationMembership,
} from "../../api/organizationApi";

import {
  Page,
  Loading,
  Empty,
} from "../../components/common/Page";


export default function OrganizationMembersPage() {

  const {
    activeMembership,
    activeOrganization,
  } = useAuth();


  const organization =
    activeOrganization ||
    activeMembership?.organization;


  const organizationId =
    organization?.id;


  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    responsibilities,
    setResponsibilities,
  ] = useState([]);


  const [
  newMemberEmail,
  setNewMemberEmail,
] = useState("");

const [
  newMemberResponsibility,
  setNewMemberResponsibility,
] = useState("");

const [
  addingMember,
  setAddingMember,
] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    selectedRoles,
    setSelectedRoles,
  ] = useState({});


  const [
    busyUserId,
    setBusyUserId,
  ] = useState(null);

  async function handleMembershipDecision(membershipId, decision) {
    try {
      setBusyUserId(membershipId);
      setError("");
      await decideOrganizationMembership(organizationId, membershipId, decision);
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update membership request.");
    } finally {
      setBusyUserId(null);
    }
  }


  async function load() {

    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const [
        membersResponse,
        responsibilitiesResponse,
      ] = await Promise.all([
        getOrganizationMembers(
          organizationId
        ),
        getOrganizationResponsibilities(
          organizationId
        ),
      ]);


      setMembers(
        membersResponse.members || []
      );


      setResponsibilities(
        responsibilitiesResponse.responsibilities ||
          []
      );

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        "Unable to load organization members."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    load();
  }, [organizationId]);


  function getSelectedRole(
    userId
  ) {
    return (
      selectedRoles[userId] || ""
    );
  }


  function setSelectedRole(
    userId,
    value
  ) {

    setSelectedRoles(
      (current) => ({
        ...current,
        [userId]: value,
      })
    );
  }


  async function handleAssign(
    userId
  ) {

    const responsibilityCode =
      getSelectedRole(userId);


    if (!responsibilityCode) {
      return;
    }


    try {

      setBusyUserId(userId);
      setError("");


      await assignMemberResponsibility(
        organizationId,
        userId,
        responsibilityCode
      );


      setSelectedRoles(
        (current) => ({
          ...current,
          [userId]: "",
        })
      );


      await load();

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
        "Unable to assign responsibility."
      );

    } finally {

      setBusyUserId(null);

    }
  }

async function handleAddMember() {
  if (
    !newMemberEmail.trim() ||
    !newMemberResponsibility
  ) {
    return;
  }

  try {
    setAddingMember(true);
    setError("");

    await addOrganizationMember(
      organizationId,
      newMemberEmail.trim(),
      newMemberResponsibility
    );

    setNewMemberEmail("");
    setNewMemberResponsibility("");

    await load();

  } catch (err) {
    setError(
      err?.response?.data?.detail ||
      "Unable to add organization member."
    );
  } finally {
    setAddingMember(false);
  }
}

  return (
    <Page
      title="Organization members"
      subtitle={
        organization?.name ||
        "Manage organization responsibilities."
      }
    >
<div className="card border-0 shadow-sm mb-4">
  <div className="card-body">

    <div className="mb-3">
      <h5 className="fw-semibold mb-1">
        Add organization member
      </h5>

      <p className="text-muted small mb-0">
        Add an existing AgroFlow user to this
        organization and assign their initial
        responsibility.
      </p>
    </div>

    <div className="row g-2">

      <div className="col-md-5">
        <label className="form-label">
          User email
        </label>

        <input
          type="email"
          className="form-control"
          placeholder="user@example.com"
          value={newMemberEmail}
          onChange={(event) =>
            setNewMemberEmail(
              event.target.value
            )
          }
          disabled={addingMember}
        />
      </div>


      <div className="col-md-5">
        <label className="form-label">
          Initial responsibility
        </label>

        <select
          className="form-select"
          value={newMemberResponsibility}
          onChange={(event) =>
            setNewMemberResponsibility(
              event.target.value
            )
          }
          disabled={addingMember}
        >
          <option value="">
            Select responsibility
          </option>

          {responsibilities.map(
            (responsibility) => (
              <option
                key={
                  responsibility.code
                }
                value={
                  responsibility.code
                }
              >
                {
                  responsibility.name
                }
              </option>
            )
          )}
        </select>
      </div>


      <div className="col-md-2 d-flex align-items-end">
        <button
          type="button"
          className="btn btn-dark w-100"
          disabled={
            addingMember ||
            !newMemberEmail.trim() ||
            !newMemberResponsibility
          }
          onClick={
            handleAddMember
          }
        >
          {addingMember
            ? "Adding..."
            : "Add member"}
        </button>
      </div>

    </div>

  </div>
</div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {loading ? (

        <Loading />

      ) : members.length === 0 ? (

        <Empty>
          No organization members found.
        </Empty>

      ) : (

        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>
                    <th>Member</th>
                    <th>Status</th>
                    <th>Responsibilities</th>
                    <th style={{ width: 300 }}>
                      Add responsibility
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {members.map(
                    (member) => (

                      <tr
                        key={
                          member.membership_id
                        }
                      >

                        <td>

                          <div className="fw-semibold">
                            {
                              member.full_name
                            }
                          </div>

                          <div className="small text-muted">
                            {member.email}
                          </div>

                        </td>


                        <td>

                          <span
                            className={
                              member.membership_status ===
                              "ACTIVE"
                                ? "badge text-bg-success"
                                : "badge text-bg-secondary"
                            }
                          >
                            {
                              member.membership_status
                            }
                          </span>

                        </td>


                        <td>

                          <div className="d-flex flex-wrap gap-1">

                            {(
                              member.responsibilities ||
                              []
                            ).map(
                              (responsibility) => (

                                <span
                                  key={
                                    responsibility.code
                                  }
                                  className="badge text-bg-light border"
                                >
                                  {
                                    responsibility.name ||
                                    responsibility.code
                                  }
                                </span>

                              )
                            )}

                          </div>

                        </td>


                        <td>

                          {member.membership_status === "PENDING" ? (
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={busyUserId !== null}
                                onClick={() => handleMembershipDecision(member.membership_id, "APPROVE")}
                              >
                                {busyUserId === member.membership_id ? "Saving..." : "Approve"}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                disabled={busyUserId !== null}
                                onClick={() => handleMembershipDecision(member.membership_id, "REJECT")}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                          <div className="d-flex gap-2">

                            <select
                              className="form-select form-select-sm"
                              value={getSelectedRole(
                                member.user_id
                              )}
                              onChange={(event) =>
                                setSelectedRole(
                                  member.user_id,
                                  event.target.value
                                )
                              }
                              disabled={
                                busyUserId !== null
                              }
                            >

                              <option value="">
                                Select responsibility
                              </option>

                              {responsibilities.map(
                                (responsibility) => (

                                  <option
                                    key={
                                      responsibility.code
                                    }
                                    value={
                                      responsibility.code
                                    }
                                  >
                                    {
                                      responsibility.name
                                    }
                                  </option>

                                )
                              )}

                            </select>


                            <button
                              type="button"
                              className="btn btn-dark btn-sm"
                              disabled={
                                busyUserId !== null ||
                                !getSelectedRole(
                                  member.user_id
                                )
                              }
                              onClick={() =>
                                handleAssign(
                                  member.user_id
                                )
                              }
                            >

                              {busyUserId ===
                              member.user_id
                                ? "Saving..."
                                : "Assign"}

                            </button>

                          </div>
                          )}

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