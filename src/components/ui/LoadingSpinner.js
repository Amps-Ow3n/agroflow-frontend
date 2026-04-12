import React from "react";

const LoadingSpinner = ({
  message = "Loading intelligence...",
  skeleton = false,
  size = "md",
}) => {
  const sizeMap = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  };

  if (skeleton) {
    return (
      <div className="p-3 p-md-4">
        <div className="placeholder-glow">
          <p className="placeholder col-4"></p>
          <p className="placeholder col-12"></p>
          <p className="placeholder col-8"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 text-muted text-center">

      <div
        className={`spinner-border text-success ${sizeMap[size]}`}
        role="status"
      />

      <div className="mt-3 small">
        {message}
      </div>

    </div>
  );
};

export default LoadingSpinner;