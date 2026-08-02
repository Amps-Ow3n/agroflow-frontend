import React from "react";

export default function Loader({
  text = "Loading..."
}) {
  return (
    <div className="text-center py-5">

      <div
        className="spinner-border text-primary"
        role="status"
      >
        <span className="visually-hidden">
          Loading
        </span>
      </div>

      <div className="mt-3 text-muted">
        {text}
      </div>

    </div>
  );
}