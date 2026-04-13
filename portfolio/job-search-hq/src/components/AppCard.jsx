import React from "react";
import { s, STAGES, STAGE_COLORS, nextStepUrgency } from "../constants";

export default function AppCard({ app, contacts, onEdit, onStageChange, onApplyKit, onPrep, archived }) {
  const linked = contacts.filter(c => c.appIds?.includes(app.id));
  const showPrep = ["Phone Screen", "Interview", "Final Round"].includes(app.stage);
  return (
    <div style={{ ...s.card, opacity: archived ? 0.7 : 1 }} className="card-hover">
      <div style={s.cardTop}>
        <div>
          <div style={s.cardCompany}>{app.company || <span style={{ color: "#4b5563" }}>Untitled</span>}</div>
          <div style={s.cardTitle}>{app.title}</div>
        </div>
        <div style={{ ...s.stageBadge, background: STAGE_COLORS[app.stage] + "22", color: STAGE_COLORS[app.stage] }}>
          <div style={{ ...s.stageDot, background: STAGE_COLORS[app.stage] }} />{app.stage}
        </div>
      </div>
      {app.appliedDate && <div style={s.cardMeta}>Applied {app.appliedDate}</div>}
      {app.nextStep && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={s.cardNextStep}>→ {app.nextStep}</div>
          {(() => { const u = nextStepUrgency(app.nextStepDate); return u ? <span style={{ ...s.urgencyBadge, background: u.bg, color: u.color }}>{u.label}</span> : null; })()}
        </div>
      )}
      {linked.length > 0 && (
        <div style={s.cardContacts}>{linked.map(c => <span key={c.id} style={s.contactChip}>{c.name}</span>)}</div>
      )}
      {app.prepNotes && (
        <div style={{ fontSize: 11, color: "#10b981", marginTop: 2 }}>✓ Interview prep saved</div>
      )}
      <div style={s.cardActions}>
        <select style={s.stageSelect} value={app.stage} onChange={e => onStageChange(e.target.value)}>
          {STAGES.map(st => <option key={st}>{st}</option>)}
        </select>
        <button style={s.actionBtn} onClick={onEdit}>Edit</button>
        {app.jobDescription && (
          <button style={s.actionBtnKit} onClick={onApplyKit}>🚀 Kit</button>
        )}
        {showPrep && (
          <button style={s.actionBtnPrep} onClick={onPrep}>🎯 Prep</button>
        )}
      </div>
    </div>
  );
}
