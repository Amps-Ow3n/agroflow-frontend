import React,{useEffect,useState} from "react";
import PageContainer from "../../components/layout/PageContainer";
import PageNav from "../../components/navigation/PageNav";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import AlertBox from "../../components/ui/AlertBox";

import {getRiskIntelligence}
from "../../services/dashboardService";

const RiskIntelligencePage=()=>{

const [riskData,setRiskData]=useState(null);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);

useEffect(()=>{

fetchData();

},[]);


const fetchData=async()=>{

try{

const data=
await getRiskIntelligence();

setRiskData(data);

}
catch(err){

setError(
err.response?.data?.detail||
"Failed loading intelligence"
);

}
finally{

setLoading(false);

}

};

if(loading)
return(
<LoadingSpinner
message="Analyzing risk signals..."
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
title="Risk Intelligence Center"
>

<PageNav
sections={[
{id:"alerts",label:"Alerts"},
{id:"actions",label:"Actions"}
]}
/>

<div
id="alerts"
className="card border-0 shadow-sm"
>

<div className="card-body">

<h6 className="mb-3">

Risk Alerts

</h6>

{

riskData?.risk_alerts?.length?

riskData.risk_alerts.map(
(alert,index)=>(

<AlertBox
key={index}
type="warning"
message={
`${alert.message}`
}
/>

)
)

:

<EmptyState
message="No active alerts"
/>

}

</div>

</div>


<div
id="actions"
className="card border-0 shadow-sm mt-4"
>

<div className="card-body">

<h6>

Recommended Actions

</h6>

<ul>

{
riskData?.recommended_actions?.map(
(action,index)=>(

<li key={index}>
{action}
</li>

)
)
}

</ul>

</div>

</div>

</PageContainer>

)

};

export default RiskIntelligencePage;