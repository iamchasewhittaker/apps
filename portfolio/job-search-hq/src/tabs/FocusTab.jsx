import React from "react";
import { s, DAILY_BLOCKS, nextStepUrgency } from "../constants";
import ErrorBoundary from "../ErrorBoundary";

function buildQueue(applications, contacts) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const items = [];

  // Overdue or due-today next steps
  applications.filter(a => a.nextStepDate && !["Rejected", "Withdrawn"].includes(a.stage)).forEach(app => {
    const due = new Date(app.nextStepDate + "T00:00:00");
    const diff = Math.round((due - today) / 86400000);
    if (diff <= 0) {
      const u = nextStepUrgency(app.nextStepDate);
      items.push({ type: "nextstep", urgency: u, app, title: `${app.company} — ${app.title}`, sub: app.nextStep || "Next step due", actionLabel: "Open" });
    }
  });

  // Active interview stages with no prep notes
  applications.filter(a => ["Phone Screen", "Interview", "Final Round"].includes(a.stage) && !a.prepNotes).forEach(app => {
    items.push({ type: "prep", urgency: { label: app.stage, color: "#f59e0b", bg: "#451a03" }, app, title: `Prep needed — ${app.company}`, sub: `${app.stage} · no prep notes yet`, actionLabel: "Prep" });
  });

  // Contacts who replied — respond now
  contacts.filter(c => c.outreachStatus === "replied").forEach(contact => {
    items.push({ type: "contact_replied", urgency: { label: "Replied", color: "#3b82f6", bg: "#1e3a5f" }, contact, title: `${contact.name} responded`, sub: `${contact.role} at ${contact.company} — schedule a call`, actionLabel: "View" });
  });

  // Sent outreach with no reply in 5+ days
  contacts.filter(c => c.outreachStatus === "sent" && c.outreachDate).forEach(contact => {
    const sent = new Date(contact.outreachDate + "T00:00:00");
    const days = Math.round((today - sent) / 86400000);
    if (days >= 5) {
      items.push({ type: "contact_followup", urgency: { label: `${days}d no reply`, color: days >= 10 ? "#ef4444" : "#f59e0b", bg: days >= 10 ? "#450a0a" : "#451a03" }, contact, title: `Follow up with ${contact.name}`, sub: `${contact.role} at ${contact.company}`, actionLabel: "Follow Up" });
    }
  });

  // Stale "Applied" (14+ days, no response)
  applications.filter(a => a.stage === "Applied" && a.appliedDate).forEach(app => {
    const applied = new Date(app.appliedDate + "T00:00:00");
    const days = Math.round((today - applied) / 86400000);
    if (days >= 14) {
      items.push({ type: "stale", urgency: { label: `${days}d no reply`, color: "#6b7280", bg: "#1f2937" }, app, title: `${app.company} — no response`, sub: `Applied ${days} days ago — follow up or find a contact`, actionLabel: "Open" });
    }
  });

  return items;
}

export default function FocusTab({ expandedBlock, setExpandedBlock, completedBlocks, setCompletedBlocks, todayDone, applications, contacts, setAppModal, setPrepModal, setTab }) {
  const queue = buildQueue(applications || [], contacts || []);

  function handleAction(item) {
    if (item.type === "nextstep" || item.type === "stale") {
      setAppModal({ mode: "edit", app: { ...item.app } });
    } else if (item.type === "prep") {
      setPrepModal({ app: item.app });
    } else if (item.type === "contact_replied" || item.type === "contact_followup") {
      setTab("contacts");
    }
  }

  return (
    <ErrorBoundary name="Daily Focus">
      <div style={s.content}>
        <div style={s.focusHeader}>
          <div>
            <div style={s.focusTitle}>Tonight's focus</div>
            <div style={s.focusSub}>Pick ONE block. Set a timer. Do it. That's a successful evening.</div>
          </div>
          <div style={s.focusCount}>
            <div style={s.focusCountNum}>{todayDone}</div>
            <div style={s.focusCountLabel}>done today</div>
          </div>
        </div>

        {/* Action Queue */}
        <div style={s.aqSection}>
          <div style={s.aqHeader}>
            <span style={s.aqTitle}>Action Queue</span>
            {queue.length > 0 && <span style={s.aqBadge}>{queue.length}</span>}
          </div>
          {queue.length === 0 ? (
            <div style={s.aqEmpty}>You're all caught up — no overdue tasks or pending follow-ups.</div>
          ) : (
            <div style={s.aqList}>
              {queue.map((item, i) => (
                <div key={i} style={{ ...s.aqItem, borderLeft: `3px solid ${item.urgency.color}` }}>
                  <span style={{ ...s.aqLabel, background: item.urgency.bg, color: item.urgency.color }}>{item.urgency.label}</span>
                  <div style={s.aqItemText}>
                    <div style={s.aqItemTitle}>{item.title}</div>
                    <div style={s.aqItemSub}>{item.sub}</div>
                  </div>
                  <button style={s.aqActionBtn} onClick={() => handleAction(item)}>{item.actionLabel}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {DAILY_BLOCKS.map(block => {
            const isOpen = expandedBlock === block.id;
            const isDone = completedBlocks[block.id];
            return (
              <div key={block.id} style={{ ...s.focusBlock, ...(isDone ? s.focusBlockDone : {}) }}>
                <div style={s.focusBlockHeader} onClick={() => setExpandedBlock(isOpen ? null : block.id)}>
                  <div style={s.focusBlockLeft}>
                    <span style={{ fontSize: 18 }}>{block.emoji}</span>
                    <div>
                      <div style={s.focusBlockTitle}>{block.title}</div>
                      <div style={s.focusBlockTime}>{block.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ ...s.focusTag, background: block.tagColor + "22", color: block.tagColor }}>{block.tag}</span>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={s.focusBlockBody}>
                    <div style={s.focusSteps}>
                      {block.steps.map((step, i) => (
                        <div key={i} style={s.focusStep}>
                          <span style={s.focusStepNum}>{i + 1}</span>
                          <span style={s.focusStepText}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div style={s.focusAdhdTip}>
                      <span style={{ color: "#f59e0b" }}>⚡ ADHD tip:</span> {block.adhd}
                    </div>
                    <button
                      style={{ ...s.btnPrimary, ...(isDone ? { background: "#14532d" } : {}), marginTop: 12 }}
                      onClick={() => {
                        setCompletedBlocks(prev => ({ ...prev, [block.id]: !isDone }));
                        if (!isDone) setExpandedBlock(null);
                      }}
                    >
                      {isDone ? "✓ Completed — undo" : "Mark done"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={s.weeklyRhythm}>
          <div style={s.sectionLabel}>Weekly rhythm</div>
          {[
            ["Mon", "Research block — 1 company deep dive"],
            ["Tue", "Application block — 1 tailored application"],
            ["Wed", "Skill building — cert or course module"],
            ["Thu", "Networking block — 2 LinkedIn connections"],
            ["Fri", "Follow-up block — check pipeline, send follow-ups"],
            ["Sat", "Optional — only if you have energy"],
            ["Sun", "Weekly review — 15 min in Sunsama only"],
          ].map(([day, task]) => (
            <div key={day} style={s.weekRow}>
              <span style={s.weekDay}>{day}</span>
              <span style={s.weekTask}>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
