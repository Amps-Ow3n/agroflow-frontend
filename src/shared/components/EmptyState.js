import React from "react";

const EmptyState = ({
  title = "No data available",
  message = "Nothing has been recorded yet."
}) => {
  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body text-center py-5">

        <div
          className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width:"70px",
            height:"70px"
          }}
        >
          📭
        </div>

        <h6 className="fw-bold">
          {title}
        </h6>

        <p className="text-muted small mb-0">
          {message}
        </p>

      </div>

    </div>
  );
};

export default EmptyState;