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


const AuthContext = createContext(null);


/* =========================================================
   ORGANIZATION HELPERS
   ========================================================= */

function getVerifiedMemberships(identity) {
  return (identity?.memberships || []).filter((membership) => {
    const organization = membership?.organization;

    return (
      membership?.status === "ACTIVE" &&
      organization?.status === "ACTIVE" &&
      organization?.verification_status === "VERIFIED"
    );
  });
}


function getPendingMemberships(identity) {
  return (identity?.memberships || []).filter((membership) => {
    return membership?.status === "PENDING";
  });
}


function getRejectedMemberships(identity) {
  return (identity?.memberships || []).filter((membership) => {
    return membership?.status === "REJECTED";
  });
}


function getStoredOrganizationId() {
  try {
    return localStorage.getItem("activeOrganizationId");
  } catch (error) {
    return null;
  }
}


function storeOrganizationId(organizationId) {
  try {
    if (organizationId === null || organizationId === undefined) {
      localStorage.removeItem("activeOrganizationId");
      return;
    }

    localStorage.setItem(
      "activeOrganizationId",
      String(organizationId)
    );
  } catch (error) {
    // Ignore localStorage failures.
  }
}


function resolveActiveMembership(identity, activeOrganizationId) {
  const verifiedMemberships = getVerifiedMemberships(identity);

  if (!activeOrganizationId) {
    return null;
  }

  return (
    verifiedMemberships.find(
      (membership) =>
        String(membership?.organization?.id) ===
        String(activeOrganizationId)
    ) || null
  );
}


/* =========================================================
   WORKSPACE
   ========================================================= */

function deriveWorkspaceFromMembership(membership) {
  if (!membership) {
    return null;
  }

  const responsibilities = membership?.responsibilities || [];

  const responsibilityCodes = responsibilities.map((responsibility) => {
    if (typeof responsibility === "string") {
      return responsibility;
    }

    return responsibility?.code;
  });

  if (
    responsibilityCodes.includes("ORGANIZATION_ADMIN")
  ) {
    return "admin";
  }

  if (
    responsibilityCodes.includes("SUPPLIER_ADMIN") ||
    responsibilityCodes.includes("SUPPLIER_USER")
  ) {
    return "supplier";
  }

  if (
    responsibilityCodes.includes("PROCUREMENT_OFFICER") ||
    responsibilityCodes.includes("PROCUREMENT_REVIEWER") ||
    responsibilityCodes.includes("RECEIVING_OFFICER")
  ) {
    return "school";
  }

  return null;
}


/* =========================================================
   RESPONSIBILITY HELPERS
   ========================================================= */

function membershipHasResponsibility(
  membership,
  responsibilityCode
) {
  const responsibilities =
    membership?.responsibilities || [];

  return responsibilities.some((responsibility) => {
    if (typeof responsibility === "string") {
      return responsibility === responsibilityCode;
    }

    return (
      responsibility?.code === responsibilityCode
    );
  });
}


function hasResponsibility(
  identity,
  responsibilityCode
) {
  return getVerifiedMemberships(identity).some(
    (membership) =>
      membershipHasResponsibility(
        membership,
        responsibilityCode
      )
  );
}


/* =========================================================
   PROVIDER
   ========================================================= */

export function AuthProvider({ children }) {
  const [
    identity,
    setIdentity,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    activeOrganizationId,
    setActiveOrganizationId,
  ] = useState(getStoredOrganizationId());


  /* =======================================================
     LOAD CURRENT IDENTITY
     ======================================================= */

  async function loadIdentity() {
    try {
      setLoading(true);

      const data = await getCurrentIdentity();

      setIdentity(data);

      return data;
    } catch (error) {
      console.error(
        "Failed to load current identity:",
        error
      );

      setIdentity(null);

      return null;
    } finally {
      setLoading(false);
    }
  }


  /* =======================================================
     INITIAL IDENTITY LOAD
     ======================================================= */

  useEffect(() => {
    loadIdentity();
  }, []);


  /* =======================================================
     ORGANIZATION SELECTION
     ======================================================= */

  useEffect(() => {
    if (!identity) {
      return;
    }

    // System admins do not need an organization context.
    if (identity?.user?.is_system_admin === true) {
      return;
    }

    const verifiedMemberships =
      getVerifiedMemberships(identity);

    // No verified organizations.
    if (verifiedMemberships.length === 0) {
      storeOrganizationId(null);
      setActiveOrganizationId(null);
      return;
    }

    // Exactly one verified organization:
    // automatically select it.
    if (verifiedMemberships.length === 1) {
      const organizationId =
        verifiedMemberships[0]?.organization?.id;

      storeOrganizationId(organizationId);
      setActiveOrganizationId(
        String(organizationId)
      );

      return;
    }

    // Multiple organizations:
    // keep the selected organization only if it is
    // still one of the user's verified memberships.
    const selectedMembership =
      resolveActiveMembership(
        identity,
        activeOrganizationId
      );

    if (!selectedMembership) {
      storeOrganizationId(null);
      setActiveOrganizationId(null);
    }
  }, [
    identity,
    activeOrganizationId,
  ]);


  /* =======================================================
     LOGIN
     ======================================================= */

  async function login(email, password) {
    const data = await loginRequest(
      email,
      password
    );

    await loadIdentity();

    return data;
  }


  /* =======================================================
     ORGANIZATION SELECTOR
     ======================================================= */

  function selectOrganization(organizationId) {
    if (
      organizationId === null ||
      organizationId === undefined
    ) {
      storeOrganizationId(null);
      setActiveOrganizationId(null);
      return;
    }

    const verifiedMemberships =
      getVerifiedMemberships(identity);

    const selectedMembership =
      verifiedMemberships.find(
        (membership) =>
          String(
            membership?.organization?.id
          ) === String(organizationId)
      );

    if (!selectedMembership) {
      console.error(
        "Cannot select organization. The user does not have an active verified membership in this organization."
      );

      return;
    }

    storeOrganizationId(organizationId);

    setActiveOrganizationId(
      String(organizationId)
    );
  }


  /* =======================================================
     LOGOUT
     ======================================================= */

  function clearOrganizationSelection() {
    storeOrganizationId(null);
    setActiveOrganizationId(null);
  }


  /* =======================================================
     DERIVED ORGANIZATION STATE
     ======================================================= */

  const verifiedMemberships = useMemo(
    () => getVerifiedMemberships(identity),
    [identity]
  );

  const pendingMemberships = useMemo(
    () => getPendingMemberships(identity),
    [identity]
  );

  const rejectedMemberships = useMemo(
    () => getRejectedMemberships(identity),
    [identity]
  );

  const activeMembership = useMemo(
    () =>
      resolveActiveMembership(
        identity,
        activeOrganizationId
      ),
    [
      identity,
      activeOrganizationId,
    ]
  );

  const activeOrganization = useMemo(
    () =>
      activeMembership?.organization || null,
    [activeMembership]
  );


  /* =======================================================
     WORKSPACE
     ======================================================= */

  const workspace = useMemo(() => {
    if (
      identity?.user?.is_system_admin === true
    ) {
      return "admin";
    }

    return deriveWorkspaceFromMembership(
      activeMembership
    );
  }, [
    identity,
    activeMembership,
  ]);


  /* =======================================================
     ORGANIZATION ADMIN / SUPPLIER ADMIN
     ======================================================= */

  const isOrganizationAdmin = useMemo(() => {
    return membershipHasResponsibility(
      activeMembership,
      "ORGANIZATION_ADMIN"
    );
  }, [activeMembership]);


  const isSupplierAdmin = useMemo(() => {
    return membershipHasResponsibility(
      activeMembership,
      "SUPPLIER_ADMIN"
    );
  }, [activeMembership]);


  /* =======================================================
     VERIFIED ORGANIZATION STATE
     ======================================================= */

  const hasVerifiedOrganization =
    verifiedMemberships.length > 0;

  const requiresOrganizationSelection =
    identity?.user?.is_system_admin !== true &&
    verifiedMemberships.length > 1 &&
    !activeMembership;


  /* =======================================================
     CONTEXT VALUE
     ======================================================= */

  const value = useMemo(
    () => ({
      identity,

      user: identity?.user || null,

      loading,

      isAuthenticated: !!identity,

      verifiedMemberships,

      pendingMemberships,

      rejectedMemberships,

      hasVerifiedOrganization,

      requiresOrganizationSelection,

      activeOrganizationId,

      activeMembership,

      activeOrganization,

      workspace,

      isOrganizationAdmin,

      isSupplierAdmin,

      hasResponsibility: (
        responsibilityCode
      ) =>
        hasResponsibility(
          identity,
          responsibilityCode
        ),

      selectOrganization,

      clearOrganizationSelection,

      reloadIdentity: loadIdentity,

      login,
    }),
    [
      identity,
      loading,
      verifiedMemberships,
      pendingMemberships,
      rejectedMemberships,
      hasVerifiedOrganization,
      requiresOrganizationSelection,
      activeOrganizationId,
      activeMembership,
      activeOrganization,
      workspace,
      isOrganizationAdmin,
      isSupplierAdmin,
    ]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/* =========================================================
   HOOK
   ========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}