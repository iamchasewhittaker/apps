import React from "react";
import { s, CONTACT_TYPES, OUTREACH_STATUSES } from "../constants";

export default function ContactCard({ contact, apps, onEdit, onDelete, onStatusChange, onDraftMessage }) {
  const linked = apps.filter(a => contact.appIds?.includes(a.id));
  const typeInfo = CONTACT_TYPES.find(t => t.value === (contact.type || "other")) || CONTACT_TYPES[3];
  const statusInfo = OUTREACH_STATUSES.find(st => st.value === (contact.outreachStatus || "none")) || OUTREACH_STATUSES[0];
  const hasIntel = contact.companySize || contact.industry || contact.isHiring;

  return (
    <div style={s.contactCard} className="card-hover">
      <div style={s.contactCardTop}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={s.cardCompany}>{contact.name}</div>
            <span style={{ ...s.contactTypeBadge, background: typeInfo.color + "22", color: typeInfo.color }}>
              {typeInfo.label}
            </span>
          </div>
          <div style={s.cardTitle}>{contact.role}{contact.company ? ` · ${contact.company}` : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <span style={{ ...s.outreachBadge, background: statusInfo.color + "22", color: statusInfo.color }}>
            {statusInfo.label}
          </span>
          <button style={s.actionBtn} onClick={onEdit}>Edit</button>
          <button style={s.actionBtnDanger} onClick={onDelete}>✕</button>
        </div>
      </div>

      {hasIntel && (
        <div style={s.companyIntel}>
          {contact.industry && <span>🏢 {contact.industry}</span>}
          {contact.companySize && <span>👥 {contact.companySize}</span>}
          {contact.isHiring && <span style={{ color: "#10b981" }}>✅ Hiring</span>}
        </div>
      )}

      {contact.linkedin && <div style={s.cardMeta}><a href={contact.linkedin} target="_blank" rel="noreferrer" style={s.link}>LinkedIn ↗</a></div>}
      {contact.email && <div style={s.cardMeta}>✉️ {contact.email}</div>}
      {contact.lastContact && <div style={s.cardMeta}>Last contact: {contact.lastContact}</div>}
      {contact.outreachDate && <div style={s.cardMeta}>Outreach sent: {contact.outreachDate}</div>}
      {contact.notes && <div style={s.contactNotes}>{contact.notes}</div>}
      {linked.length > 0 && (
        <div style={s.cardContacts}>{linked.map(a => <span key={a.id} style={s.appChip}>{a.company} — {a.title}</span>)}</div>
      )}

      <div style={s.quickActions}>
        <select
          style={{ ...s.stageSelect, flex: 1 }}
          value={contact.outreachStatus || "none"}
          onChange={e => onStatusChange(e.target.value)}
        >
          {OUTREACH_STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
        </select>
        <button style={s.quickActionDraft} onClick={onDraftMessage}>✍️ Draft Message</button>
      </div>
    </div>
  );
}
