import { useState } from "react";

export default function PasswordInput({ id, value, onChange, required = true, className = "form-control" }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-group">
      <input id={id} className={className} type={visible ? "text" : "password"} value={value} onChange={onChange} required={required} />
      <button type="button" className="btn btn-outline-secondary" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"}>
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
