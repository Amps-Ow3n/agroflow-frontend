import React,{useEffect,useState}
from "react";

import PageContainer
from "../../shared/components/PageContainer";

import PageNav
from "../../shared/components/PageNav";

import LoadingSpinner
from "../../shared/components/LoadingSpinner";

import EmptyState
from "../../shared/components/EmptyState";

import SupplySummaryCard from "../../shared/components/SupplySummaryCard";
import CommitmentSummaryCard from "../../shared/components/CommitmentSummaryCard";
import DeliverySummary from "../../shared/components/DeliverySummary";
import FeasibilitySummary from "../../shared/components/FeasibilitySummary";

import {
getFarmerDashboard
}
from "../../services/dashboardService";

const FarmerDashboard=()=>{

const [dashboard,setDashboard]=
useState(null);

const [loading,setLoading]=
useState(true);

const [error,setError]=
useState(null);


useEffect(()=>{

loadDashboard();

},[]);


const loadDashboard=async()=>{

try{

const data=
await getFarmerDashboard();

setDashboard(data);

}
catch(err){

setError(
err.response?.data?.detail||
"Dashboard unavailable"
);

}
finally{

setLoading(false);

}

};

if(loading)
return(
<LoadingSpinner
message="Loading dashboard..."
/>
);

if(error)
return(
<EmptyState
message={error}
/>
);

return(

<PageContainer
title="Farmer Dashboard"
interpretation="Operational intelligence for your farm."
>

<PageNav
sections={[
{id:"overview",label:"Overview"}
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


<div className="col-12">

<FeasibilitySummary
data={
dashboard?.feasibility
}
/>

</div>

</div>

</PageContainer>

)

};

export default FarmerDashboard;