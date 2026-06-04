import React,{useEffect,useState}
from "react";

import PageContainer
from "../../components/layout/PageContainer";

import LoadingSpinner
from "../../components/ui/LoadingSpinner";

import EmptyState
from "../../components/ui/EmptyState";

import {
getSystemReport
}
from "../../services/dashboardService";

const AdminReport=()=>{

const [report,setReport]=
useState(null);

const [loading,setLoading]=
useState(true);

const [error,setError]=
useState(null);


useEffect(()=>{

loadReport();

},[]);


const loadReport=async()=>{

try{

const data=
await getSystemReport();

setReport(data);

}
catch(err){

setError(
err.response?.data?.detail||
"Report unavailable"
)

}
finally{

setLoading(false)

}

};


if(loading)
return(
<LoadingSpinner
message="Building report..."
/>
)

if(error)
return(
<EmptyState
message={error}
/>
)

return(

<PageContainer
title="System Report"
>

<div className="row g-3">

<div className="col-md-3">

<div className="card p-3">

<h6>Supply</h6>

<h4>
{report.system_summary.total_supply}
</h4>

</div>

</div>


<div className="col-md-3">

<div className="card p-3">

<h6>Committed</h6>

<h4>
{report.system_summary.total_committed}
</h4>

</div>

</div>


<div className="col-md-3">

<div className="card p-3">

<h6>Delivered</h6>

<h4>
{report.system_summary.total_delivered}
</h4>

</div>

</div>


<div className="col-md-3">

<div className="card p-3">

<h6>Fulfillment</h6>

<h4>
{report.system_summary.fulfillment_rate}%
</h4>

</div>

</div>

</div>

</PageContainer>

)

};

export default AdminReport;