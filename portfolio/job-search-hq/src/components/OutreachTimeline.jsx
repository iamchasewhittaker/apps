import React, { useState } from "react";
import { OUTREACH_EVENT_TYPES, OUTREACH_METHODS } from "../constants";

const DEFAULT_VISIBLE = 4;

function typeInfo(type) {
  return OUTREACH_EVENT_TYPES.find(t => t.value === type) || OUTREACH_EVENT_TYPES[OUTREACH_EVENT_TYPES.length - 1];
}

function methodLabel(method) {
  return (OUTREACH_METHODS.find(m => m.value === method) || {}).label || method || "";
}

const wrap = { marginTop: 8, padding: "8px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 8 };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 };
const headerLabel = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A0AABF", fontWeight: 600 };
const toggleBtn = { background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 11, padding: 0, fontFamily: "inherit" };
const row = { display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0" };
const dot = (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 6, flexShrink: 0 });
const body = { flex: 1, minWidth: 0 };
const topLine = { display: "flex", gap: 6, alignItems: "baseline", flexWrap: "wrap" };
const date = { fontSize: 11, color: "#A0AABF", fontVariantNumeric: "tabular-nums" };
const typeText = (color) => ({ fontSize: 12, color, fontWeight: 600 });
const method = { fontSize: 11, color: "#A0AABF" };
const notes = { fontSize: 12, color: "#FFFFFF", marginTop: 1, lineHeight: 1.4, wordBreak: "break-word" };
const empty = { fontSize: 12, color: "#A0AABF", fontStyle: "italic" };

export default function OutreachTimeline({ log = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!Array.isArray(log) || log.length === 0) {
    return (
      <div style={wrap}>
        <div style={headerLabel}>Outreach timeline</div>
        <div style={{ ...empty, marginTop: 4 }}>No touchpoints yet</div>
      </div>
    );
  }

  // Newest first
  const sorted = [...log].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const visible = expanded ? sorted : sorted.slice(0, DEFAULT_VISIBLE);
  const hidden = sorted.length - visible.length;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={headerLabel}>Outreach timeline · {sorted.length}</div>
        {sorted.length > DEFAULT_VISIBLE && (
          <button style={toggleBtn} onClick={() => setExpanded(e => !e)}>
            {expanded ? "Show recent" : `Show all (${sorted.length})`}
          </button>
        )}
      </div>
      <div>
        {visible.map(entry => {
          const info = typeInfo(entry.type);
          return (
            <div key={entry.id} style={row}>
              <span style={dot(info.color)} />
              <div style={body}>
                <div style={topLine}>
                  <span style={date}>{entry.date}</span>
                  <span style={typeText(info.color)}>{info.label}</span>
                  {entry.method && <span style={method}>· {methodLabel(entry.method)}</span>}
                </div>
                {entry.notes && <div style={notes}>{entry.notes}</div>}
              </div>
            </div>
          );
        })}
        {!expanded && hidden > 0 && (
          <div style={{ ...empty, marginTop: 4 }}>+{hidden} older</div>
        )}
      </div>
    </div>
  );
}
