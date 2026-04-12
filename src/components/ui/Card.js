import React, { useState } from "react";

const Card = ({
  title,
  children,
  className = "",
  severity = null,
  metric = null,
  interpretation = null,
  explanation = null,
  expandable = false,
}) => {
  const [open, setOpen] = useState(false);

  const severityColors = {
    info: "bg-primary",
    warning: "bg-warning",
    critical: "bg-danger",
    success: "bg-success",
  };

  return (
    <div className={`card border-0 shadow-sm h-100 rounded-3 ${className}`}>

      {severity && (
        <div
          className={severityColors[severity]}
          style={{ height: "4px", borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem" }}
        />
      )}

      <div className="card-body p-3 p-md-4 d-flex flex-column">

        {title && (
          <h6 className="fw-semibold mb-3 text-dark">
            {title}
          </h6>
        )}

        {metric && (
          <div
            className="fw-bold text-dark mb-2"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
          >
            {metric}
          </div>
        )}

        {interpretation && (
          <p className="text-muted small mb-3">
            {interpretation}
          </p>
        )}

        <div className="flex-grow-1">
          {children}
        </div>

        {expandable && explanation && (
          <div className="mt-3 pt-3 border-top">
            <button
              className="btn btn-sm btn-link p-0 text-decoration-none"
              onClick={() => setOpen(!open)}
            >
              {open ? "Hide explanation" : "Explain decision"}
            </button>

            {open && (
              <div className="mt-2 small text-muted bg-light rounded p-3">
                {explanation}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Card;