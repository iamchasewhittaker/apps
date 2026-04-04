import React from "react";
import { s } from "../constants";

export default function AIResult({ label, text }) {
  return (
    <div style={s.resultBox}>
      <div style={s.resultHeader}>
        <span>{label}</span>
        <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
      </div>
      <pre style={s.resultText}>{text}</pre>
    </div>
  );
}
