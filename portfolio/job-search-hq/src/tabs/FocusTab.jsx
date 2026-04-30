import React, { useMemo, useState } from "react";
import { T } from "../tokens";
import {
  s,
  DAILY_BLOCKS,
  JOB_ACTION_TYPES,
  today,
  nextStepUrgency,
  buildOutreachPriorityList,
  buildCompanyBoard,
  prepSectionsHasContent,
  getWeeklyVelocityData,
  DAILY_MINIMUMS,
  DIRECTION_TRACKS,
  DIRECTION,
  getDirectionSplit,
  WIN_TYPES,
  blankApp,
  blankContact,
  getDailyDiscoveryQueries,
  getLaunchpadProgress,
} from "../constants";
import { JOB_SEARCH_EXTERNAL_LINKS } from "../applyPrompts";
import ErrorBoundary from "../ErrorBoundary";
import InboxPanel from "../components/InboxPanel";

// UrgencyHeader, DailyMinimums, KassieCard moved to DashboardTab (v8.19)

// ── DIRECTION SPLIT — IC/SE/AE/Other counts + response rates ────────────────
function DirectionSplit({ applications }) {
  const split = getDirectionSplit(applications || []);
  const totalApps = DIRECTION_TRACKS.reduce((sum, t) => sum + split[t.value].count, 0);

  return (
    <div style={s.cardCompact}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🧭</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.foreground }}>Direction split</span>
        </div>
        <span style={{ fontSize: 14, color: T.muted }}>
          {totalApps} {totalApps === 1 ? "application" : "applications"} total
        </span>
      </div>
      {totalApps === 0 ? (
        <div style={{ fontSize: 14, color: T.muted }}>
          Log your first IC / SE / AE application to see the split.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DIRECTION_TRACKS.map(t => {
            const row = split[t.value];
            if (!row.count) return null;
            const pct = totalApps ? Math.round((row.count / totalApps) * 100) : 0;
            return (
              <div key={t.value} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
                <span style={{ minWidth: 48, color: t.color, fontWeight: 600 }}>{t.value}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: T.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: t.color, width: `${pct}%` }} />
                </div>
                <span style={{ color: T.muted, minWidth: 80, textAlign: "right" }}>
                  {row.count} · {row.responseRate}% response
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── WINS LOG — Last 5 wins + manual "Log a win" ─────────────────────────────
function WinsLog({ wins, addWin, removeWin }) {
  const [adding, setAdding] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const sorted = [...(wins || [])].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5);

  function submit() {
    const title = titleInput.trim();
    if (!title) return;
    addWin({ type: "manual", title, autoLogged: false });
    setTitleInput("");
    setAdding(false);
  }

  return (
    <div style={s.cardCompact}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.foreground }}>Wins log</span>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          style={{ fontSize: 14, background: T.accentBg, border: "none", color: T.highlight, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}
        >
          {adding ? "✕ cancel" : "+ Log a win"}
        </button>
      </div>

      {adding && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            autoFocus
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") { setAdding(false); setTitleInput(""); } }}
            placeholder="One line — what happened?"
            style={{ flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 14, fontFamily: "inherit", background: T.cardSubtle, border: `1.5px solid ${T.border}`, color: T.foreground, outline: "none" }}
          />
          <button onClick={submit} style={{ padding: "7px 14px", borderRadius: 6, fontSize: 14, background: T.accent, border: "none", color: T.foreground, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div style={{ fontSize: 14, color: T.muted }}>
          No wins logged yet. Stage moves and replies log automatically. Add manual wins for anything else.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {sorted.map(w => {
            const type = WIN_TYPES.find(t => t.value === w.type) || WIN_TYPES[3];
            return (
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: T.cardSubtle, borderRadius: 6, fontSize: 14 }}>
                <span style={{ fontSize: 11, color: type.color, background: type.color + "22", padding: "2px 6px", borderRadius: 4, fontWeight: 600, minWidth: 68, textAlign: "center" }}>
                  {type.label}
                </span>
                <span style={{ color: T.muted, flex: "0 0 auto", fontSize: 14 }}>{w.date}</span>
                <span style={{ color: T.foreground, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {w.title}
                  {w.autoLogged && <span style={{ color: T.borderInput, marginLeft: 6, fontSize: 11 }}>auto</span>}
                </span>
                <button
                  onClick={() => removeWin(w.id)}
                  style={{ background: "none", border: "none", color: T.borderInput, cursor: "pointer", fontSize: 14, padding: "0 2px" }}
                >✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const barColor = met ? T.gold : T.accent;

  return (
    <div style={{
      background: met ? T.goldBg : T.cardSubtle,
      border: `1.5px solid ${met ? T.goldBorder : T.border}`,
      borderRadius: 12, padding: "16px 18px", marginBottom: 16,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: met ? T.gold : T.foreground }}>
              Today's Job Actions: {count}/{target}
              {met && <span style={{ marginLeft: 8, fontSize: 12, color: T.gold }}>✓ Target met</span>}
            </div>
            {streak > 0 && (
              <div style={{ fontSize: 14, color: T.muted, marginTop: 1 }}>
                🔥 {streak}-day streak — No Zero Days
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 14, padding: "2px 6px" }}
        >
          {expanded ? "▲ hide" : "▼ log"}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 3, background: T.border, marginBottom: expanded ? 14 : 0 }}>
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
                  padding: "5px 10px", borderRadius: 6, fontSize: 14, fontFamily: "inherit",
                  cursor: "pointer", fontWeight: 600,
                  background: pendingType === t.value ? T.accentBg : T.card,
                  border: `1.5px solid ${pendingType === t.value ? T.accent : T.border}`,
                  color: pendingType === t.value ? T.accent : T.muted,
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
                  flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 14, fontFamily: "inherit",
                  background: T.cardSubtle, border: `1.5px solid ${T.border}`, color: T.foreground, outline: "none",
                }}
              />
              <button onClick={confirmAdd} style={{
                padding: "7px 14px", borderRadius: 6, fontSize: 14, fontFamily: "inherit",
                background: T.accent, border: "none", color: T.foreground, fontWeight: 700, cursor: "pointer",
              }}>Add</button>
              <button onClick={() => { setPendingType(null); setNoteInput(""); }} style={{
                padding: "7px 10px", borderRadius: 6, fontSize: 14, fontFamily: "inherit",
                background: T.card, border: `1.5px solid ${T.border}`, color: T.muted, cursor: "pointer",
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
                    background: T.cardSubtle, borderRadius: 6, fontSize: 14,
                  }}>
                    <span>{t.icon}</span>
                    <span style={{ color: T.muted, flex: "0 0 auto" }}>{a.time}</span>
                    <span style={{ color: T.foreground, fontWeight: 600, flex: "0 0 auto" }}>{t.label}</span>
                    {a.note && <span style={{ color: T.muted, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.note}</span>}
                    <button
                      onClick={() => removeDailyAction(a.id)}
                      style={{ background: "none", border: "none", color: T.borderInput, cursor: "pointer", fontSize: 14, padding: "0 2px", lineHeight: 1 }}
                    >✕</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: T.muted, textAlign: "center", padding: "6px 0" }}>
              No actions logged yet today. Pick a type above to start.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── DISCOVERY SPRINT (Option B) ──────────────────────────────────────────────
// 15-min time-boxed panel: rotating daily query, multi-board launcher, quick-capture strip.
// Pairs with Today's 5 — Discovery fills the queue, Today's 5 drains it.
function DiscoverySprint({ setAppModal }) {
  const [queries, setQueries] = useState(() => getDailyDiscoveryQueries());
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  function openAll() {
    JOB_SEARCH_EXTERNAL_LINKS.forEach(link => {
      window.open(link.buildUrl(queries.today), "_blank", "noopener,noreferrer");
    });
  }

  function skipToNext() {
    setQueries(q => {
      const newToday = q.next;
      const newNextIdx = (q.nextIdx + 1) % q.total;
      // Reuse helper for consistency — feed it a date offset by one day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const rotated = getDailyDiscoveryQueries(tomorrow);
      return { ...rotated, today: newToday, nextIdx: newNextIdx };
    });
  }

  function quickSave(e) {
    e.preventDefault();
    if (!url.trim() && !company.trim()) return;
    setAppModal({
      mode: "new",
      app: {
        ...blankApp(),
        url: url.trim(),
        company: company.trim(),
        title: title.trim(),
        stage: "Interested",
      },
    });
    setUrl(""); setCompany(""); setTitle("");
  }

  return (
    <div style={s.discoverySprint}>
      <div style={s.discoveryHeader}>
        <div style={s.discoveryTitle}>
          <span>🔎</span>
          <span>Discovery sprint</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>
            15 min
          </span>
        </div>
        <span style={{ fontSize: 14, color: T.muted }}>
          query {queries.todayIdx + 1} of {queries.total}
        </span>
      </div>

      <div style={s.discoveryQueryBox}>
        <div style={s.discoveryQueryLabel}>Today's query</div>
        <div style={s.discoveryQueryText}>{queries.today}</div>
      </div>

      <div style={s.discoveryActions}>
        <button onClick={openAll} style={s.discoveryOpenAll}>
          🚀 Open all searches (LinkedIn · Indeed · Google)
        </button>
        <button onClick={skipToNext} style={s.discoverySkipBtn} title={`Next: ${queries.next}`}>
          ↻ Skip to next
        </button>
      </div>

      <div style={s.discoveryCaptureLabel}>Quick capture — paste a job into Interested</div>
      <form onSubmit={quickSave}>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Job URL (paste from LinkedIn, Indeed, etc.)"
          style={{ ...s.discoveryCaptureInput, width: "100%", marginBottom: 8 }}
        />
        <div style={s.discoveryCaptureGrid}>
          <input
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Company"
            style={s.discoveryCaptureInput}
          />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            style={s.discoveryCaptureInput}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={!url.trim() && !company.trim()}
            style={{ ...s.discoveryCaptureSave, opacity: (!url.trim() && !company.trim()) ? 0.5 : 1 }}
          >
            + Save to Interested
          </button>
        </div>
      </form>
    </div>
  );
}

// ── TODAY'S 5 QUEUE (Option A) ───────────────────────────────────────────────
// Surfaces up to 5 Interested apps as a daily apply queue.
// Priority: has JD saved > has next-step date > appliedDate (oldest first as proxy for age in queue).
function buildTodaysQueue(applications) {
  return (applications || [])
    .filter(a => a.stage === "Interested")
    .sort((a, b) => {
      // has JD: higher priority
      const aJd = a.jobDescription ? 1 : 0;
      const bJd = b.jobDescription ? 1 : 0;
      if (bJd !== aJd) return bJd - aJd;
      // has next-step date: higher priority
      const aNs = a.nextStepDate ? 1 : 0;
      const bNs = b.nextStepDate ? 1 : 0;
      if (bNs !== aNs) return bNs - aNs;
      // oldest added first
      return (a.id || "").localeCompare(b.id || "");
    })
    .slice(0, 5);
}

function TodaysQueue({ applications, dailyActions, setKitApp, setResumeTab, setTab, saveApp, setAppModal, setApplyWizard, addDailyAction }) {
  const todayStr = today();
  const todayApps = (dailyActions || []).filter(a => a.date === todayStr && a.type === "application").length;
  const queue = buildTodaysQueue(applications);
  const interestedCount = (applications || []).filter(a => a.stage === "Interested").length;
  const target = DAILY_MINIMUMS.applications;
  const remaining = Math.max(0, target - todayApps);

  function handleStartApply(app) {
    // Open the 7-step Apply Wizard in place; falls back to Apply Tools tab if not wired.
    if (setApplyWizard) {
      setApplyWizard({ app });
    } else {
      setKitApp(app);
      setResumeTab("kit");
      setTab("ai");
    }
  }

  function handleMarkApplied(app) {
    if (app.stage === "Applied") return;
    saveApp({ ...app, stage: "Applied", appliedDate: todayStr });
    if (addDailyAction) addDailyAction("application", `Applied to ${app.company || "Unknown"}`);
  }

  const headerDone = todayApps >= target;

  return (
    <div style={{
      background: headerDone ? T.interviewBg : T.cardSubtle,
      border: `1.5px solid ${headerDone ? T.offerGreenBg : T.border}`,
      borderRadius: 12, padding: "14px 16px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: headerDone ? T.successMid : T.foreground }}>
              Today's applications — {todayApps}/{target}
              {headerDone && <span style={{ marginLeft: 8, fontSize: 12, color: T.successMid }}>✓ Done</span>}
            </div>
            <div style={{ fontSize: 14, color: T.muted, marginTop: 1 }}>
              {headerDone
                ? "Daily target met — nice work."
                : remaining === target
                  ? `${interestedCount} job${interestedCount !== 1 ? "s" : ""} queued in Interested`
                  : `${remaining} more to hit today's target`}
            </div>
          </div>
        </div>
        <button
          onClick={() => setAppModal({ mode: "new", app: { ...blankApp(), stage: "Interested" } })}
          style={{ fontSize: 14, background: T.accentBg, border: "none", color: T.highlight, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}
        >
          + Add job
        </button>
      </div>

      {queue.length === 0 ? (
        <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
          No jobs queued in <strong style={{ color: T.foreground }}>Interested</strong> stage yet.
          {" "}<button onClick={() => setTab("ai")} style={{ background: "none", border: "none", color: T.highlight, cursor: "pointer", fontSize: 12, padding: 0 }}>Find Jobs →</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {queue.map((app, idx) => (
            <div key={app.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: T.cardSubtle, borderRadius: 8, padding: "8px 10px",
              border: `1px solid ${T.border}`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.muted, minWidth: 16 }}>{idx + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.foreground, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {app.company || "Unnamed"}
                </div>
                <div style={{ fontSize: 14, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {app.title || "—"}
                  {app.jobDescription && <span style={{ color: T.success, marginLeft: 6 }}>JD ✓</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => handleStartApply(app)}
                  style={{
                    fontSize: 14, padding: "4px 8px", borderRadius: 5, border: "none",
                    background: T.accentBg,
                    color: T.highlight,
                    cursor: "pointer", fontWeight: 600
                  }}
                  title="Walk through the 7-step Apply Wizard"
                >
                  🚀 Apply
                </button>
                <button
                  onClick={() => handleMarkApplied(app)}
                  style={{
                    fontSize: 14, padding: "4px 8px", borderRadius: 5, border: "none",
                    background: T.successBorder, color: T.successMid,
                    cursor: "pointer", fontWeight: 600
                  }}
                  title="Mark as Applied and advance stage"
                >
                  ✓ Applied
                </button>
              </div>
            </div>
          ))}
          {interestedCount > 5 && (
            <div style={{ fontSize: 14, color: T.muted, textAlign: "center", paddingTop: 2 }}>
              +{interestedCount - 5} more in queue — finish these first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── TARGET COMPANY BOARD ──────────────────────────────────────────────────────
// Single-glance status for all DIRECTION.primaryCompanies.
// Sort order from buildCompanyBoard: untouched → applied-no-contact → contacted-no-app → covered.
function TargetCompanyBoard({ applications, contacts, setAppModal, setContactModal }) {
  const [collapsed, setCollapsed] = useState(true);
  const board = buildCompanyBoard(applications, contacts);
  const covered = board.filter(r => r.app || r.contact).length;

  function linkedInSearchUrl(company) {
    const q = encodeURIComponent(`"Implementation Consultant" OR "Solutions Engineer" OR "Customer Success" ${company}`);
    return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
  }

  function statusBadge({ app, contact }) {
    if (app && contact)  return { label: "Covered",                    color: T.successMid, bg: T.successBg };
    if (app && !contact) return { label: app.stage,                    color: T.warning, bg: T.warningBg };
    if (!app && contact) return { label: contact.name || "Contacted",  color: T.highlight, bg: T.accentBg };
    return                      { label: "Untouched",                  color: T.danger, bg: T.dangerBg };
  }

  return (
    <div style={s.cardCompact}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: collapsed ? 0 : 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.foreground }}>Target Companies</div>
            <div style={{ fontSize: 14, color: T.muted, marginTop: 1 }}>
              {covered}/{board.length} covered — applied or contacted
            </div>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ fontSize: 14, background: "none", border: "none", color: T.muted, cursor: "pointer", padding: "2px 6px" }}
        >
          {collapsed ? "▼" : "▲"}
        </button>
      </div>

      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {board.map(row => {
            const badge = statusBadge(row);
            return (
              <div key={row.company} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: T.cardSubtle, borderRadius: 8, padding: "7px 10px",
                border: `1px solid ${T.border}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.foreground, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {row.company}
                  </div>
                  {row.contact && (
                    <div style={{ fontSize: 14, color: T.muted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.contact.name || "Contact"}{row.contact.role ? ` · ${row.contact.role}` : ""}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                  color: badge.color, background: badge.bg, whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {badge.label}
                </span>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {!row.app && (
                    <button
                      onClick={() => setAppModal({ mode: "new", app: { ...blankApp(), company: row.company, stage: "Interested" } })}
                      style={{ fontSize: 14, padding: "3px 7px", borderRadius: 5, border: "none", background: T.accentBg, color: T.highlight, cursor: "pointer", fontWeight: 600 }}
                    >
                      + Apply
                    </button>
                  )}
                  {!row.contact && (
                    <button
                      onClick={() => setContactModal({ mode: "new", contact: { ...blankContact(), company: row.company } })}
                      style={{ fontSize: 14, padding: "3px 7px", borderRadius: 5, border: "none", background: T.accentBg, color: T.highlight, cursor: "pointer", fontWeight: 600 }}
                    >
                      + Contact
                    </button>
                  )}
                  <a
                    href={linkedInSearchUrl(row.company)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, padding: "3px 7px", borderRadius: 5, background: T.card, color: T.muted, textDecoration: "none", fontWeight: 600, lineHeight: "18px", display: "inline-block" }}
                  >
                    LI ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── OUTREACH DISCOVERY (Option D) ─────────────────────────────────────────────
// Surfaces target companies that have no contacts yet so you always have outreach targets,
// even with an empty CRM.
function buildDiscoveryTargets(applications, contacts) {
  // Companies you've already applied to or have contacts at
  const appliedCompanies = new Set(
    (applications || [])
      .filter(a => !["Rejected", "Withdrawn"].includes(a.stage))
      .map(a => (a.company || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const contactedCompanies = new Set(
    (contacts || []).map(c => (c.company || "").trim().toLowerCase()).filter(Boolean)
  );

  // Primary companies from DIRECTION that have zero contacts and no active application
  return DIRECTION.primaryCompanies
    .filter(company => {
      const key = company.trim().toLowerCase();
      return !contactedCompanies.has(key) && !appliedCompanies.has(key);
    })
    .slice(0, 4); // show up to 4 discovery targets so the card doesn't overwhelm
}

function OutreachDiscovery({ applications, contacts, setContactModal }) {
  const targets = buildDiscoveryTargets(applications, contacts);
  if (targets.length === 0) return null;

  function linkedInSearchUrl(company) {
    // Pre-built LinkedIn People search for Implementation/CS roles at the company
    const q = `Implementation OR "Solutions Engineer" OR "Customer Success" ${company}`;
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
  }

  function handleQuickAdd(company) {
    setContactModal({
      mode: "new",
      contact: {
        id: undefined, name: "", company, role: "", email: "", linkedin: "",
        lastContact: "", notes: "", appIds: [], type: "other",
        outreachStatus: "none", outreachDate: "", source: "",
        companySize: "", industry: "", isHiring: false, outreachLog: [],
      },
    });
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
        🧭 Find someone at a target company
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {targets.map(company => (
          <div key={company} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: T.cardSubtle, borderRadius: 7, padding: "7px 10px",
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, color: T.foreground, fontWeight: 600 }}>{company}</span>
              <span style={{ fontSize: 14, color: T.muted, marginLeft: 8 }}>no contacts yet</span>
            </div>
            <a
              href={linkedInSearchUrl(company)}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 14, padding: "3px 8px", borderRadius: 5,
                background: T.accentBg, color: T.highlight,
                textDecoration: "none", fontWeight: 600, flexShrink: 0,
              }}
            >
              Search LinkedIn ↗
            </a>
            <button
              onClick={() => handleQuickAdd(company)}
              style={{
                fontSize: 14, padding: "3px 8px", borderRadius: 5, border: "none",
                background: T.card, color: T.muted,
                cursor: "pointer", fontWeight: 600, flexShrink: 0,
              }}
            >
              + Add contact
            </button>
          </div>
        ))}
      </div>
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
    items.push({ type: "prep", urgency: { label: app.stage, color: T.warning, bg: T.warningBg }, app, title: `Prep needed — ${app.company}`, sub: `${app.stage} · no prep notes yet`, actionLabel: "Prep" });
  });

  // Contacts who replied — respond now
  contacts.filter(c => c.outreachStatus === "replied").forEach(contact => {
    items.push({ type: "contact_replied", urgency: { label: "Replied", color: T.accent, bg: T.accentBg }, contact, title: `${contact.name} responded`, sub: `${contact.role} at ${contact.company} — schedule a call`, actionLabel: "View" });
  });

  // Sent outreach with no reply in 5+ days
  contacts.filter(c => c.outreachStatus === "sent" && c.outreachDate).forEach(contact => {
    const sent = new Date(contact.outreachDate + "T00:00:00");
    const days = Math.round((today - sent) / 86400000);
    if (days >= 5) {
      items.push({ type: "contact_followup", urgency: { label: `${days}d no reply`, color: days >= 10 ? T.danger : T.warning, bg: days >= 10 ? T.dangerBg : T.warningBg }, contact, title: `Follow up with ${contact.name}`, sub: `${contact.role} at ${contact.company}`, actionLabel: "Follow Up" });
    }
  });

  // Stale "Applied" (14+ days, no response)
  applications.filter(a => a.stage === "Applied" && a.appliedDate).forEach(app => {
    const applied = new Date(app.appliedDate + "T00:00:00");
    const days = Math.round((today - applied) / 86400000);
    if (days >= 14) {
      items.push({ type: "stale", urgency: { label: `${days}d no reply`, color: T.muted, bg: T.border }, app, title: `${app.company} — no response`, sub: `Applied ${days} days ago — follow up or find a contact`, actionLabel: "Open" });
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
    <div style={s.cardCompact}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📈</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.foreground }}>Weekly Pace</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 14, color: T.muted }}>
          <span>This wk: <strong style={{ color: thisWeek >= target ? T.success : T.foreground }}>{thisWeek}/{target}</strong></span>
          <span>4-wk avg: <strong style={{ color: T.muted }}>{fourWkAvg}</strong></span>
          <span>Best: <strong style={{ color: T.muted }}>{bestWeek}</strong></span>
          {editingTarget ? (
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              Target:
              <input
                autoFocus
                type="number" min="1" max="30"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveTarget(); if (e.key === "Escape") setEditingTarget(false); }}
                style={{ width: 36, padding: "1px 4px", fontSize: 14, background: T.card, border: `1px solid ${T.accent}`, borderRadius: 4, color: T.foreground, fontFamily: "inherit" }}
              />
              <button onClick={saveTarget} style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, background: T.accent, border: "none", color: T.foreground, cursor: "pointer", fontFamily: "inherit" }}>✓</button>
            </span>
          ) : (
            <button onClick={() => { setEditingTarget(true); setTargetInput(String(target)); }} style={{ fontSize: 14, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
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
              <div style={{ position: "absolute", bottom: targetH + 14, left: 0, right: 0, borderTop: `1px dashed ${T.border}` }} />
              <div style={{
                width: "100%", borderRadius: "3px 3px 0 0",
                height: Math.max(barH, w.count > 0 ? 4 : 0),
                background: w.isCurrent
                  ? (atTarget ? T.success : T.accent)
                  : (atTarget ? T.successFaded : T.accentBg),
                transition: "height 0.2s",
                marginTop: "auto",
              }} />
              <div style={{ fontSize: 9, color: w.isCurrent ? T.muted : T.borderInput, whiteSpace: "nowrap", lineHeight: 1 }}>
                {w.isCurrent ? "now" : w.label.replace(/\w+ /, "")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── OUTREACH SPRINT (Stage 3) ────────────────────────────────────────────────
// Compact top-N priority outreach list with ✓ Sent button that logs a daily action.
// Used inside MorningLaunchpad. The full list at the bottom of the tab stays as-is.
const OUTREACH_SENT_KEY_PREFIX = "chase_js_outreach_sent_";

function loadSentToday(todayStr) {
  try {
    const raw = localStorage.getItem(OUTREACH_SENT_KEY_PREFIX + todayStr);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSentToday(todayStr, set) {
  try {
    localStorage.setItem(OUTREACH_SENT_KEY_PREFIX + todayStr, JSON.stringify([...set]));
  } catch { /* quota / privacy mode */ }
}

function OutreachSprint({ contacts, applications, addDailyAction, setContactModal, setAppModal, setTab, showError, maxItems = 3 }) {
  const todayStr = today();
  const list = useMemo(
    () => buildOutreachPriorityList(contacts || [], applications || []).slice(0, maxItems),
    [contacts, applications, maxItems]
  );
  const [sent, setSent] = useState(() => loadSentToday(todayStr));

  async function copyPrompt(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      showError?.("Could not copy prompt — copy manually from Contacts tab");
    }
  }

  function markSent(contact) {
    if (sent.has(contact.id)) return;
    const next = new Set(sent);
    next.add(contact.id);
    setSent(next);
    saveSentToday(todayStr, next);
    const noteName = contact.name || "contact";
    const noteCo = contact.company ? ` at ${contact.company}` : "";
    addDailyAction("outreach", `Messaged ${noteName}${noteCo}`);
  }

  if (list.length === 0) {
    return (
      <div style={{ padding: "10px 14px", fontSize: 14, color: T.muted, lineHeight: 1.55 }}>
        No priority outreach yet — add contacts in the Contacts tab or use the discovery targets below.
      </div>
    );
  }

  return (
    <div style={{ padding: "0 8px 6px" }}>
      <div style={s.outreachList}>
        {list.map(item => {
          const isSent = sent.has(item.contact.id);
          return (
            <div
              key={item.id}
              style={{
                ...s.outreachItem,
                borderLeft: `3px solid ${item.tone.color}`,
                ...(isSent ? s.outreachSentRow : {}),
              }}
            >
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
                <button
                  style={isSent ? s.outreachBtnSent : s.outreachBtnSecondary}
                  onClick={() => markSent(item.contact)}
                  disabled={isSent}
                >
                  {isSent ? "✓ Sent" : "✓ Mark Sent"}
                </button>
                <button style={s.outreachBtnSecondary} onClick={() => setContactModal({ mode: "edit", contact: { ...item.contact } })}>Edit</button>
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
          );
        })}
      </div>
    </div>
  );
}

// ── MORNING LAUNCHPAD (Option E) ─────────────────────────────────────────────
// Soft-gated 3-stage daily flow: Discover → Apply → Outreach. ~80 min total.
// Reuses DiscoverySprint, TodaysQueue, OutreachSprint as stage bodies. Derives
// stage state from data (no new persistence beyond per-day "sent" Set).
function MorningLaunchpad({
  applications, contacts, dailyActions, addDailyAction,
  setAppModal, setApplyWizard, setContactModal, setTab,
  setKitApp, setResumeTab, saveApp, showError,
}) {
  const progress = useMemo(
    () => getLaunchpadProgress(applications || [], dailyActions || []),
    [applications, dailyActions]
  );
  const [override, setOverride] = useState(null); // user-clicked stage key, null = use activeKey

  const activeKey = override || progress.activeKey;

  function toggleStage(key) {
    setOverride(prev => (prev === key ? null : key));
  }

  if (progress.isSunday) {
    return (
      <div style={s.launchpad}>
        <div style={s.launchpadHead}>
          <div style={s.launchpadTitleWrap}>
            <div style={s.launchpadTitle}>
              <span>🚀</span>
              <span>Morning Launchpad</span>
            </div>
            <div style={s.launchpadSub}>Sunday — rest day</div>
          </div>
        </div>
        <div style={s.launchpadRest}>
          <div style={s.launchpadRestTitle}>🛌 Rest day</div>
          No floor today. Recharge — Reese and Buzz need a dad with gas in the tank tomorrow.
        </div>
      </div>
    );
  }

  return (
    <div style={s.launchpad}>
      <div style={s.launchpadHead}>
        <div style={s.launchpadTitleWrap}>
          <div style={s.launchpadTitle}>
            <span>🚀</span>
            <span>Morning Launchpad</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: T.muted, letterSpacing: "0.05em" }}>
              ~{progress.totalMinutes} min
            </span>
          </div>
          <div style={s.launchpadSub}>
            {progress.allDone ? "Day cleared — anything past here is bonus." : "Discover → Apply → Outreach. One stage at a time."}
          </div>
        </div>
        <div style={s.launchpadStripe}>
          {progress.stages.map(st => {
            const isActive = !progress.allDone && st.key === activeKey;
            return (
              <span
                key={st.key}
                title={`${st.label} · ${st.doneLabel}`}
                style={{
                  ...s.launchpadDot,
                  ...(st.done ? s.launchpadDotDone : {}),
                  ...(isActive ? s.launchpadDotActive : {}),
                }}
              />
            );
          })}
          {progress.allDone && <span style={s.launchpadCleared}>✓ Day cleared</span>}
        </div>
      </div>

      {progress.stages.map(st => {
        const isActive = st.key === activeKey;
        const stageStyle = {
          ...s.launchpadStage,
          ...(isActive ? s.launchpadStageActive : {}),
          ...(st.done && !isActive ? s.launchpadStageDone : {}),
        };
        const badgeStyle = {
          ...s.launchpadStageBadge,
          ...(isActive ? s.launchpadStageBadgeActive : {}),
          ...(st.done && !isActive ? s.launchpadStageBadgeDone : {}),
        };
        const metaStyle = { ...s.launchpadStageMeta, ...(st.done ? s.launchpadStageMetaDone : {}) };

        return (
          <div key={st.key} style={stageStyle}>
            <div style={s.launchpadStageHeader} onClick={() => toggleStage(st.key)}>
              <div style={s.launchpadStageLeft}>
                <span style={badgeStyle}>{st.done ? "✓" : st.emoji}</span>
                <div>
                  <div style={s.launchpadStageTitle}>{st.label}</div>
                  <div style={metaStyle}>
                    {st.done ? `${st.doneLabel} · ${st.minutes} min` : `${st.goalLabel} · ${st.minutes} min`}
                  </div>
                </div>
              </div>
              <span style={{ color: T.muted, fontSize: 14 }}>{isActive ? "▲" : "▼"}</span>
            </div>
            {isActive && (
              <div style={s.launchpadStageBody}>
                {st.key === "discover" && <DiscoverySprint setAppModal={setAppModal} />}
                {st.key === "apply" && (
                  <TodaysQueue
                    applications={applications}
                    dailyActions={dailyActions}
                    setKitApp={setKitApp}
                    setResumeTab={setResumeTab}
                    setTab={setTab}
                    saveApp={saveApp}
                    setAppModal={setAppModal}
                    setApplyWizard={setApplyWizard}
                  />
                )}
                {st.key === "outreach" && (
                  <OutreachSprint
                    contacts={contacts}
                    applications={applications}
                    addDailyAction={addDailyAction}
                    setContactModal={setContactModal}
                    setAppModal={setAppModal}
                    setTab={setTab}
                    showError={showError}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FocusTab({
  expandedBlock, setExpandedBlock, completedBlocks, setCompletedBlocks, todayDone,
  applications, contacts, dailyActions, addDailyAction, removeDailyAction,
  setAppModal, setPrepModal, setContactModal, setTab, showError,
  profile, saveProfile,
  wins, addWin, removeWin,
  setKitApp, setResumeTab, saveApp,
  setApplyWizard,
  inbox = [], inboxHandlers = null,
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
        {/* ── Zone 1: MORNING ROUTINE ────────────────────── */}
        <div style={s.zoneContainer}>
          <div style={s.zoneLabel}>Morning routine</div>

          <MorningLaunchpad
            applications={applications}
            contacts={contacts}
            dailyActions={dailyActions}
            addDailyAction={addDailyAction}
            setAppModal={setAppModal}
            setApplyWizard={setApplyWizard}
            setContactModal={setContactModal}
            setTab={setTab}
            setKitApp={setKitApp}
            setResumeTab={setResumeTab}
            saveApp={saveApp}
            showError={showError}
          />

          {inboxHandlers && (
            <InboxPanel
              inbox={inbox}
              applications={applications}
              handlers={inboxHandlers}
              showError={showError}
            />
          )}

          <DailyActionCounter
            dailyActions={dailyActions}
            addDailyAction={addDailyAction}
            removeDailyAction={removeDailyAction}
          />
        </div>

        {/* ── Zone 3: SIGNALS (2-column grid) ────────────── */}
        <div style={s.zoneContainer}>
          <div style={s.zoneLabel}>Signals</div>
          <div style={s.twoCol}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <VelocityDashboard
                applications={applications}
                profile={profile}
                saveProfile={saveProfile}
              />
              <DirectionSplit applications={applications} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <WinsLog wins={wins} addWin={addWin} removeWin={removeWin} />
              <TargetCompanyBoard
                applications={applications}
                contacts={contacts}
                setAppModal={setAppModal}
                setContactModal={setContactModal}
              />
            </div>
          </div>
        </div>

        {/* ── Zone 4: TONIGHT'S PLAN ─────────────────────── */}
        <div style={s.zoneContainer}>
          <div style={s.zoneLabel}>Tonight's plan</div>

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

          <div style={s.aqSection}>
            <div style={s.aqHeader}>
              <span style={s.aqTitle}>Action Queue</span>
              {queue.length > 0 && <span style={s.aqBadge}>{queue.length}</span>}
            </div>
            {queue.length === 0 ? (
              <div style={s.aqEmpty}>You're all caught up -- no overdue tasks or pending follow-ups.</div>
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

          <div style={s.outreachSection}>
            <div style={s.outreachHeader}>
              <span style={s.outreachTitle}>Who should I message today?</span>
              {outreachList.length > 0 && <span style={s.outreachCountBadge}>{outreachList.length}</span>}
            </div>

            {outreachList.length === 0 ? (
              <div style={s.outreachEmpty}>No priority outreach from your contacts yet. Add contacts or use the discovery targets below.</div>
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

            <OutreachDiscovery
              applications={applications}
              contacts={contacts}
              setContactModal={setContactModal}
            />
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
                      <span style={{ color: T.muted, fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
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
                        <span style={{ color: T.resourceAmber }}>ADHD tip:</span> {block.adhd}
                      </div>
                      <button
                        style={{ ...s.btnPrimary, ...(isDone ? { background: T.successBorder } : {}), marginTop: 12 }}
                        onClick={() => {
                          setCompletedBlocks(prev => ({ ...prev, [block.id]: !isDone }));
                          if (!isDone) setExpandedBlock(null);
                        }}
                      >
                        {isDone ? "Completed -- undo" : "Mark done"}
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
              ["Mon", "Research block -- 1 company deep dive"],
              ["Tue", "Application block -- 1 tailored application"],
              ["Wed", "Skill building -- cert or course module"],
              ["Thu", "Networking block -- 2 LinkedIn connections"],
              ["Fri", "Follow-up block -- check pipeline, send follow-ups"],
              ["Sat", "Optional -- only if you have energy"],
              ["Sun", "Weekly review -- 15 min in Sunsama only"],
            ].map(([day, task]) => (
              <div key={day} style={s.weekRow}>
                <span style={s.weekDay}>{day}</span>
                <span style={s.weekTask}>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
