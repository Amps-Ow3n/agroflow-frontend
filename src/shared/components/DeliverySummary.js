import React from "react";

const DeliverySummary=({
deliveries=[]
})=>{

const delivered=deliveries.reduce(
(a,d)=>a+d.delivered_qty,
0
);

return(

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h6 className="fw-bold mb-3">

Delivered Volume

</h6>

<h3>{delivered}</h3>

<div className="small text-muted">

Total fulfilled quantity

</div>

</div>

</div>

);

};

export default DeliverySummary;