import React from "react";

const FeasibilitySummary=({
feasibility=[]
})=>{

const highRisk=feasibility.filter(
f=>f.status==="HIGH_RISK"
).length;

return(

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h6 className="fw-bold mb-3">

Feasibility Signals

</h6>

<h3>

{highRisk}

</h3>

<div className="small text-muted">

High risk commitments detected

</div>

</div>

</div>

);

};

export default FeasibilitySummary;