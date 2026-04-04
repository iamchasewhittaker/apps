import React from "react";
import { T } from "./theme";

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: "20px 22px", marginBottom: 14, ...style
    }}>{children}</div>
  );
}

export function SectionLabel({ children, color = T.muted, num }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14 }}>
      {num !== undefined && (
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
          background: T.faint, border: "1.5px solid " + T.border,
          fontSize: 11, fontWeight: 700, color: T.muted,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 1,
        }}>{num}</span>
      )}
      <div style={{
        fontSize: 16, fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color, flex: 1,
      }}>{children}</div>
    </div>
  );
}

export function ChoiceButton({ label, emoji, selected, onClick, color = T.accent }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      width: "100%", textAlign: "left",
      padding: "10px 14px", borderRadius: 8, marginBottom: 6,
      border: `1.5px solid ${selected ? color : T.border}`,
      background: selected ? color + "15" : T.surface,
      color: selected ? color : T.text,
      fontSize: 16, cursor: "pointer", fontFamily: "inherit",
      transition: "all 0.15s",
    }}>
      {emoji && <span style={{ fontSize: 15 }}>{emoji}</span>}
      <span>{label}</span>
      {selected && <span style={{ marginLeft: "auto", fontSize: 20, color }}>✓</span>}
    </button>
  );
}

export function MultiChip({ label, selected, onClick, color = T.accent }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 12px", borderRadius: 20, margin: "3px 4px 3px 0",
      border: `1.5px solid ${selected ? color : T.border}`,
      background: selected ? color + "15" : T.surface,
      color: selected ? color : T.muted,
      fontSize: 20, fontWeight: selected ? 600 : 400,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
    }}>{label}</button>
  );
}

export function Rating({ value, onChange, color = T.accent }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button key={n} onClick={() => onChange(n)} style={{
          width: 30, height: 30, borderRadius: 6,
          border: `1.5px solid ${value >= n ? color : T.border}`,
          background: value >= n ? color : T.surface,
          color: value >= n ? "#fff" : T.muted,
          fontSize: 20, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.1s",
        }}>{n}</button>
      ))}
    </div>
  );
}

export function TriToggle({ value, onChange }) {
  const opts = [
    { v: "yes", label: "Yes", color: T.red },
    { v: "mild", label: "Mild", color: T.yellow },
    { v: "no", label: "No", color: T.accent },
  ];
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {opts.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          padding: "7px 13px", borderRadius: 20,
          border: `1.5px solid ${value === o.v ? o.color : T.border}`,
          background: value === o.v ? o.color + "18" : T.surface,
          color: value === o.v ? o.color : T.muted,
          fontSize: 20, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}


export function MedBadge({ meds }) {
  const medColors = {
    "Sertraline": T.blue,
    "Adderall": T.warn,
    "Wellbutrin": T.accent,
    "Buspar": "#7B5EA7",
    "Trazodone": T.yellow,
  };
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
      {meds.map(m => (
        <span key={m} style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
          background: (medColors[m] || T.muted) + "18",
          color: medColors[m] || T.muted,
          border: "1px solid " + (medColors[m] || T.muted) + "44",
          letterSpacing: "0.05em",
        }}>{m}</span>
      ))}
    </div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "16px 0" }} />;
}

export function ProgressBar({ value, max, color = T.accent }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = pct > 90 ? T.red : pct > 70 ? T.yellow : color;
  return (
    <div style={{ height: 8, background: T.faint, borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: barColor, borderRadius: 4,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}
