import React from "react";

export default function EmptyState({

  title = "No data found",

  description = ""

}) {

  return (

    <div className="text-center py-5">

      <h5 className="text-muted">
        {title}
      </h5>

      {description && (

        <p className="text-secondary mb-0">
          {description}
        </p>

      )}

    </div>

  );

}