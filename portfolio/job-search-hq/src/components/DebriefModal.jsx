import React, { useState } from "react";
import {
  s,
  DEBRIEF_ROUND_TYPES, DEBRIEF_IMPRESSIONS,
  blankDebriefEntry, normalizeInterviewLog,
} from "../constants";

function EntryForm({ entry, onChange, onSave, onCancel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <div style={s.fieldLabel}>Date</div>
          <input style={s.input} type="date" value={entry.date} onChange={e => onChange("date", e.target.value)} />
        </div>
        <div style={{ flex: "2 1 200px" }}>
          <div style={s.fieldLabel}>Interviewer name(s)</div>
          <input style={s.input} value={entry.interviewerName} onChange={e => onChange("interviewerName", e.target.value)} placeholder="e.g. Sarah (Hiring Manager)" />
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <div style={s.fieldLabel}>Round type</div>
          <select style={s.input} value={entry.roundType} onChange={e => onChange("roundType", e.target.value)}>
            {DEBRIEF_ROUND_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 160px" }}>
          <div style={s.fieldLabel}>Impression</div>
          <div style={{ display: "flex", gap: 6 }}>
            {DEBRIEF_IMPRESSIONS.map(imp => (
              <button
                key={imp.value}
                onClick={() => onChange("impression", imp.value)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  background: entry.impression === imp.value ? imp.color + "33" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${entry.impression === imp.value ? imp.color : "rgba(59,130,246,0.12)"}`,
                  color: entry.impression === imp.value ? imp.color : "#A0AABF",
                }}
              >{imp.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={s.fieldLabel}>Confidence 1–5</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => onChange("confidence", n)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  background: entry.confidence >= n ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${entry.confidence >= n ? "#3b82f6" : "rgba(59,130,246,0.12)"}`,
                  color: entry.confidence >= n ? "#3b82f6" : "#A0AABF",
                }}
              >{n}</button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={s.fieldLabel}>What went well / strengths</div>
        <textarea style={{ ...s.textarea, minHeight: 60 }} value={entry.strengths} onChange={e => onChange("strengths", e.target.value)} placeholder="Moments where you felt confident, good rapport, strong answers…" />
      </div>
      <div>
        <div style={s.fieldLabel}>Gaps / areas to improve</div>
        <textarea style={{ ...s.textarea, minHeight: 60 }} value={entry.gaps} onChange={e => onChange("gaps", e.target.value)} placeholder="Questions that stumped you, topics to prep more…" />
      </div>
      <div>
        <div style={s.fieldLabel}>Key questions asked</div>
        <textarea style={{ ...s.textarea, minHeight: 50 }} value={entry.keyQuestions} onChange={e => onChange("keyQuestions", e.target.value)} placeholder="Notable or unexpected questions…" />
      </div>
      <div>
        <div style={s.fieldLabel}>Red flags / concerns</div>
        <textarea style={{ ...s.textarea, minHeight: 50 }} value={entry.redFlags} onChange={e => onChange("redFlags", e.target.value)} placeholder="Anything that felt off — culture, role scope, team…" />
      </div>
      <div>
        <div style={s.fieldLabel}>Notes</div>
        <textarea style={{ ...s.textarea, minHeight: 50 }} value={entry.notes} onChange={e => onChange("notes", e.target.value)} placeholder="Anything else…" />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button style={s.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={s.btnPrimary} onClick={onSave}>Save debrief</button>
      </div>
    </div>
  );
}

const IMPRESSION_COLOR = Object.fromEntries(DEBRIEF_IMPRESSIONS.map(i => [i.value, i.color]));
const ROUND_LABEL = Object.fromEntries(DEBRIEF_ROUND_TYPES.map(r => [r.value, r.label]));

export default function DebriefModal({ app, onSave, onClose }) {
  const [log, setLog] = useState(normalizeInterviewLog(app.interviewLog));
  const [editing, setEditing] = useState(null); // null | entry object
  const [isNew, setIsNew] = useState(false);

  function startNew() {
    setEditing(blankDebriefEntry());
    setIsNew(true);
  }

  function startEdit(entry) {
    setEditing({ ...entry });
    setIsNew(false);
  }

  function handleChange(field, value) {
    setEditing(prev => ({ ...prev, [field]: value }));
  }

  function saveEntry() {
    if (!editing) return;
    const next = isNew
      ? [editing, ...log]
      : log.map(e => e.id === editing.id ? editing : e);
    setLog(next);
    onSave({ ...app, interviewLog: next });
    setEditing(null);
  }

  function deleteEntry(id) {
    const next = log.filter(e => e.id !== id);
    setLog(next);
    onSave({ ...app, interviewLog: next });
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <span>📋 Interview Debrief</span>
            <div style={{ fontSize: 14, color: "#A0AABF", fontWeight: 400, marginTop: 2 }}>
              {app.company} — {app.title} · {app.stage}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          {editing ? (
            <EntryForm
              entry={editing}
              onChange={handleChange}
              onSave={saveEntry}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <>
              <button style={{ ...s.btnPrimary, marginBottom: 16 }} onClick={startNew}>
                + Add debrief entry
              </button>

              {log.length === 0 && (
                <div style={{ color: "#A0AABF", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                  No debrief entries yet. Add one after each interview round.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {log.map(entry => {
                  const impColor = IMPRESSION_COLOR[entry.impression] || "#A0AABF";
                  return (
                    <div key={entry.id} style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(59,130,246,0.12)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                              {ROUND_LABEL[entry.roundType] || entry.roundType}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: impColor, background: impColor + "22", padding: "2px 8px", borderRadius: 99 }}>
                              {entry.impression}
                            </span>
                            <span style={{ fontSize: 14, color: "#A0AABF" }}>
                              Confidence: {entry.confidence}/5
                            </span>
                          </div>
                          <div style={{ fontSize: 14, color: "#A0AABF", marginTop: 2 }}>
                            {entry.date}{entry.interviewerName ? ` · ${entry.interviewerName}` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={s.btnSecondary} onClick={() => startEdit(entry)}>Edit</button>
                          <button style={{ ...s.btnSecondary, color: "#F87171", borderColor: "rgba(248,113,113,0.08)" }} onClick={() => deleteEntry(entry.id)}>✕</button>
                        </div>
                      </div>
                      {entry.strengths && <div style={{ fontSize: 14, color: "#A0AABF", marginTop: 4 }}><strong style={{ color: "#34D399" }}>✓ </strong>{entry.strengths}</div>}
                      {entry.gaps && <div style={{ fontSize: 14, color: "#A0AABF", marginTop: 2 }}><strong style={{ color: "#FBBF24" }}>△ </strong>{entry.gaps}</div>}
                      {entry.redFlags && <div style={{ fontSize: 14, color: "#F87171", marginTop: 2 }}>⚑ {entry.redFlags}</div>}
                      {entry.notes && <div style={{ fontSize: 14, color: "#A0AABF", marginTop: 2 }}>{entry.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
