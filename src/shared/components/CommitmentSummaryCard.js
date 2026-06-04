import React from "react";

const CommitmentSummaryCard=({
commitments=[]
})=>{

const total=commitments.reduce(
(a,c)=>a+c.promised_qty,
0
);

return(

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h6 className="fw-bold mb-3">

Commitment Volume

</h6>

<h3>{total}</h3>

<div className="small text-muted">

Total committed quantity

</div>

</div>

</div>

);

};

export default CommitmentSummaryCard;