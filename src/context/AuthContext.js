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
  logout as logoutRequest,
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


function getStoredOrganizationId(userId = null) {
  try {
    if (userId) {
      return localStorage.getItem(`agroflow_active_organization_${userId}`);
    }

    // Backward compatibility with the earlier single-key implementation.
    return localStorage.getItem("activeOrganizationId");
  } catch (error) {
    return null;
  }
}


function storeOrganizationId(organizationId, userId = null) {
  try {
    if (organizationId === null || organizationId === undefined) {
      if (userId) {
        localStorage.removeItem(`agroflow_active_organization_${userId}`);
      }
      localStorage.removeItem("activeOrganizationId");
      return;
    }

    const value = String(organizationId);
    if (userId) {
      localStorage.setItem(`agroflow_active_organization_${userId}`, value);
    }
    // Keep the legacy key synchronized for existing API callers.
    localStorage.setItem("activeOrganizationId", value);
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

  const organizationType =
    membership?.organization?.organization_type;

  if (organizationType === "SCHOOL") {
    return "school";
  }

  if (organizationType === "SUPPLIER") {
    return "supplier";
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
     ORGANIZATION CONTEXT
     ======================================================= */

  useEffect(() => {
    if (!identity) return;

    if (identity?.user?.is_system_admin === true) {
      return;
    }

    const memberships = getVerifiedMemberships(identity);
    if (!memberships.length) {
      setActiveOrganizationId(null);
      return;
    }

    const userId = identity.user?.id;
    const schoolMemberships = memberships.filter(
      (membership) =>
        membership?.organization?.organization_type === "SCHOOL"
    );

    // A single verified organization is the canonical context. Do not allow
    // a stale browser-level organization key from a previous session to keep
    // a user on another valid organization.
    if (schoolMemberships.length === 1) {
      const organizationId = schoolMemberships[0]?.organization?.id;
      storeOrganizationId(organizationId, userId);
      setActiveOrganizationId(String(organizationId));
      return;
    }

    const rememberedId = getStoredOrganizationId(userId);
    const validRemembered = resolveActiveMembership(identity, rememberedId);

    if (validRemembered) {
      storeOrganizationId(rememberedId, userId);
      setActiveOrganizationId(String(rememberedId));
      return;
    }

    // Multiple verified organizations still require an explicit workspace
    // choice; until a selector is used, preserve the deterministic first
    // verified membership behavior from the existing implementation.
    const firstOrganizationId = memberships[0]?.organization?.id;
    storeOrganizationId(firstOrganizationId, userId);
    setActiveOrganizationId(String(firstOrganizationId));
  }, [identity]);


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

    storeOrganizationId(organizationId, identity?.user?.id);

    setActiveOrganizationId(
      String(organizationId)
    );
  }


  /* =======================================================
     LOGOUT
     ======================================================= */

  function clearOrganizationSelection() {
    try {
      localStorage.removeItem("activeOrganizationId");
    } catch (error) {
      // Ignore localStorage failures.
    }
    setActiveOrganizationId(null);
  }


  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearOrganizationSelection();
      setIdentity(null);
      setLoading(false);
    }
  }


  function activeMembershipHasPermission(permission) {
    return (activeMembership?.permissions || []).includes(permission);
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

  const requiresOrganizationSelection = false;


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

      hasPermission: (permission) =>
        activeMembershipHasPermission(permission),

      selectOrganization,

      clearOrganizationSelection,

      reloadIdentity: loadIdentity,

      login,

      logout,
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
      logout,
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