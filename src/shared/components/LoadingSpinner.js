import React from "react";

const LoadingSpinner = ({
  message = "Loading...",
  variant = "primary",
  size = "md",
  fullScreen = false,
  skeleton = false,
}) => {
  const sizeMap = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  };

  const containerClass = fullScreen
    ? "d-flex align-items-center justify-content-center vh-100"
    : "d-flex flex-column align-items-center justify-content-center p-4 text-muted text-center";

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
    <div className={containerClass}>
      <div className={`spinner-border text-${variant} ${sizeMap[size]}`} role="status" />
      {message && <div className="mt-3 small">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;