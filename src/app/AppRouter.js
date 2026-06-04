import {
Routes,
Route,
Navigate
}
from "react-router-dom";

import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRouter from "./RoleRouter";

import FarmerLayout from "../actors/farmer/FarmerLayout";
import BuyerLayout from "../actors/buyer/BuyerLayout";
import AdminLayout from "../actors/admin/AdminLayout";

import FarmerDashboard from "../actors/farmer/FarmerDashboard";
import BuyerDashboard from "../actors/buyer/BuyerDashboard";
import AdminDashboard from "../actors/admin/AdminDashboard";

import CapacityCenter from "../workflows/supply/CapacityCenter";
import CommitmentCenter from "../workflows/commitment/CommitmentCenter";
import DeliveryCenter from "../workflows/delivery/DeliveryCenter";
import VerificationCenter from "../workflows/verification/VerificationCenter";

import RiskDashboard from "../intelligence/risk/RiskDashboard";
import FeasibilityDashboard from "../intelligence/feasibility/FeasibilityDashboard";

import WhyCenter from "../intelligence/decisionLedger/WhyCenter";

const AppRouter=()=>{

return(

<Routes>

<Route
path="/login"
element={<LoginPage/>}
/>

<Route
path="/register"
element={<RegisterPage/>}
/>

<Route element={<ProtectedRoute/>}>

<Route
element={
<RoleRouter
allowedRoles={["farmer"]}
 />
}
>

<Route
path="/farmer"
element={<FarmerLayout/>}
>

<Route
path="dashboard"
element={<FarmerDashboard/>}
/>

<Route
path="supply"
element={<CapacityCenter/>}
/>

<Route
path="commitments"
element={<CommitmentCenter/>}
/>

<Route
path="deliveries"
element={<DeliveryCenter/>}
/>

<Route
path="verification"
element={<VerificationCenter/>}
/>

<Route
path="risk"
element={<RiskDashboard/>}
/>

<Route
path="feasibility"
element={<FeasibilityDashboard/>}
/>

<Route
path="why"
element={<WhyCenter/>}
/>

</Route>

</Route>

<Route
element={
<RoleRouter
allowedRoles={["buyer"]}
 />
}
>

<Route
path="/buyer"
element={<BuyerLayout/>}
>

<Route
path="dashboard"
element={<BuyerDashboard/>}
/>

</Route>

</Route>

<Route
element={
<RoleRouter
allowedRoles={["admin"]}
 />
}
>

<Route
path="/admin"
element={<AdminLayout/>}
>

<Route
path="dashboard"
element={<AdminDashboard/>}
/>

<Route
path="risk"
element={<RiskDashboard/>}
/>

<Route
path="why"
element={<WhyCenter/>}
/>

</Route>

</Route>

</Route>

<Route
path="*"
element={
<Navigate
to="/login"
replace
/>
}
/>

</Routes>

);

};

export default AppRouter;