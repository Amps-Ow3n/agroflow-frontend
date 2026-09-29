import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentIdentity,
  login as loginRequest,
} from "../api/authApi";


export const AuthContext = createContext(null);

function getVerifiedMemberships(identity) {
  return (identity?.memberships || []).filter(
    (membership) =>
      membership?.status === "ACTIVE" &&
      membership?.organization?.status === "ACTIVE" &&
      membership?.organization?.verification_status ===
        "VERIFIED"
  );
}


function getStoredOrganizationId() {
  return localStorage.getItem(
    "agroflow_active_organization_id"
  );
}

function storeOrganizationId(organizationId) {
  if (organizationId) {
    localStorage.setItem(
      "agroflow_active_organization_id",
      String(organizationId)
    );
  }
}


function clearStoredOrganizationId() {
  localStorage.removeItem(
    "agroflow_active_organization_id"
  );
}


function resolveActiveMembership(
  identity,
  activeOrganizationId
) {
  const memberships =
    getVerifiedMemberships(identity);

  if (!activeOrganizationId) {
    return null;
  }

  return (
    memberships.find(
      (membership) =>
        String(
          membership?.organization?.id
        ) === String(activeOrganizationId)
    ) || null
  );
}


function deriveWorkspaceFromMembership(
  membership
) {
  const type =
    membership?.organization?.organization_type;

  if (type === "SCHOOL") {
    return "school";
  }

  if (type === "SUPPLIER") {
    return "supplier";
  }

  return null;
}

function getVerifiedMemberships(identity) {

  return (identity?.memberships || []).filter(
    (membership) =>
      membership?.status === "ACTIVE" &&
      membership?.organization?.status === "ACTIVE" &&
      membership?.organization?.verification_status ===
        "VERIFIED"
  );
}


function getPendingMemberships(identity) {

  return (identity?.memberships || []).filter(
    (membership) =>
      membership?.status === "PENDING" ||
      membership?.organization?.verification_status ===
        "PENDING"
  );
}


function getRejectedMemberships(identity) {

  return (identity?.memberships || []).filter(
    (membership) =>
      membership?.status === "REJECTED" ||
      membership?.organization?.verification_status ===
        "REJECTED"
  );
}

function hasResponsibility(
  identity,
  responsibilityCode
) {
  return (identity?.memberships || []).some(
    (membership) =>
      membership?.status === "ACTIVE" &&
      membership?.organization?.status === "ACTIVE" &&
      membership?.organization?.verification_status ===
        "VERIFIED" &&
      (membership?.responsibilities || []).some(
        (responsibility) =>
          responsibility?.code ===
          responsibilityCode
      )
  );
}

function deriveWorkspace(identity) {

  if (
    identity?.user?.is_system_admin === true
  ) {
    return "admin";
  }

  const memberships =
    getVerifiedMemberships(identity);

  if (memberships.length !== 1) {
    return null;
  }

  const type =
    memberships[0]?.organization?.organization_type;

  if (type === "SCHOOL") {
    return "school";
  }

  if (type === "SUPPLIER") {
    return "supplier";
  }

  return null;
}

function selectOrganization(
  organizationId
) {
  storeOrganizationId(organizationId);

  setActiveOrganizationId(
    String(organizationId)
  );
}

export function AuthProvider({
  children,
}) {

  const [authenticated, setAuthenticated] = useState(false);

  const [identity, setIdentity] =
    useState(null);

  const [loading, setLoading] =
    useState(true);
  
  const [
  activeOrganizationId,
  setActiveOrganizationId,
] = useState(
  getStoredOrganizationId()
);

  async function loadIdentity() {

    const value =
      await getCurrentIdentity();

    setIdentity(value);

    return value;
  }


  async function login(
    email,
    password
  ) {

    await loginRequest(email, password);
    setAuthenticated(true);
    await loadIdentity();
  }

  async function logout() {
  try {
    const {
      logout: logoutRequest,
    } = await import("../api/authApi");

    await logoutRequest();
  } finally {
    clearStoredOrganizationId();

    setActiveOrganizationId(null);
    setAuthenticated(false);
    setIdentity(null);
  }
}

  useEffect(() => {
    loadIdentity()
      .then(() => setAuthenticated(true))
      .catch(() => { setAuthenticated(false); setIdentity(null); })
      .finally(() => setLoading(false));
  }, []);

  
  useEffect(() => {
  if (!identity) {
    return;
  }

  const verified =
    getVerifiedMemberships(identity);

  if (verified.length === 1) {
    const organizationId =
      verified[0]?.organization?.id;

    if (
      organizationId &&
      String(organizationId) !==
        String(activeOrganizationId)
    ) {
      storeOrganizationId(
        organizationId
      );

      setActiveOrganizationId(
        String(organizationId)
      );
    }

    return;
  }

  if (
    verified.length > 1 &&
    activeOrganizationId
  ) {
    const exists = verified.some(
      (membership) =>
        String(
          membership?.organization?.id
        ) === String(activeOrganizationId)
    );

    if (!exists) {
      clearStoredOrganizationId();
      setActiveOrganizationId(null);
    }
  }
}, [
  identity,
  activeOrganizationId,
]);

  const value = useMemo(() => {

    const memberships =
      identity?.memberships || [];

    const verifiedMemberships =
      getVerifiedMemberships(
        identity
      );
    
    const activeMembership =
  resolveActiveMembership(
    identity,
    activeOrganizationId
  );

const workspace =
  deriveWorkspaceFromMembership(
    activeMembership
  );

    const pendingMemberships =
      getPendingMemberships(
        identity
      );

    const rejectedMemberships =
      getRejectedMemberships(
        identity
      );

    return {
  identity,

  user:
    identity?.user || null,

  memberships,

  verifiedMemberships,

  pendingMemberships,

  rejectedMemberships,

  workspace:
    deriveWorkspace(identity),

  isSystemAdmin:
    identity?.user?.is_system_admin === true,
  
  activeOrganizationId,

activeMembership,

activeOrganization:
  activeMembership?.organization || null,

workspace,

selectOrganization,
  isOrganizationAdmin:
    hasResponsibility(
      identity,
      "ORGANIZATION_ADMIN"
    ),

  isSupplierAdmin:
    hasResponsibility(
      identity,
      "SUPPLIER_ADMIN"
    ),

  hasResponsibility:
    (responsibilityCode) =>
      hasResponsibility(
        identity,
        responsibilityCode
      ),

  isAuthenticated:
    Boolean(authenticated && identity),

  hasVerifiedOrganization:
    verifiedMemberships.length > 0,

  hasPendingVerification:
    pendingMemberships.length > 0,

  hasRejectedVerification:
    rejectedMemberships.length > 0,

  loading,

  login,

  logout,
};

  }, [
    authenticated,
    identity,
    loading,
    activeOrganizationId,
  ]);


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  return useContext(
    AuthContext
  );
}