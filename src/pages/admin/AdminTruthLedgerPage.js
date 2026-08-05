import {useEffect,useState} from "react";
import client from "../../api/client";
import ErrorState from "../../components/common/ErrorState";

import DeliveryHistory from "../../components/deliveries/DeliveryHistory";
import DeliveryEditForm from "../../components/deliveries/DeliveryEditForm";

import Loader from "../../components/common/Loader";


export default function AdminTruthLedgerPage(){

const [deliveries,setDeliveries]=useState([]);

const [selected,setSelected]=useState(null);

const [loading,setLoading]=useState(true);

const [error, setError] = useState("");

async function load() {

    try {

        setLoading(true);
        setError("");

        const res = await client.get(
            "/dashboard/system/truth-ledger"
        );

        setDeliveries(res.data);

    } catch (err) {

        const message =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load truth ledger.";

        setError(message);

    } finally {

        setLoading(false);

    }

}

useEffect(()=>{

load();

},[]);

async function saveCorrection(data){

await client.put(
`/dashboard/system/delivery/${data.id}`,
data
);


setSelected(null);

load();

}

if (loading)
    return <Loader text="Loading truth ledger" />;

if (error)
    return <ErrorState message={error} />;

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