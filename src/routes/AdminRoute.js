import { Navigate, Outlet } from "react-router-dom";
import { canAccessAdminArea } from "../utils/roleHelpers";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function AdminRoute() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = parseJwt(token);

  if (!payload || !canAccessAdminArea(payload.role)) {
  return <Navigate to="/login" replace />;
}

  return <Outlet />;
}

export default AdminRoute;
