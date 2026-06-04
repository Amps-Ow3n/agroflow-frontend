import React from "react";

const SupplySummaryCard = ({ supplies=[] }) => {

const total=supplies.reduce(
(a,s)=>a+s.qty_max,
0
);

return (

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h6 className="fw-bold mb-3">
Supply Capacity
</h6>

<h3>{total}</h3>

<div className="small text-muted">

Total registered crop volume

</div>

</div>

</div>

);

};

export default SupplySummaryCard;