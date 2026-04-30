import React, { useState } from "react";
import {
  s,
  RESUME_TEMPLATE_IC,
  RESUME_TEMPLATE_PM,
  RESUME_TEMPLATE_AE,
  DIRECTION,
  STRENGTHS_SUMMARY,
  FRIEND_FEEDBACK,
  FRIEND_FEEDBACK_CONSENSUS,
} from "../constants";
import { T } from "../tokens";
import Field from "./Field";

export default function ProfileModal({ profile, baseResume, onSave, onClose }) {
  const [p, setP] = useState({ ...profile });
  const [resume, setResume] = useState(baseResume || RESUME_TEMPLATE_IC);
  const [openPanel, setOpenPanel] = useState(null); // 'direction' | 'strengths' | 'friends'
  const togglePanel = key => setOpenPanel(cur => (cur === key ? null : key));
  const set = (k, v) => setP(x => ({ ...x, [k]: v }));

  const panelHeader = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
    padding: "10px 14px", cursor: "pointer", fontSize: 14, fontWeight: 600,
    color: T.foreground,
  };
  const panelBody = {
    background: T.cardSubtle, border: `1px solid ${T.border}`, borderTop: "none",
    borderRadius: "0 0 10px 10px", padding: "12px 14px", fontSize: 14,
    color: T.muted, lineHeight: 1.5,
  };
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>👤 Master Profile</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          <p style={{ color: T.muted, fontSize: 12 }}>This profile is the AI's foundation for every tailored resume, cover letter, and Apply Kit.</p>
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
          <Field label="Target Roles" value={p.targetRoles} onChange={v => set("targetRoles", v)} placeholder="Implementation Consultant, Sales Engineer, Solutions Consultant" />
          <Field label="Target Industries" value={p.targetIndustries} onChange={v => set("targetIndustries", v)} placeholder="Payments, Fintech, Dev Tools, B2B SaaS" />
          <div style={s.formRow}>
            <Field label="Years of Experience" value={p.yearsExp} onChange={v => set("yearsExp", v)} placeholder="6" />
            <Field label="Salary Target" value={p.salaryTarget} onChange={v => set("salaryTarget", v)} placeholder="$75,000–$95,000" />
          </div>
          <Field label="Top 3–5 Career Achievements (AI uses these in cover letters)" type="textarea" rows={4} value={p.topAchievements} onChange={v => set("topAchievements", v)} placeholder={"• Guided 100s of merchants from application to live transactions at Authorize.Net\n• 98% integration issue resolution rate\n• Exceeded KPI targets 10–15% consistently\n• Built onboarding materials adopted by full team"} />
          <Field label="Additional context for AI (strengths, background, tone)" type="textarea" rows={3} value={p.notes} onChange={v => set("notes", v)} placeholder="Implementation and payments background. Strongest at merchant onboarding, integration troubleshooting, SOPs. Remote only. Targeting Implementation Consultant / Sales Engineer OR Account Executive at payments-adjacent companies (equal lanes)." />
          <div style={s.profileSectionLabel}>Base Resume</div>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>AI tailors every document from this. Edit directly or load a fresh template below.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <button
              style={{ ...s.btnSecondary, fontSize: 12, padding: "5px 12px" }}
              onClick={() => { if (window.confirm("Load the Implementation Consultant / SE template? This will replace your current base resume.")) setResume(RESUME_TEMPLATE_IC); }}
            >
              🧭 Load IC / SE Template
            </button>
            <button
              style={{ ...s.btnSecondary, fontSize: 12, padding: "5px 12px" }}
              onClick={() => { if (window.confirm("Load the Account Executive template? This will replace your current base resume.")) setResume(RESUME_TEMPLATE_AE); }}
            >
              💼 Load AE Template
            </button>
            <button
              style={{ ...s.btnSecondary, fontSize: 12, padding: "5px 12px" }}
              onClick={() => { if (window.confirm("Load the legacy Implementation/PM template? This will replace your current base resume.")) setResume(RESUME_TEMPLATE_PM); }}
            >
              📋 Load PM Template (legacy)
            </button>
          </div>
          <textarea style={{ ...s.textarea, minHeight: 260, fontFamily: "monospace", fontSize: 11 }} value={resume} onChange={e => setResume(e.target.value)} />

          <div style={s.profileSectionLabel}>Direction, Strengths & Feedback</div>
          <p style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>
            Read-only reference. Source of truth: <code style={{ color: T.muted }}>chase/identity/</code>.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Direction panel */}
            <div>
              <div style={panelHeader} onClick={() => togglePanel("direction")}>
                <span>🧭 Direction — Implementation Consultant / SE (payments-adjacent)</span>
                <span style={{ color: T.muted }}>{openPanel === "direction" ? "−" : "+"}</span>
              </div>
              {openPanel === "direction" && (
                <div style={panelBody}>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: T.foreground }}>Primary role:</strong> {DIRECTION.primaryRole}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: T.foreground }}>Primary companies:</strong>{" "}
                    {DIRECTION.primaryCompanies.slice(0, 8).join(", ")}
                    {DIRECTION.primaryCompanies.length > 8 && ` + ${DIRECTION.primaryCompanies.length - 8} more`}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: T.foreground }}>Secondary (dev-tools):</strong>{" "}
                    {DIRECTION.secondaryCompanies.slice(0, 6).join(", ")}
                    {DIRECTION.secondaryCompanies.length > 6 && ` + ${DIRECTION.secondaryCompanies.length - 6} more`}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: T.foreground }}>Backup path:</strong> {DIRECTION.backupRole}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    Committed {DIRECTION.committedDate} · Review week 4: {DIRECTION.reassessWeek4} · Review week 10: {DIRECTION.reassessWeek10}
                  </div>
                </div>
              )}
            </div>

            {/* Strengths panel */}
            <div>
              <div style={panelHeader} onClick={() => togglePanel("strengths")}>
                <span>💪 Strengths — CliftonStrengths Top 5</span>
                <span style={{ color: T.muted }}>{openPanel === "strengths" ? "−" : "+"}</span>
              </div>
              {openPanel === "strengths" && (
                <div style={panelBody}>
                  {STRENGTHS_SUMMARY.map(theme => (
                    <div key={theme.name} style={{ marginBottom: 10 }}>
                      <div style={{ color: T.foreground, fontWeight: 600, marginBottom: 2 }}>
                        {theme.name}{" "}
                        <span style={{ fontWeight: 400, color: T.muted, fontSize: 11 }}>
                          — {theme.descriptors.join(" · ")}
                        </span>
                      </div>
                      <div style={{ color: T.muted, marginBottom: 3 }}>{theme.workExample}</div>
                      <div style={{ color: T.muted, fontSize: 11, fontStyle: "italic" }}>
                        Leverage: {theme.jobSearchLeverage}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friend feedback panel */}
            <div>
              <div style={panelHeader} onClick={() => togglePanel("friends")}>
                <span>👥 Friend Feedback — consensus & quotes</span>
                <span style={{ color: T.muted }}>{openPanel === "friends" ? "−" : "+"}</span>
              </div>
              {openPanel === "friends" && (
                <div style={panelBody}>
                  <div style={{ color: T.foreground, marginBottom: 10 }}>
                    <strong style={{ color: T.foreground }}>Consensus:</strong>{" "}
                    {FRIEND_FEEDBACK_CONSENSUS.join(" · ")}
                  </div>
                  {FRIEND_FEEDBACK.map(f => (
                    <div key={f.name} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ color: T.foreground, fontWeight: 600 }}>
                        {f.name}{" "}
                        <span style={{ fontWeight: 400, color: T.muted, fontSize: 11 }}>— {f.relation}</span>
                      </div>
                      <div style={{ color: T.muted, marginTop: 3, fontStyle: "italic" }}>
                        "{f.quotes[0]}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
