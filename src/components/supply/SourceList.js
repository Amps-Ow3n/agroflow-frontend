import React from "react";

import SourceCard from "./SourceCard";


export default function SourceList({
  sources,
  onEdit,
  onDelete
}) {



  if(!sources || sources.length===0){

    return (

      <div className="text-center p-4 border rounded bg-light">

        <h6 className="mb-2">

          No supply sources yet

        </h6>


        <p className="text-muted mb-0">

          Register your first supply source.

        </p>


      </div>

    );

  }





  return (

    <div className="d-flex flex-column gap-3">


      {
        sources.map(source=>(

          <SourceCard

            key={source.id}

            source={source}

            onEdit={onEdit}

            onDelete={onDelete}

          />

        ))
      }


    </div>

  );

}