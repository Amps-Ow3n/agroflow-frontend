import React from "react";
import StatusBadge from "../common/StatusBadge";


export default function DeliveryTruthCard({
  delivery,
  adminMode=false,
  onEdit
}) {


if(!delivery)
return null;

const gap =
(delivery.delivered_qty ?? 0)
-
(delivery.received_qty ?? 0);



return (

<div className="border rounded p-3 bg-white shadow-sm">


<div className="d-flex justify-content-between align-items-center">


<div>

<h5 className="fw-bold mb-1">

{delivery.product || "Delivery"}

</h5>


</div>


<StatusBadge

status={
delivery.verification_status ||
"PENDING"
}

/>


</div>



<div className="mt-3">


<p className="mb-1">

Expected:
<b>
{" "}
{delivery.delivered_qty}
kg
</b>

</p>



<p className="mb-1">

Received:
<b>

{" "}
{
delivery.received_qty ??
"Not verified"
}

kg

</b>

</p>



<p className="mb-1">

Difference:

<b>

{" "}
{gap}
kg

</b>

</p>


</div>



<div className="mt-3 text-muted small">


Quality:

<b>
{" "}
{
delivery.quality_status ||
"Pending"
}
</b>


{" | "}


Delay:

<b>
{" "}
{
delivery.delay_status ||
"Pending"
}
</b>


</div>



{
delivery.confidence_score !== null &&
delivery.confidence_score !== undefined &&

<div className="mt-2 small">

Confidence:

<b>
{" "}
{delivery.confidence_score}
</b>


</div>

}




{
adminMode &&

<button

className="btn btn-outline-primary btn-sm mt-3"

onClick={()=>
onEdit(delivery)
}

>

Correct Delivery

</button>

}


</div>

);

}