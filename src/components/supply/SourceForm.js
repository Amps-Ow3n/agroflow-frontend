import React, { useEffect, useState } from "react";

import {
    registerSource
} from "../../api/sourceApi";

import Input from "../common/Input";
import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";



export default function SourceForm({

    editingSource,

    onSuccess,

    onUpdate,

    onCancelEdit

}) {



const emptyForm = {

    actor_type:"farmer",
    actor_name:"",
    product:"",
    qty_available:"",
    location:"",
    available_from:"",
    available_to:""

};



const [form,setForm]=useState(emptyForm);


const [loading,setLoading]=useState(false);

const [error,setError]=useState("");

const [success,setSuccess]=useState("");





useEffect(()=>{


    if(editingSource){

        setForm({

            actor_type:
            editingSource.actor_type || "farmer",

            actor_name:
            editingSource.actor_name || "",

            product:
            editingSource.product || "",

            qty_available:
            editingSource.qty_available || "",

            location:
            editingSource.location || "",

            available_from:
            editingSource.available_from || "",

            available_to:
            editingSource.available_to || ""

        });


    }

    else{

        setForm(emptyForm);

    }


},[editingSource]);






function handleChange(e){

    setForm({

        ...form,

        [e.target.name]:
        e.target.value

    });

}


async function submit(e){

    e.preventDefault();


    setLoading(true);

    setError("");


    try{


        const payload={

            ...form,

            qty_available:
            Number(form.qty_available)

        };



        if(editingSource){


            await onUpdate(

                editingSource.id,

                payload

            );


        }


        else{


            await registerSource(payload);


            setSuccess(
                "Source registered successfully"
            );


            setForm(emptyForm);


            if(onSuccess)
                onSuccess();


        }



    }

    catch(err){


        setError(
            err?.response?.data?.detail ||
            "Operation failed"
        );


    }

    finally{

        setLoading(false);

    }


}







return (

<form onSubmit={submit}>


{
error &&
<ErrorState message={error}/>
}

<div className="mb-3">
  <label className="form-label">
    Source Type
  </label>

  <select
    name="actor_type"
    className="form-select"
    value={form.actor_type}
    onChange={handleChange}
  >
    <option value="farmer">
      Farmer
    </option>

    <option value="trader">
      Trader
    </option>

    <option value="processor">
      Processor
    </option>

    <option value="cooperative">
      Cooperative
    </option>
  </select>
</div>

<Input
label="Actor Name"
name="actor_name"
value={form.actor_name}
onChange={handleChange}
placeholder="e.g. Kato Farmers Cooperative"
/>

<Input
label="Product"
name="product"
value={form.product}
onChange={handleChange}
placeholder="e.g. Maize Flour"
/>

<Input
label="Quantity (kg)"
name="qty_available"
type="number"
value={form.qty_available}
onChange={handleChange}
placeholder="e.g. 2500"
/>

<Input
label="Location"
name="location"
value={form.location}
onChange={handleChange}
placeholder="e.g. Mbale"
/>

<div className="row">

<div className="col">

<Input
label="Available From"
name="available_from"
type="date"
value={form.available_from}
onChange={handleChange}
placeholder="Select start date"
/>

</div>



<div className="col">


<Input
label="Available To"
name="available_to"
type="date"
value={form.available_to}
onChange={handleChange}
placeholder="Select end date"
/>

</div>


</div>

{
loading ?

<Loader text="Saving..." />

:

<Button type="submit">

{
editingSource
?
"Update Source"
:
"Register Source"
}

</Button>

}





{
editingSource &&

<button

type="button"

className="btn btn-secondary ms-2"

onClick={onCancelEdit}

>

Cancel

</button>

}



</form>

);


}