import React from "react";
import { s } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import ContactCard from "../components/ContactCard";

export default function ContactsTab({ contacts, applications, setContactModal, deleteContact }) {
  return (
    <ErrorBoundary name="Contacts">
      <div style={s.content}>
        {contacts.length === 0 && <div style={s.empty}>No contacts yet. Add someone you've spoken with!</div>}
        <div style={s.contactList}>
          {contacts.map(c => (
            <ContactCard
              key={c.id} contact={c} apps={applications}
              onEdit={() => setContactModal({ mode: "edit", contact: { ...c } })}
              onDelete={() => { if (window.confirm("Delete this contact?")) deleteContact(c.id); }}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
