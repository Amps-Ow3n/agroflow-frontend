import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./context/AuthContext";

import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";

import SchoolDashboardPage from "./pages/school/SchoolDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import SupplierLayout from "./layouts/SupplierLayout";
import SupplierDashboardPage from "./pages/supplier/SupplierDashboardPage";
import SupplierSourcesPage from "./pages/supplier/SupplierSourcesPage";
import RegisterSourcePage from "./pages/supplier/RegisterSourcePage";
import SupplierCommitmentsPage from "./pages/supplier/SupplierCommitmentsPage";
import SupplierOpenDemandsPage from "./pages/supplier/SupplierOpenDemandsPage";
import SupplierChainsPage from "./pages/supplier/SupplierChainsPage";
import SupplierDeliveriesPage from "./pages/supplier/SupplierDeliveriesPage";

import SchoolLayout from "./layouts/SchoolLayout";
import CreateSchoolDemandPage from "./pages/school/CreateSchoolDemandPage";
import SchoolDemandsPage from "./pages/school/SchoolDemandsPage";
import SchoolDeliveriesPage from "./pages/school/SchoolDeliveriesPage";

import AdminLayout from "./layouts/AdminLayout";

import FailureDrillDownPage from "./pages/admin/FailureDrillDownPage";
import ChainExplorerPage from "./pages/admin/ChainExplorerPage";
import TruthAuditPage from "./pages/admin/TruthAuditPage";
import AdminCommitmentDetailPage from "./pages/admin/AdminCommitmentDetailPage";
import AdminTruthLedgerPage from "./pages/admin/AdminTruthLedgerPage";

function App() {
  const { role, isAuthenticated } = useContext(AuthContext);

  const getHome = () => {
    if (!isAuthenticated) return "/login";

    switch (role) {
      case "school":
        return "/school";
      case "supplier":
        return "/supplier";
      case "admin":
        return "/admin";
      default:
        return "/login";
    }
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ENTRY */}
        <Route path="/" element={<Navigate to={getHome()} />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =========================
            SCHOOL
        ========================= */}
       <Route path="/school" element={<SchoolLayout />}>
  <Route index element={<SchoolDashboardPage />} />
  <Route path="demands/new" element={<CreateSchoolDemandPage />} />
  <Route path="demands" element={<SchoolDemandsPage />} />
  <Route path="deliveries" element={<SchoolDeliveriesPage />} />
</Route>
        
        {/* =========================
    ADMIN (FIXED STRUCTURE)
========================= */}
<Route path="/admin" element={<AdminLayout />}>

  {/* default admin page */}
  <Route index element={<AdminDashboardPage />} />

  {/* NEW: investigation flow */}
  <Route path="dashboard" element={<AdminDashboardPage />} />
  <Route path="failures" element={<FailureDrillDownPage />} />

  {/* NEW: entity drilldown */}
  <Route
    path="chain/:id"
    element={<ChainExplorerPage />}
/>
  <Route
    path="commitment/:id"
    element={<AdminCommitmentDetailPage />}
/>
  {/* optional audit page */}
  <Route path="truth-audit" element={<TruthAuditPage />} />
  <Route 
path="truth-ledger"
element={<AdminTruthLedgerPage />}
/>

</Route>
        {/* =========================
            SUPPLIER SYSTEM (FIXED)
        ========================= */}
        <Route path="/supplier" element={<SupplierLayout />}>

          {/* index = default dashboard */}
          <Route index element={<SupplierDashboardPage />} />

          {/* nested routes (IMPORTANT FIX) */}
          <Route path="sources" element={<SupplierSourcesPage />} />
          <Route path="sources/new" element={<RegisterSourcePage />} />
          <Route path="commitments" element={<SupplierCommitmentsPage />} />
          <Route path="commitments/new" element={<SupplierCommitmentsPage />} />
          <Route path="open-demands" element={<SupplierOpenDemandsPage />} />
          <Route path="chains" element={<SupplierChainsPage />} />
          <Route path="deliveries" element={<SupplierDeliveriesPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;