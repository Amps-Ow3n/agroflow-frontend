import React, { useEffect, useState } from "react";
import PageContainer from "../../shared/components/PageContainer";
import PageNav from "../../shared/components/PageNav";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import EmptyState from "../../shared/components/EmptyState";

import SupplySummaryCard from "../../shared/components/SupplySummaryCard";
import CommitmentSummaryCard from "../../shared/components/CommitmentSummaryCard";
import DeliverySummary from "../../shared/components/DeliverySummary";
import FeasibilitySummary from "../../shared/components/FeasibilitySummary";
import {
    getAdminDashboard,
    getAdminFeasibilitySummary
} from "../../services/dashboardService";

const AdminDashboard=()=>{

const [dashboard,setDashboard]=useState(null);
const [feasibility,setFeasibility]=useState(null);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);

useEffect(()=>{

loadDashboard();

},[]);

const loadDashboard=async()=>{

setLoading(true);

try{

const [dashboardData,feasibilityData]=
await Promise.all([
getAdminDashboard(),
getAdminFeasibilitySummary()
]);

setDashboard(dashboardData);
setFeasibility(feasibilityData);

}catch(err){

setError(
err.response?.data?.detail||
"Failed to load dashboard"
)

}
finally{
setLoading(false)
}

};

if(loading)
return(
<LoadingSpinner message="Loading system intelligence..." />
);

if(error)
return(
<EmptyState message={error}/>
);

return(

<PageContainer
title="System Intelligence Dashboard"
interpretation="System-wide operational intelligence."
>

<PageNav
sections={[
{id:"overview",label:"Overview"},
{id:"feasibility",label:"Feasibility"}
]}
/>

<div
id="overview"
className="row g-3"
>

<div className="col-md-6">

<SupplySummaryCard
data={dashboard?.supply_summary||[]}
/>

</div>

<div className="col-md-6">

<CommitmentSummaryCard
data={dashboard?.commitment_summary||[]}
/>

</div>

<div className="col-12">

<DeliverySummary
deliveries={
dashboard?.delivery_performance||[]
}
/>

</div>

</div>

<div
id="feasibility"
className="mt-4"
>

<FeasibilitySummary
data={feasibility}
/>

</div>

</PageContainer>

)

};

export default AdminDashboard;