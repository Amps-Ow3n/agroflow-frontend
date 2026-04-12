import React from "react";

const EmptyState = ({
  title = "Nothing here yet",
  message = "No data available",
  action = null,
  icon = null,
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 text-center p-3 p-md-5">

      {icon && (
        <div className="mb-3 text-muted" style={{ fontSize: "2.5rem" }}>
          {icon}
        </div>
      )}

      <h6 className="fw-semibold text-dark mb-2">
        {title}
      </h6>

      <p className="text-muted small mx-auto" style={{ maxWidth: "420px" }}>
        {message}
      </p>

      {action && (
        <div className="mt-3 d-flex justify-content-center flex-wrap gap-2">
          {action}
        </div>
      )}

    </div>
  );
};

export default EmptyState;