// src/utils/roleHelpers.js

/*
=====================================================
Role constants (must match backend users.role)
=====================================================
*/

export const ROLES = {
  FARMER: "farmer",
  ADMIN: "admin"
};

/*
=====================================================
Basic role checks
=====================================================
*/

export const isFarmer = (role) => role === ROLES.FARMER;

export const isAdmin = (role) => role === ROLES.ADMIN;

export const hasRole = (role, allowedRoles = []) => {
  return allowedRoles.includes(role);
};

/*
=====================================================
Dashboard routing helper
Used after login
=====================================================
*/
export const getDashboardRoute = (role) => {
  if (isAdmin(role)) return "/admin/dashboard";
  if (isFarmer(role)) return "/farmer/dashboard";
  return "/login";
};
/*
=====================================================
Access guard helper (optional UI usage)
=====================================================
*/
export const canAccessFarmerArea = (role) => {
  return isFarmer(role);
};

export const canAccessAdminArea = (role) => {
  return isAdmin(role);
};
