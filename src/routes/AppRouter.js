// src/routes/AppRouter.js
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import FarmerRoute from "./FarmerRoute";
import AdminRoute from "./AdminRoute";

import FarmerLayout from "../components/layout/FarmerLayout";
import AdminLayout from "../components/layout/AdminLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import SupplyPage from "../pages/farmer/SupplyPage";
import CommitmentsPage from "../pages/farmer/CommitmentsPage";
import FeasibilityPage from "../pages/farmer/FeasibilityPage";
import DeliveriesPage from "../pages/farmer/DeliveriesPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminFarmerProfilePage from "../pages/admin/AdminFarmerProfilePage";
import RiskIntelligencePage from "../pages/admin/RiskIntelligencePage";
import AdminFarmersListPage from "../pages/admin/AdminFarmersListPage";
import { getDashboardRoute } from "../utils/roleHelpers";
import AdminReport from "../pages/admin/AdminReport";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import { useAuth } from "../context/AuthContext";
const AppRouter = () => {
  const { role } = useAuth();
  const dashboardRoute = getDashboardRoute(role);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>

        {/* FARMER AREA */}
        <Route element={<FarmerRoute />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="supply" element={<SupplyPage />} />
            <Route path="commitments" element={<CommitmentsPage />} />
            <Route path="feasibility" element={<FeasibilityPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
          </Route>
        </Route>

        {/* ADMIN AREA */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="risk-intelligence" element={<RiskIntelligencePage />} />
            <Route path="farmer/:farmerId" element={<AdminFarmerProfilePage />} />
            <Route path="farmers" element={<AdminFarmersListPage />} />
            <Route path="report" element={<AdminReport />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>

      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to={dashboardRoute || "/login"} replace />} />
    </Routes>
  );
};

export default AppRouter;