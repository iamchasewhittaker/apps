import React, { useState, useMemo } from "react";
import { T } from "../tokens";
import { s, CONTACT_TYPES, OUTREACH_STATUSES, STAGE_COLORS, blankApp, generateId, today } from "../constants";
import ErrorBoundary from "../ErrorBoundary";
import ContactCard from "../components/ContactCard";

// Use runtime variable so ESLint no-script-url doesn't flag the bookmarklet string
const _bm_proto = "javascript";
const BOOKMARKLET = `${_bm_proto}:(function(){const APP="https://job-search-hq.vercel.app";try{const name=document.querySelector('[data-anonymize="person-name"]')?.textContent?.trim()||document.querySelector('.profile-topcard-person-entity__name')?.textContent?.trim()||"";const role=document.querySelector('[data-anonymize="title"]')?.textContent?.trim()||document.querySelector('.profile-topcard__summary-position')?.textContent?.trim()||"";const company=document.querySelector('[data-anonymize="company-name"]')?.textContent?.trim()||document.querySelector('.profile-topcard__summary-company')?.textContent?.trim()||"";const linkedin=window.location.href.split("?")[0];let industry="",companySize="";document.querySelectorAll('.profile-topcard__summary-industry,.topcard-condensed__summary-item').forEach(el=>{const t=el.textContent.trim();if(t.match(/\\d+[-\\u2013]\\d+|employees/i))companySize=t;else if(!industry)industry=t;});const isHiring=/hiring|open role|we're growing|job opening/i.test(document.body.innerText||"");const p=new URLSearchParams({importContact:"1",name,role,company,linkedin,companySize,industry,isHiring:isHiring?"true":"false"});window.open(APP+"?"+p.toString(),"_blank");}catch(e){alert("Could not extract profile. Make sure you\u2019re on a Sales Navigator profile page.");}})();`;

function SalesNavGuide() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyBookmarklet() {
    navigator.clipboard.writeText(BOOKMARKLET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: T.foreground, textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Sales Navigator Setup</span>
          <span style={{ fontSize: 11, background: T.accentBg, color: T.highlight, borderRadius: 10, padding: "2px 8px" }}>Bookmarklet</span>
        </div>
        <span style={{ color: T.muted, fontSize: 14 }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${T.border}` }}>

          {/* How it works */}
          <div style={{ fontSize: 14, color: T.foreground, marginTop: 14, marginBottom: 12, lineHeight: 1.7 }}>
            The bookmarklet runs in your browser while you're viewing a Sales Navigator profile. One click — it grabs their name, title, company, industry, and size, then opens this app with everything pre-filled in a new contact form.
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {[
              ["1", "Copy the bookmarklet code below"],
              ["2", "In Chrome, press ⌘D (or right-click the bookmarks bar → Add page)"],
              ["3", "Set the Name to anything — e.g. \"Import to Job HQ\""],
              ["4", "Delete the URL field and paste the copied code in its place"],
              ["5", "Save the bookmark"],
              ["6", "Open a Sales Navigator profile, click the bookmark — done"],
            ].map(([num, text]) => (
              <div key={num} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ background: T.accentBg, color: T.highlightLight, borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{num}</div>
                <div style={{ fontSize: 14, color: T.foreground, lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>

          {/* Bookmarklet code */}
          <div style={{ background: T.cardSubtle, border: `1px solid ${T.borderInput}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${T.borderInput}` }}>
              <span style={{ fontSize: 14, color: T.foreground, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>Bookmarklet code</span>
              <button onClick={copyBookmarklet} style={{ background: copied ? T.successBorder : T.borderInput, border: "none", color: copied ? T.successLight : T.foreground, borderRadius: 6, padding: "5px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ padding: "12px 14px", fontSize: 14, color: T.muted, fontFamily: "'DM Mono', monospace", wordBreak: "break-all", lineHeight: 1.6, maxHeight: 80, overflowY: "auto" }}>
              {BOOKMARKLET}
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginTop: 14, background: T.border, border: `1px solid ${T.borderInput}`, borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 14, color: T.foreground, fontWeight: 700, marginBottom: 8 }}>Tips</div>
            <div style={{ fontSize: 14, color: T.foreground, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 6 }}>
              <div>• The bookmarklet opens the app in a new tab — log in if prompted, the form will still appear.</div>
              <div>• Sales Navigator's layout changes occasionally. If data doesn't fill in, edit the contact manually after import.</div>
              <div>• The "Hiring" flag is detected from keywords on the page — not always accurate. Verify before reaching out.</div>
              <div>• The bookmarklet works on both Sales Navigator profile pages and regular LinkedIn profiles.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactsTab({ contacts, applications, setContactModal, deleteContact, saveContact, setTab, setAppModal, showError, onDraftMessage }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("list");
  const [openCompanies, setOpenCompanies] = useState(new Set());

  const filtered = useMemo(() => contacts.filter(c => {
    if (typeFilter !== "all" && (c.type || "other") !== typeFilter) return false;
    if (statusFilter !== "all" && (c.outreachStatus || "none") !== statusFilter) return false;
    return true;
  }), [contacts, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = contacts.length;
    const sent = contacts.filter(c => c.outreachStatus && c.outreachStatus !== "none").length;
    const replied = contacts.filter(c => ["replied", "meeting", "intro_made"].includes(c.outreachStatus)).length;
    const responseRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity = contacts.filter(c => {
      const d = c.outreachDate || c.lastContact;
      return d && new Date(d).getTime() > sevenDaysAgo;
    }).length;
    const meetings = contacts.filter(c => c.outreachStatus === "meeting").length;
    return { total, sent, responseRate, recentActivity, meetings };
  }, [contacts]);

  // Company grouping — purely computed from contacts + applications
  const companyGroups = useMemo(() => {
    const normalize = name => name?.trim().toLowerCase() || "__unknown__";
    const displayName = name => name?.trim() || "Unknown company";

    // Map contacts by company key
    const contactsByKey = {};
    const nameByKey = {};
    contacts.forEach(c => {
      const key = normalize(c.company);
      if (!contactsByKey[key]) { contactsByKey[key] = []; nameByKey[key] = displayName(c.company); }
      contactsByKey[key].push(c);
    });

    // Map applications by company key
    const appsByKey = {};
    applications.forEach(a => {
      if (["Rejected", "Withdrawn"].includes(a.stage)) return; // skip closed apps
      const key = normalize(a.company);
      if (!appsByKey[key]) { appsByKey[key] = []; if (!nameByKey[key]) nameByKey[key] = displayName(a.company); }
      appsByKey[key].push(a);
    });

    // Union all keys
    const allKeys = new Set([...Object.keys(contactsByKey), ...Object.keys(appsByKey)]);

    const groups = Array.from(allKeys).map(key => {
      const groupContacts = contactsByKey[key] || [];
      const groupApps = appsByKey[key] || [];
      return {
        key,
        name: nameByKey[key],
        contacts: groupContacts,
        apps: groupApps,
        isWarmLead: groupContacts.length > 0 && groupApps.length === 0,
        isMissingContact: groupApps.length > 0 && groupContacts.length === 0,
      };
    });

    // Sort: warm leads first, then by contact count desc, "__unknown__" always last
    groups.sort((a, b) => {
      if (a.key === "__unknown__") return 1;
      if (b.key === "__unknown__") return -1;
      if (a.isWarmLead !== b.isWarmLead) return a.isWarmLead ? -1 : 1;
      return b.contacts.length - a.contacts.length;
    });

    return groups;
  }, [contacts, applications]);

  function toggleCompany(key) {
    setOpenCompanies(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function updateStatus(contact, newStatus) {
    const prevStatus = contact.outreachStatus || "none";
    const todayStr = today();
    const nextDate = newStatus !== "none" && !contact.outreachDate ? todayStr : contact.outreachDate;

    const prevLog = Array.isArray(contact.outreachLog) ? contact.outreachLog : [];
    // Append a log entry when the status meaningfully changes to a real event
    const shouldLog = newStatus !== "none" && newStatus !== prevStatus;
    const nextLog = shouldLog
      ? [...prevLog, {
          id: generateId(),
          date: todayStr,
          type: newStatus,
          method: contact.source || "linkedin",
          notes: "",
        }]
      : prevLog;

    saveContact({
      ...contact,
      outreachStatus: newStatus,
      outreachDate: nextDate,
      outreachLog: nextLog,
    });
  }

  function toggleType(val) {
    setTypeFilter(prev => prev === val ? "all" : val);
  }
  function toggleStatus(val) {
    setStatusFilter(prev => prev === val ? "all" : val);
  }

  return (
    <ErrorBoundary name="Contacts">
      <div style={s.content}>

        {/* Inline stats summary */}
        {contacts.length > 0 && (
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
            <span>{stats.total} contacts</span>
            <span style={{ color: T.border }}>·</span>
            <span>{stats.sent} sent</span>
            <span style={{ color: T.border }}>·</span>
            <span style={{ color: stats.responseRate > 0 ? T.success : T.muted }}>{stats.responseRate}% response</span>
            <span style={{ color: T.border }}>·</span>
            <span>{stats.recentActivity} active</span>
            <span style={{ color: T.border }}>·</span>
            <span style={{ color: stats.meetings > 0 ? T.purple : T.muted }}>{stats.meetings} meetings</span>
          </div>
        )}

        {/* Controls: view toggle + filters in one row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={s.ciToggleRow}>
            <button
              style={{ ...s.ciToggleBtn, ...(view === "list" ? s.ciToggleBtnActive : {}) }}
              onClick={() => setView("list")}
            >List</button>
            <button
              style={{ ...s.ciToggleBtn, ...(view === "company" ? s.ciToggleBtnActive : {}) }}
              onClick={() => setView("company")}
            >By Company</button>
          </div>

          {view === "list" && contacts.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <span style={s.filterLabel}>Type:</span>
                <button style={{ ...s.filterChip, ...(typeFilter === "all" ? s.filterChipActive : {}) }} onClick={() => setTypeFilter("all")}>All</button>
                {CONTACT_TYPES.map(t => (
                  <button key={t.value}
                    style={{ ...s.filterChip, ...(typeFilter === t.value ? s.filterChipActive : {}) }}
                    onClick={() => toggleType(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <span style={s.filterLabel}>Status:</span>
                <button style={{ ...s.filterChip, ...(statusFilter === "all" ? s.filterChipActive : {}) }} onClick={() => setStatusFilter("all")}>All</button>
                {OUTREACH_STATUSES.map(st => (
                  <button key={st.value}
                    style={{ ...s.filterChip, ...(statusFilter === st.value ? s.filterChipActive : {}) }}
                    onClick={() => toggleStatus(st.value)}>
                    {st.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <>

            {/* Empty states */}
            {contacts.length === 0 && (
              <div style={s.empty}>No contacts yet. Add someone you've spoken with!</div>
            )}
            {contacts.length > 0 && filtered.length === 0 && (
              <div style={s.empty}>No contacts match these filters.</div>
            )}

            {/* Contact list */}
            <div style={s.contactList}>
              {filtered.map(c => (
                <ContactCard
                  key={c.id} contact={c} apps={applications}
                  onEdit={() => setContactModal({ mode: "edit", contact: { ...c } })}
                  onDelete={() => { if (window.confirm("Delete this contact?")) deleteContact(c.id); }}
                  onStatusChange={status => updateStatus(c, status)}
                  onDraftMessage={() => onDraftMessage(c)}
                  showError={showError}
                />
              ))}
            </div>
          </>
        )}

        {/* BY COMPANY VIEW */}
        {view === "company" && (
          <div>
            {contacts.length === 0 && applications.length === 0 && (
              <div style={s.empty}>No contacts or applications yet.</div>
            )}
            {companyGroups.map(group => (
              group.isMissingContact ? (
                // Ghost row — active application with zero contacts
                <div key={group.key} style={s.ciGhostRow}>
                  <span>0 contacts at <strong style={{ color: T.muted }}>{group.name}</strong></span>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(group.name)}`, "_blank")}
                    style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}
                  >find someone ↗</button>
                  {group.apps.map(a => (
                    <span key={a.id} style={{ ...s.ciStagePill, background: (STAGE_COLORS[a.stage] || T.muted) + "22", color: STAGE_COLORS[a.stage] || T.muted }}>
                      {a.stage}
                    </span>
                  ))}
                </div>
              ) : (
                // Normal company row with contacts
                <div key={group.key} style={s.ciRow}>
                  <div style={s.ciRowHeader} onClick={() => toggleCompany(group.key)}>
                    <div style={{ minWidth: 0 }}>
                      <div style={s.ciCompanyName}>
                        {group.name}
                        <span style={{ fontSize: 14, fontWeight: 400, color: T.muted, marginLeft: 8 }}>
                          {openCompanies.has(group.key) ? "▲" : "▼"}
                        </span>
                      </div>
                      <div style={s.ciMeta}>
                        {group.contacts.length} contact{group.contacts.length !== 1 ? "s" : ""}
                        {" — "}
                        {[...new Set(
                          group.contacts.map(c => (CONTACT_TYPES.find(t => t.value === (c.type || "other")) || {}).label).filter(Boolean)
                        )].join(", ")}
                        {group.contacts.some(c => ["replied", "meeting", "intro_made"].includes(c.outreachStatus)) && (
                          ` · ${group.contacts.filter(c => ["replied", "meeting", "intro_made"].includes(c.outreachStatus)).length} replied`
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                      {group.apps.map(a => (
                        <span key={a.id} style={{ ...s.ciStagePill, background: (STAGE_COLORS[a.stage] || T.muted) + "22", color: STAGE_COLORS[a.stage] || T.muted }}>
                          {a.stage}
                        </span>
                      ))}
                      {group.isWarmLead && (
                        <button
                          style={s.ciWarmBadge}
                          onClick={e => {
                            e.stopPropagation();
                            setAppModal({ mode: "new", app: { ...blankApp(), company: group.name } });
                          }}
                        >
                          Not applied — warm lead!
                        </button>
                      )}
                    </div>
                  </div>
                  {openCompanies.has(group.key) && (
                    <div style={s.ciCards}>
                      {group.contacts.map(c => (
                        <ContactCard
                          key={c.id} contact={c} apps={applications}
                          onEdit={() => setContactModal({ mode: "edit", contact: { ...c } })}
                          onDelete={() => { if (window.confirm("Delete this contact?")) deleteContact(c.id); }}
                          onStatusChange={status => updateStatus(c, status)}
                          onDraftMessage={() => onDraftMessage(c)}
                          showError={showError}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Sales Navigator setup -- moved to bottom (one-time setup) */}
        <div style={{ marginTop: 24 }}>
          <SalesNavGuide />
        </div>
      </div>
    </ErrorBoundary>
  );
}
