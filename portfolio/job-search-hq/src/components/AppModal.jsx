import React, { useState } from "react";
import { s, STAGES } from "../constants";
import Field from "./Field";

export default function AppModal({ modal, contacts, onSave, onDelete, onClose }) {
  const isNew = modal.mode === "new";
  const [app, setApp] = useState(modal.app);
  const set = (k, v) => setApp(a => ({ ...a, [k]: v }));
  const linked = contacts.filter(c => c.appIds?.includes(app.id));
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>{isNew ? "New Application" : `${app.company} — ${app.title}`}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          <div style={s.formRow}>
            <Field label="Company" value={app.company} onChange={v => set("company", v)} placeholder="Stripe" />
            <Field label="Role" value={app.title} onChange={v => set("title", v)} placeholder="Implementation Specialist" />
          </div>
          <div style={s.formRow}>
            <Field label="Stage" type="select" options={STAGES} value={app.stage} onChange={v => set("stage", v)} />
            <Field label="Applied Date" type="date" value={app.appliedDate} onChange={v => set("appliedDate", v)} />
          </div>
          <Field label="Job URL" value={app.url} onChange={v => set("url", v)} placeholder="https://..." />
          <Field label="Next Step / Follow-up" value={app.nextStep} onChange={v => set("nextStep", v)} placeholder="Send thank you, follow up in 7 days…" />
          <Field label="Job Description (enables AI tailoring + Apply Kit)" type="textarea" rows={5} value={app.jobDescription} onChange={v => set("jobDescription", v)} placeholder="Paste job description here…" />
          <Field label="Notes" type="textarea" rows={3} value={app.notes} onChange={v => set("notes", v)} placeholder="Comp range, culture, who referred you…" />
          {linked.length > 0 && (
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Contacts at this company</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {linked.map(c => <span key={c.id} style={s.contactChip}>{c.name} · {c.role}</span>)}
              </div>
            </div>
          )}
        </div>
        <div style={s.modalFooter}>
          {!isNew && <button style={s.btnDanger} onClick={() => { if (window.confirm("Delete?")) onDelete(app.id); }}>Delete</button>}
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={() => onSave(app)}>Save</button>
        </div>
      </div>
    </div>
  );
}
