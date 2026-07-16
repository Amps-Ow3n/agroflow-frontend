import React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
}) {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-medium">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />

      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}