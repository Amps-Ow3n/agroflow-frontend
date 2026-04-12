import React from "react";
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSkullCrossbones
} from "react-icons/fa";

const AlertBox = ({ type = "info", message, title = null }) => {
  const styles = {
    info: {
      box: "alert alert-primary border-0 shadow-sm",
      icon: <FaInfoCircle className="text-primary" />
    },
    warning: {
      box: "alert alert-warning border-0 shadow-sm",
      icon: <FaExclamationTriangle className="text-warning" />
    },
    critical: {
      box: "alert alert-danger border-0 shadow-sm",
      icon: <FaSkullCrossbones className="text-danger" />
    },
    success: {
      box: "alert alert-success border-0 shadow-sm",
      icon: <FaCheckCircle className="text-success" />
    },
    error: {
      box: "alert alert-danger border-0 shadow-sm",
      icon: <FaSkullCrossbones className="text-danger" />
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`${style.box} d-flex gap-3 align-items-start rounded-3 p-3 p-md-4`}>
      
      <div className="fs-5 mt-1 flex-shrink-0">
        {style.icon}
      </div>

      <div className="flex-grow-1">
        {title && (
          <div className="fw-semibold mb-1">
            {title}
          </div>
        )}

        <div className="small" style={{ lineHeight: "1.5" }}>
          {message}
        </div>
      </div>

    </div>
  );
};

export default AlertBox;