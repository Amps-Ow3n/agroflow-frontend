import {useEffect,useState} from "react";
import client from "../../api/client";

import DeliveryHistory from "../../components/deliveries/DeliveryHistory";
import DeliveryEditForm from "../../components/deliveries/DeliveryEditForm";

import Loader from "../../components/common/Loader";


export default function AdminTruthLedgerPage(){

const [deliveries,setDeliveries]=useState([]);

const [selected,setSelected]=useState(null);

const [loading,setLoading]=useState(true);



async function load(){

setLoading(true);

const res=await client.get(
"/dashboard/system/truth-ledger"
);

setDeliveries(res.data);

setLoading(false);

}



useEffect(()=>{

load();

},[]);

useEffect(() => {
    console.log("Selected delivery:", selected);
}, [selected]);

async function saveCorrection(data){

await client.put(
`/dashboard/system/delivery/${data.id}`,
data
);


setSelected(null);

load();

}



if(loading)

return <Loader text="Loading truth ledger"/>



return (

<div className="container-fluid">

<h2>
Admin Truth Ledger
</h2>


<p className="text-muted">

All delivery facts used by reliability intelligence

</p>

{
selected &&

<div className="card mt-4 p-3">

<DeliveryEditForm

delivery={selected}

onSave={saveCorrection}

/>

</div>

}

<DeliveryHistory

deliveries={deliveries}

adminMode={true}

onEdit={setSelected}

/>


</div>

)

}