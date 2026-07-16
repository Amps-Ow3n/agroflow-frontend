import React from "react";
import StatusBadge from "../common/StatusBadge";


export default function SourceCard({
    source,
    onEdit,
    onDelete
}) {


    const canEdit = !source.is_archived;

    const canDelete = !source.used_in_chain;



    return (

        <div className="border rounded p-3 bg-white shadow-sm">


            <div className="d-flex justify-content-between align-items-center">


                <h5 className="fw-bold mb-0">

                    {source.actor_name}

                </h5>


                <StatusBadge

                    status={
                        source.qty_available > 0
                        ?
                        "ACTIVE"
                        :
                        "EMPTY"
                    }

                />


            </div>




            <div className="mt-3">


                <p className="mb-1">

                    Product:

                    <b>
                        {" "}
                        {source.product}
                    </b>

                </p>



                <p className="mb-1">

                    Quantity:

                    <b>
                        {" "}
                        {source.qty_available} kg
                    </b>

                </p>



                <p className="mb-1">

                    Location:

                    <b>
                        {" "}
                        {source.location}
                    </b>

                </p>


            </div>





            <small className="text-muted">


                {source.available_from}

                {" → "}

                {source.available_to}


            </small>





            <div className="mt-3">


                {
                    canEdit &&

                    <button

                        className="btn btn-primary btn-sm me-2"

                        onClick={() => onEdit(source)}

                    >

                        Edit

                    </button>

                }





                {
                    canDelete ?

                    (

                    <button

                        className="btn btn-danger btn-sm"

                        onClick={() => onDelete(source.id)}

                    >

                        Delete

                    </button>

                    )

                    :

                    (

                    <button

                        disabled

                        className="btn btn-secondary btn-sm"

                    >

                        Used In Chain

                    </button>

                    )

                }


            </div>



        </div>


    );

}