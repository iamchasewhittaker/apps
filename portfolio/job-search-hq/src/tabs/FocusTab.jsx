import React, { useState } from "react";
import { s, DAILY_BLOCKS, JOB_ACTION_TYPES, today, nextStepUrgency, buildOutreachPriorityList, prepSectionsHasContent, getWeeklyVelocityData } from "../constants";
import ErrorBoundary from "../ErrorBoundary";

// ── DAILY ACTION COUNTER ──────────────────────────────────────────────────────
function DailyActionCounter({ dailyActions, addDailyAction, removeDailyAction }) {
  const [expanded, setExpanded] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [pendingType, setPendingType] = useState(null);

  const todayStr = today();
  const todayActions = (dailyActions || []).filter(a => a.date === todayStr);
  const count = todayActions.length;
  const target = 5;
  const met = count >= target;

  // streak — consecutive days with count >= target
  const byDate = {};
  (dailyActions || []).forEach(a => { byDate[a.date] = (byDate[a.date] || 0) + 1; });
  let streak = 0;
  const check = new Date(); check.setHours(0,0,0,0);
  // don't penalise today not being done yet
  if ((byDate[todayStr] || 0) < target) check.setDate(check.getDate() - 1);
  while (true) {
    const d = check.toISOString().slice(0, 10);
    if ((byDate[d] || 0) >= target) { streak++; check.setDate(check.getDate() - 1); } else break;
  }

  function confirmAdd() {
    if (!pendingType) return;
    addDailyAction(pendingType, noteInput.trim());
    setNoteInput(""); setPendingType(null);
  }

  const barPct = Math.min(count / target, 1) * 100;
  const barColor = met ? "#c8a84b" : "#3b82f6";

  return (
    <div style={{
      background: met ? "#1a1608" : "#0f1117",
      border: `1.5px solid ${met ? "#c8a84b55" : "#1f2937"}`,
      borderRadius: 12, padding: "16px 18px", marginBottom: 16,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: met ? "#c8a84b" : "#f3f4f6" }}>
              Today's Job Actions: {count}/{target}
              {met && <span style={{ marginLeft: 8, fontSize: 12, color: "#c8a84b" }}>✓ Target met</span>}
            </div>
            {streak > 0 && (
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                🔥 {streak}-day streak — No Zero Days
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 12, padding: "2px 6px" }}
        >
          {expanded ? "▲ hide" : "▼ log"}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 3, background: "#1f2937", marginBottom: expanded ? 14 : 0 }}>
        <div style={{ height: "100%", borderRadius: 3, background: barColor, width: `${barPct}%`, transition: "width 0.3s" }} />
      </div>

      {expanded && (
        <>
          {/* Quick-add buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10, marginTop: 2 }}>
            {JOB_ACTION_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => {
                  if (pendingType === t.value && noteInput.trim()) { confirmAdd(); }
                  else { setPendingType(t.value); setNoteInput(""); }
                }}
                style={{
                  padding: "5px 10px", borderRadius: 6, fontSize: 12, fontFamily: "inherit",
                  cursor: "pointer", fontWeight: 600,
                  background: pendingType === t.value ? "#1e3a5f" : "#161b27",
                  border: `1.5px solid ${pendingType === t.value ? "#3b82f6" : "#1f2937"}`,
                  color: pendingType === t.value ? "#3b82f6" : "#9ca3af",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Note input — shown when a type is selected */}
          {pendingType && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                autoFocus
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmAdd(); if (e.key === "Escape") { setPendingType(null); setNoteInput(""); } }}
                placeholder={`Note for ${JOB_ACTION_TYPES.find(t => t.value === pendingType)?.label || "action"} (optional)`}
                style={{
                  flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontFamily: "inherit",
                  background: "#0f1117", border: "1.5px solid #1f2937", color: "#f3f4f6", outline: "none",
                }}
              />
              <button onClick={confirmAdd} style={{
                padding: "7px 14px", borderRadius: 6, fontSize: 13, fontFamily: "inherit",
                background: "#3b82f6", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer",
              }}>Add</button>
              <button onClick={() => { setPendingType(null); setNoteInput(""); }} style={{
                padding: "7px 10px", borderRadius: 6, fontSize: 13, fontFamily: "inherit",
                background: "#161b27", border: "1.5px solid #1f2937", color: "#6b7280", cursor: "pointer",
              }}>✕</button>
            </div>
          )}

          {/* Today's log */}
          {todayActions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {todayActions.map(a => {
                const t = JOB_ACTION_TYPES.find(x => x.value === a.type) || { icon: "⚡", label: a.type };
                return (
                  <div key={a.id} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "5px 8px",
                    background: "#0a0d14", borderRadius: 6, fontSize: 12,
                  }}>
                    <span>{t.icon}</span>
                    <span style={{ color: "#9ca3af", flex: "0 0 auto" }}>{a.time}</span>
                    <span style={{ color: "#d1d5db", fontWeight: 600, flex: "0 0 auto" }}>{t.label}</span>
                    {a.note && <span style={{ color: "#6b7280", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.note}</span>}
                    <button
                      onClick={() => removeDailyAction(a.id)}
                      style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}
                    >✕</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#4b5563", textAlign: "center", padding: "6px 0" }}>
              No actions logged yet today. Pick a type above to start.
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
  applications.filter(a => ["Phone Screen", "Interview", "Final Round"].includes(a.stage) && !prepSectionsHasContent(a.prepSections, a.prepNotes)).forEach(app => {
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

function VelocityDashboard({ applications, profile, saveProfile }) {
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(String(profile?.weeklyTarget ?? 5));
  const weeks = getWeeklyVelocityData(applications || []);
  const target = profile?.weeklyTarget ?? 5;
  const thisWeek = weeks[weeks.length - 1]?.count ?? 0;
  const maxCount = Math.max(...weeks.map(w => w.count), target, 1);
  const fourWkAvg = Math.round(weeks.slice(-4).reduce((s, w) => s + w.count, 0) / 4 * 10) / 10;
  const bestWeek = Math.max(...weeks.map(w => w.count));

  function saveTarget() {
    const n = parseInt(targetInput, 10);
    if (!isNaN(n) && n > 0) saveProfile({ ...profile, weeklyTarget: n });
    setEditingTarget(false);
  }

  return (
    <div style={{ background: "#0f1117", border: "1.5px solid #1f2937", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📈</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f3f4f6" }}>Weekly Pace</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6b7280" }}>
          <span>This wk: <strong style={{ color: thisWeek >= target ? "#10b981" : "#f3f4f6" }}>{thisWeek}/{target}</strong></span>
          <span>4-wk avg: <strong style={{ color: "#9ca3af" }}>{fourWkAvg}</strong></span>
          <span>Best: <strong style={{ color: "#9ca3af" }}>{bestWeek}</strong></span>
          {editingTarget ? (
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              Target:
              <input
                autoFocus
                type="number" min="1" max="30"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveTarget(); if (e.key === "Escape") setEditingTarget(false); }}
                style={{ width: 36, padding: "1px 4px", fontSize: 11, background: "#161b27", border: "1px solid #3b82f6", borderRadius: 4, color: "#f3f4f6", fontFamily: "inherit" }}
              />
              <button onClick={saveTarget} style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, background: "#3b82f6", border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>✓</button>
            </span>
          ) : (
            <button onClick={() => { setEditingTarget(true); setTargetInput(String(target)); }} style={{ fontSize: 11, color: "#4b5563", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Edit target
            </button>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
        {weeks.map(w => {
          const barH = Math.round((w.count / maxCount) * 50);
          const targetH = Math.round((target / maxCount) * 50);
          const atTarget = w.count >= target;
          return (
            <div key={w.weekStart} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative" }}>
              {/* Target line marker */}
              <div style={{ position: "absolute", bottom: targetH + 14, left: 0, right: 0, borderTop: "1px dashed #1f2937" }} />
              <div style={{
                width: "100%", borderRadius: "3px 3px 0 0",
                height: Math.max(barH, w.count > 0 ? 4 : 0),
                background: w.isCurrent
                  ? (atTarget ? "#10b981" : "#3b82f6")
                  : (atTarget ? "#10b98155" : "#1e3a5f"),
                transition: "height 0.2s",
                marginTop: "auto",
              }} />
              <div style={{ fontSize: 9, color: w.isCurrent ? "#9ca3af" : "#374151", whiteSpace: "nowrap", lineHeight: 1 }}>
                {w.isCurrent ? "now" : w.label.replace(/\w+ /, "")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FocusTab({
  expandedBlock, setExpandedBlock, completedBlocks, setCompletedBlocks, todayDone,
  applications, contacts, dailyActions, addDailyAction, removeDailyAction,
  setAppModal, setPrepModal, setContactModal, setTab, showError,
  profile, saveProfile,
}) {
  const queue = buildQueue(applications || [], contacts || []);
  const outreachList = buildOutreachPriorityList(contacts || [], applications || []);

  function handleAction(item) {
    if (item.type === "nextstep" || item.type === "stale") {
      setAppModal({ mode: "edit", app: { ...item.app } });
    } else if (item.type === "prep") {
      setPrepModal({ app: item.app });
    } else if (item.type === "contact_replied" || item.type === "contact_followup") {
      setTab("contacts");
    }
  }

  async function copyPrompt(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      showError?.("Could not copy prompt - copy/paste manually from Contacts tab");
    }
  }

  return (
    <ErrorBoundary name="Daily Focus">
      <div style={s.content}>
        <DailyActionCounter
          dailyActions={dailyActions}
          addDailyAction={addDailyAction}
          removeDailyAction={removeDailyAction}
        />

        <VelocityDashboard
          applications={applications}
          profile={profile}
          saveProfile={saveProfile}
        />

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

        {/* Who to message today */}
        <div style={s.outreachSection}>
          <div style={s.outreachHeader}>
            <span style={s.outreachTitle}>Who should I message today?</span>
            {outreachList.length > 0 && <span style={s.outreachCountBadge}>{outreachList.length}</span>}
          </div>
          {outreachList.length === 0 ? (
            <div style={s.outreachEmpty}>No priority outreach right now. Log new contacts or update outreach status to build your queue.</div>
          ) : (
            <div style={s.outreachList}>
              {outreachList.map(item => (
                <div key={item.id} style={{ ...s.outreachItem, borderLeft: `3px solid ${item.tone.color}` }}>
                  <div style={s.outreachTop}>
                    <div style={s.outreachName}>
                      {item.contact.name || "Unnamed contact"}
                      {item.contact.company ? ` - ${item.contact.company}` : ""}
                    </div>
                    <span style={{ ...s.aqLabel, background: item.tone.bg, color: item.tone.color }}>{item.tone.label}</span>
                  </div>
                  <div style={s.outreachReason}>{item.primaryReason}</div>
                  {item.context && <div style={s.outreachContext}>{item.context}</div>}
                  <div style={s.outreachActions}>
                    <button style={s.outreachBtnPrimary} onClick={() => copyPrompt(item.draftPrompt)}>Copy Prompt</button>
                    <button style={s.outreachBtnSecondary} onClick={() => setContactModal({ mode: "edit", contact: { ...item.contact } })}>Edit Contact</button>
                    {item.linkedApp && (
                      <button
                        style={s.outreachBtnSecondary}
                        onClick={() => {
                          setTab("pipeline");
                          setAppModal({ mode: "edit", app: { ...item.linkedApp } });
                        }}
                      >
                        Open App
                      </button>
                    )}
                  </div>
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
