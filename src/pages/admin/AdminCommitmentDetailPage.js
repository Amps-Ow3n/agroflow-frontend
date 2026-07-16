import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

import DeliveryHistory from "../../components/deliveries/DeliveryHistory";
import DeliveryEditForm from "../../components/deliveries/DeliveryEditForm";


export default function AdminCommitmentDetailPage() {

    const { id } = useParams();


    const [summary, setSummary] = useState(null);

    const [deliveries, setDeliveries] = useState([]);

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");



    async function loadPage() {

        try {

            setLoading(true);

            setError("");

            const [
                summaryRes,
                deliveriesRes
            ] = await Promise.all([

                client.get(
                    `/dashboard/system/commitment/${id}`
                ),

                client.get(
                    `/dashboard/system/commitment/${id}/deliveries`
                )

            ]);


            setSummary(summaryRes.data);

            setDeliveries(deliveriesRes.data);

        }


        catch(err){

            setError(
                err?.response?.data?.detail ||
                "Failed to load commitment."
            );

        }


        finally{

            setLoading(false);

        }

    }



    useEffect(()=>{

        loadPage();

    },[id]);





    async function saveCorrection(data){

        try{

            setSaving(true);

            await client.put(

                `/dashboard/system/delivery/${data.id}`,

                data

            );


            setSelectedDelivery(null);


            await loadPage();


        }

        catch(err){

            setError(

                err?.response?.data?.detail ||
                "Correction failed."

            );

        }


        finally{

            setSaving(false);

        }

    }




    if(loading){

        return <Loader text="Loading commitment audit..." />;

    }



    if(error){

        return <ErrorState message={error}/>;

    }



    if(!summary){

        return null;

    }



    const commitment =
        summary.commitment || {};

    const supplier =
        summary.supplier || {};

    const school =
        summary.school || {};



    /*
       Type C protection:
       Backend intelligence objects are normalized
       before rendering.
    */

    const reliability =
        summary.reliability_score || {};



    const reliabilityScore =
        typeof reliability === "object"
        ? reliability.score
        : reliability;



    const reliabilityConfidence =
        typeof reliability === "object"
        ? reliability.confidence
        : "UNKNOWN";





    return (

        <div className="container-fluid py-4">


            <div className="mb-4">

                <h2 className="fw-bold">
                    Commitment Audit
                </h2>

                <p className="text-muted">
                    Investigate delivery truth and correct verified records.
                </p>

            </div>





            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">


                    <div className="row">


                        <div className="col-md-6">


                            <h5 className="fw-bold">
                                Commitment Summary
                            </h5>


                            <hr/>


                            <p>
                                <b>Product:</b>{" "}
                                {commitment.product}
                            </p>


                            <p>
                                <b>Promised Quantity:</b>{" "}
                                {commitment.promised_qty} kg
                            </p>


                            <p>
                                <b>Status:</b>{" "}
                                {commitment.status}
                            </p>


                            <p>
                                <b>Window:</b>{" "}
                                {commitment.delivery_start}
                                {" → "}
                                {commitment.delivery_end}
                            </p>


                        </div>





                        <div className="col-md-6">


                            <h5 className="fw-bold">
                                Participants
                            </h5>


                            <hr/>


                            <p>
                                <b>Supplier:</b>{" "}
                                {supplier.name}
                            </p>


                            <p>
                                <b>School:</b>{" "}
                                {school.name}
                            </p>



                            <p>
                                <b>
                                    Reliability Score:
                                </b>{" "}

                                {reliabilityScore ?? "N/A"}

                            </p>



                            <p>
                                <b>
                                    Confidence:
                                </b>{" "}

                                {reliabilityConfidence}

                            </p>


                        </div>


                    </div>


                </div>


            </div>







            <div className="card shadow-sm border-0">

                <div className="card-body">


                    <h5 className="fw-bold mb-3">
                        Delivery Ledger
                    </h5>



                    <DeliveryHistory

                        deliveries={deliveries}

                        adminMode={true}

                        onEdit={setSelectedDelivery}

                    />


                </div>


            </div>







            {
            selectedDelivery &&

            <div

                className="modal show d-block"

                style={{
                    background:"rgba(0,0,0,.5)"
                }}

            >

                <div className="modal-dialog">


                    <div className="modal-content">


                        <div className="modal-header">

                            <h5>
                                Correct Delivery
                            </h5>


                            <button

                                className="btn-close"

                                onClick={()=>setSelectedDelivery(null)}

                            />

                        </div>



                        <div className="modal-body">


                            <DeliveryEditForm

                                delivery={selectedDelivery}

                                onSave={saveCorrection}

                            />



                            {
                            saving &&
                            <div className="text-center mt-3">

                                Saving correction...

                            </div>
                            }


                        </div>



                    </div>


                </div>


            </div>

            }



        </div>

    );

}