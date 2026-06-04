import React from "react";

const Modal = ({
  title,
  children,
  show = false,
  onClose,
  size = "md",
}) => {
  if (!show) return null;

  const sizeMap = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className={`modal-dialog modal-dialog-centered ${sizeMap[size]}`}>

        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Modal;