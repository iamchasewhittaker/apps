import React, { useState } from "react";
import { s, CONTACT_TYPES, OUTREACH_STATUSES, OUTREACH_EVENT_TYPES, OUTREACH_METHODS, blankOutreachEntry } from "../constants";
import Field from "./Field";

export default function ContactModal({ modal, apps, onSave, onClose }) {
  const [c, setC] = useState(modal.contact);
  const [draftEntry, setDraftEntry] = useState(() => blankOutreachEntry());
  const set = (k, v) => setC(x => ({ ...x, [k]: v }));
  const toggleApp = id => set("appIds", c.appIds?.includes(id) ? c.appIds.filter(x => x !== id) : [...(c.appIds || []), id]);

  const log = Array.isArray(c.outreachLog) ? c.outreachLog : [];
  const sortedLog = [...log].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  function addEntry() {
    if (!draftEntry.date || !draftEntry.type) return;
    set("outreachLog", [...log, { ...draftEntry }]);
    setDraftEntry(blankOutreachEntry());
  }
  function deleteEntry(id) {
    set("outreachLog", log.filter(e => e.id !== id));
  }
  function setDraft(k, v) {
    setDraftEntry(d => ({ ...d, [k]: v }));
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>{modal.mode === "new" ? "New Contact" : c.name}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          {/* Basic info */}
          <div style={s.formRow}>
            <Field label="Name" value={c.name} onChange={v => set("name", v)} placeholder="Jane Smith" />
            <Field label="Company" value={c.company} onChange={v => set("company", v)} placeholder="Stripe" />
          </div>
          <div style={s.formRow}>
            <Field label="Role / Title" value={c.role} onChange={v => set("role", v)} placeholder="Head of Implementation" />
            <Field label="Last Contact Date" type="date" value={c.lastContact} onChange={v => set("lastContact", v)} />
          </div>
          <Field label="Email" value={c.email} onChange={v => set("email", v)} placeholder="jane@company.com" />
          <Field label="LinkedIn URL" value={c.linkedin} onChange={v => set("linkedin", v)} placeholder="https://linkedin.com/in/..." />
          <Field label="How we connected / Notes" type="textarea" rows={3} value={c.notes} onChange={v => set("notes", v)} placeholder="Met via LinkedIn, referred by…" />

          {/* Contact type */}
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Contact Type</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CONTACT_TYPES.map(t => (
                <button key={t.value}
                  style={{ ...s.appToggleChip, ...((c.type || "other") === t.value ? { background: t.color + "22", borderColor: t.color, color: t.color } : {}) }}
                  onClick={() => set("type", t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outreach status */}
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Outreach Status</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {OUTREACH_STATUSES.map(st => (
                <button key={st.value}
                  style={{ ...s.appToggleChip, ...((c.outreachStatus || "none") === st.value ? { background: st.color + "22", borderColor: st.color, color: st.color } : {}) }}
                  onClick={() => set("outreachStatus", st.value)}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outreach date + source */}
          <div style={s.formRow}>
            <Field label="Outreach Date" type="date" value={c.outreachDate} onChange={v => set("outreachDate", v)} />
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Source</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { value: "sales_navigator", label: "Sales Nav" },
                  { value: "linkedin", label: "LinkedIn" },
                  { value: "chrome_extension", label: "Chrome ext" },
                  { value: "referral", label: "Referral" },
                  { value: "other", label: "Other" },
                ].map(src => (
                  <button key={src.value}
                    style={{ ...s.appToggleChip, ...((c.source || "linkedin") === src.value ? s.appToggleChipActive : {}) }}
                    onClick={() => set("source", src.value)}>
                    {src.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Company intel */}
          <div style={s.profileSectionLabel}>Company Intel</div>
          <div style={s.formRow}>
            <Field label="Company Size" value={c.companySize} onChange={v => set("companySize", v)} placeholder="e.g. 500–1,000" />
            <Field label="Industry" value={c.industry} onChange={v => set("industry", v)} placeholder="e.g. Fintech, Payments" />
          </div>
          <div style={s.fieldGroup}>
            <label style={{ ...s.fieldLabel, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!c.isHiring} onChange={e => set("isHiring", e.target.checked)} />
              Company is currently hiring
            </label>
          </div>

          {/* Outreach log — Wave 4 #3 */}
          <div style={s.profileSectionLabel}>Outreach Log</div>
          <div style={{ background: "#0f1117", border: "1px solid #1f2937", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <Field label="Date" type="date" value={draftEntry.date} onChange={v => setDraft("date", v)} />
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Type</label>
                <select
                  style={s.stageSelect}
                  value={draftEntry.type}
                  onChange={e => setDraft("type", e.target.value)}
                >
                  {OUTREACH_EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Method</label>
                <select
                  style={s.stageSelect}
                  value={draftEntry.method}
                  onChange={e => setDraft("method", e.target.value)}
                >
                  {OUTREACH_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <Field label="Notes (optional)" type="textarea" rows={2} value={draftEntry.notes} onChange={v => setDraft("notes", v)} placeholder="What did you say / what did they say?" />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button style={s.btnPrimary} onClick={addEntry}>+ Add entry</button>
            </div>

            {sortedLog.length > 0 && (
              <div style={{ marginTop: 12, borderTop: "1px solid #1f2937", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {sortedLog.map(entry => {
                  const typeInfo = OUTREACH_EVENT_TYPES.find(t => t.value === entry.type) || OUTREACH_EVENT_TYPES[OUTREACH_EVENT_TYPES.length - 1];
                  const methodLabel = (OUTREACH_METHODS.find(m => m.value === entry.method) || {}).label || "";
                  return (
                    <div key={entry.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: typeInfo.color, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "baseline", flexWrap: "wrap" }}>
                          <span style={{ color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{entry.date}</span>
                          <span style={{ color: typeInfo.color, fontWeight: 600 }}>{typeInfo.label}</span>
                          {methodLabel && <span style={{ color: "#6b7280" }}>· {methodLabel}</span>}
                        </div>
                        {entry.notes && <div style={{ color: "#d1d5db", marginTop: 1, lineHeight: 1.4, wordBreak: "break-word" }}>{entry.notes}</div>}
                      </div>
                      <button style={s.actionBtnDanger} onClick={() => deleteEntry(entry.id)} aria-label="Delete entry">🗑</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link to applications */}
          {apps.length > 0 && (
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Link to Application(s)</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {apps.map(a => (
                  <button key={a.id}
                    style={{ ...s.appToggleChip, ...(c.appIds?.includes(a.id) ? s.appToggleChipActive : {}) }}
                    onClick={() => toggleApp(a.id)}>
                    {a.company} — {a.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={s.modalFooter}>
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={() => onSave(c)}>Save</button>
        </div>
      </div>
    </div>
  );
}
