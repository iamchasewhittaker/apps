import React from "react";
import { s } from "../constants";

export default function ContactCard({ contact, apps, onEdit, onDelete }) {
  const linked = apps.filter(a => contact.appIds?.includes(a.id));
  return (
    <div style={s.contactCard} className="card-hover">
      <div style={s.contactCardTop}>
        <div>
          <div style={s.cardCompany}>{contact.name}</div>
          <div style={s.cardTitle}>{contact.role}{contact.company ? ` · ${contact.company}` : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={s.actionBtn} onClick={onEdit}>Edit</button>
          <button style={s.actionBtnDanger} onClick={onDelete}>✕</button>
        </div>
      </div>
      {contact.linkedin && <div style={s.cardMeta}><a href={contact.linkedin} target="_blank" rel="noreferrer" style={s.link}>LinkedIn ↗</a></div>}
      {contact.email && <div style={s.cardMeta}>✉️ {contact.email}</div>}
      {contact.lastContact && <div style={s.cardMeta}>Last contact: {contact.lastContact}</div>}
      {contact.notes && <div style={s.contactNotes}>{contact.notes}</div>}
      {linked.length > 0 && (
        <div style={s.cardContacts}>{linked.map(a => <span key={a.id} style={s.appChip}>{a.company} — {a.title}</span>)}</div>
      )}
    </div>
  );
}
