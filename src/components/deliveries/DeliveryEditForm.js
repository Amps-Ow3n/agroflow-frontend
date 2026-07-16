import React, {useState} from "react";


export default function DeliveryEditForm({
 delivery,
 onSave
}){


const [form,setForm]=useState({

received_qty:
delivery.received_qty || "",

quality_status:
delivery.quality_status || "",

delay_status:
delivery.delay_status || "",

verification_status:
delivery.verification_status || "VERIFIED",

verification_notes:
delivery.verification_notes || ""

});



function update(e){

setForm({

...form,

[e.target.name]:
e.target.value

});

}


function submit(e){

e.preventDefault();

onSave({

id:delivery.id,

...form

});

}



return (

<form
onSubmit={submit}
className="border rounded p-3"
>


<h6 className="fw-bold">
Correct Delivery
</h6>


<input
className="form-control mb-2"
name="received_qty"
type="number"
value={form.received_qty}
onChange={update}
placeholder="Received quantity"
/>



<select
className="form-control mb-2"
name="quality_status"
value={form.quality_status}
onChange={update}
>

<option value="">
Quality
</option>

<option>
GOOD
</option>

<option>
FAILED
</option>

</select>



<select
className="form-control mb-2"
name="delay_status"
value={form.delay_status}
onChange={update}
>

<option value="">
Delay
</option>

<option>
ON_TIME
</option>

<option>
DELAYED
</option>


</select>



<textarea
className="form-control mb-2"
name="verification_notes"
value={form.verification_notes}
onChange={update}
placeholder="Reason for correction"
/>



<button className="btn btn-primary">

Save Correction

</button>

</form>

);

}