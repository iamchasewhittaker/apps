import React, { useState } from "react";
import { s, RESUME_TEMPLATE_PM, RESUME_TEMPLATE_AE } from "../constants";
import Field from "./Field";

export default function ProfileModal({ profile, baseResume, onSave, onClose }) {
  const [p, setP] = useState({ ...profile });
  const [resume, setResume] = useState(baseResume || RESUME_TEMPLATE_PM);
  const set = (k, v) => setP(x => ({ ...x, [k]: v }));
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>👤 Master Profile</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          <p style={{ color: "#6b7280", fontSize: 12 }}>This profile is the AI's foundation for every tailored resume, cover letter, and Apply Kit.</p>
          <div style={s.profileSectionLabel}>Personal Info</div>
          <div style={s.formRow}>
            <Field label="Full Name" value={p.name} onChange={v => set("name", v)} placeholder="Chase Whittaker" />
            <Field label="Email" value={p.email} onChange={v => set("email", v)} placeholder="chase@email.com" />
          </div>
          <div style={s.formRow}>
            <Field label="Phone" value={p.phone} onChange={v => set("phone", v)} placeholder="(555) 000-0000" />
            <Field label="Location" value={p.location} onChange={v => set("location", v)} placeholder="Vineyard, UT (Remote Only)" />
          </div>
          <Field label="LinkedIn URL" value={p.linkedin} onChange={v => set("linkedin", v)} placeholder="https://linkedin.com/in/..." />
          <div style={s.profileSectionLabel}>Job Search Targeting</div>
          <Field label="Target Roles" value={p.targetRoles} onChange={v => set("targetRoles", v)} placeholder="Implementation Specialist, Customer Success Manager" />
          <Field label="Target Industries" value={p.targetIndustries} onChange={v => set("targetIndustries", v)} placeholder="Fintech, Payments, SaaS, B2B" />
          <div style={s.formRow}>
            <Field label="Years of Experience" value={p.yearsExp} onChange={v => set("yearsExp", v)} placeholder="6" />
            <Field label="Salary Target" value={p.salaryTarget} onChange={v => set("salaryTarget", v)} placeholder="$75,000–$95,000" />
          </div>
          <Field label="Top 3–5 Career Achievements (AI uses these in cover letters)" type="textarea" rows={4} value={p.topAchievements} onChange={v => set("topAchievements", v)} placeholder={"• Guided 100s of merchants from application to live transactions at Authorize.Net\n• 98% integration issue resolution rate\n• Exceeded KPI targets 10–15% consistently\n• Built onboarding materials adopted by full team"} />
          <Field label="Additional context for AI (strengths, background, tone)" type="textarea" rows={3} value={p.notes} onChange={v => set("notes", v)} placeholder="Implementation and payments background. Strongest at merchant onboarding, inbound sales, CRM hygiene. Remote only. Targeting implementation/CS roles first, inbound AE second." />
          <div style={s.profileSectionLabel}>Base Resume</div>
          <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>AI tailors every document from this. Edit directly or load a fresh template below.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <button
              style={{ ...s.btnSecondary, fontSize: 12, padding: "5px 12px" }}
              onClick={() => { if (window.confirm("Load the Implementation/PM template? This will replace your current base resume.")) setResume(RESUME_TEMPLATE_PM); }}
            >
              📋 Load Implementation / PM Template
            </button>
            <button
              style={{ ...s.btnSecondary, fontSize: 12, padding: "5px 12px" }}
              onClick={() => { if (window.confirm("Load the Account Executive template? This will replace your current base resume.")) setResume(RESUME_TEMPLATE_AE); }}
            >
              💼 Load AE Template
            </button>
          </div>
          <textarea style={{ ...s.textarea, minHeight: 260, fontFamily: "monospace", fontSize: 11 }} value={resume} onChange={e => setResume(e.target.value)} />
        </div>
        <div style={s.modalFooter}>
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={() => onSave(p, resume)}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}
