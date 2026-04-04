import React from "react";
import { s } from "../constants";

export default function Field({ label, value, onChange, type = "text", options = [], placeholder = "", rows = 3 }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.fieldLabel}>{label}</label>
      {type === "textarea"
        ? <textarea style={s.input} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
        : type === "select"
          ? <select style={s.input} value={value || ""} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>
          : <input type={type} style={s.input} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}
