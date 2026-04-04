import React, { useState } from "react";
import { s } from "../constants";
import Field from "./Field";

export default function ContactModal({ modal, apps, onSave, onClose }) {
  const [c, setC] = useState(modal.contact);
  const set = (k, v) => setC(x => ({ ...x, [k]: v }));
  const toggleApp = id => set("appIds", c.appIds?.includes(id) ? c.appIds.filter(x => x !== id) : [...(c.appIds || []), id]);
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>{modal.mode === "new" ? "New Contact" : c.name}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
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
