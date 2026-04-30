import React, { useMemo, useState } from "react";
import { T } from "../tokens";
import {
  s, today, daysSinceLayoff, DAILY_MINIMUMS, STAGES, STAGE_COLORS,
  KASSIE_EXCERPTS, getLaunchpadProgress, buildCompanyBoard,
  isInboxPending, nextStepUrgency, prepSectionsHasContent, WIN_TYPES,
} from "../constants";

const KASSIE_DISMISS_KEY = "chase_js_kassie_dismiss_v1";

// ── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ dayN, appsToday, appsTarget, outreachToday, outreachTarget, activeCount }) {
  const cards = [
    { value: dayN, label: "Days since layoff", color: T.foreground },
    { value: `${appsToday}`, fraction: `/ ${appsTarget}`, label: "Applications today", color: appsToday >= appsTarget ? T.success : T.accent },
    { value: `${outreachToday}`, fraction: `/ ${outreachTarget}`, label: "Outreach today", color: outreachToday >= outreachTarget ? T.success : T.accent },
    { value: activeCount, label: "Active pipeline", color: T.foreground },
  ];
  return (
    <div style={s.dashStatsGrid} className="dash-stats-grid">
      {cards.map((c, i) => (
        <div key={i} style={s.dashStatCard}>
          <div style={{ ...s.dashStatValue, color: c.color }}>
            {c.value}
            {c.fraction && <span style={{ fontSize: 18, color: T.muted, fontWeight: 400 }}> {c.fraction}</span>}
          </div>
          <div style={s.dashStatLabel}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Today's Progress (compact launchpad) ─────────────────────────────────────
function TodaysProgress({ applications, dailyActions }) {
  const { stages, allDone, isSunday } = getLaunchpadProgress(applications, dailyActions);

  if (isSunday) {
    return (
      <div style={s.dashPanelAccent}>
        <div style={s.dashPanelAccentStripe} />
        <div style={s.dashPanelTitle}>Today's progress</div>
        <div style={{ fontSize: 14, color: T.success, fontWeight: 600 }}>
          Sunday — rest day. Be with Reese and Buzz.
        </div>
      </div>
    );
  }

  return (
    <div style={s.dashPanelAccent}>
      <div style={s.dashPanelAccentStripe} />
      <div style={{ ...s.dashPanelTitle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Today's progress</span>
        {allDone && <span style={{ color: T.success, fontSize: 11, fontWeight: 700 }}>ALL DONE</span>}
      </div>
      {stages.map(st => {
        const pct = Math.min(st.current / st.target, 1) * 100;
        return (
          <div key={st.key} style={s.dashProgressRow}>
            <div style={s.dashProgressLabel}>
              {st.emoji} {st.label}
            </div>
            <div style={s.dashProgressTrack}>
              <div style={{ ...s.dashProgressFill, width: `${pct}%`, background: st.done ? T.success : T.accent }} />
            </div>
            <div style={{ ...s.dashProgressMeta, color: st.done ? T.success : T.muted }}>
              {st.done ? "✓" : st.doneLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Pipeline Health ──────────────────────────────────────────────────────────
function PipelineHealth({ applications }) {
  const stageCounts = useMemo(() => {
    const visible = STAGES.filter(st => st !== "Rejected" && st !== "Withdrawn");
    const counts = {};
    visible.forEach(st => { counts[st] = 0; });
    (applications || []).forEach(a => {
      if (counts[a.stage] !== undefined) counts[a.stage]++;
    });
    return visible.map(st => ({ stage: st, count: counts[st], color: STAGE_COLORS[st] }));
  }, [applications]);

  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  return (
    <div style={s.dashPanel}>
      <div style={s.dashPanelTitle}>Pipeline health</div>
      {stageCounts.map(({ stage, count, color }) => (
        <div key={stage} style={s.dashFunnelRow}>
          <div style={{ ...s.dashFunnelDot, background: color }} />
          <div style={s.dashFunnelLabel}>{stage}</div>
          <div style={s.dashFunnelBar}>
            <div style={{ ...s.dashFunnelFill, width: `${(count / maxCount) * 100}%`, background: color }} />
          </div>
          <div style={s.dashFunnelCount}>{count}</div>
        </div>
      ))}
    </div>
  );
}

// ── Kassie Card (moved from FocusTab) ────────────────────────────────────────
function KassieCard() {
  const todayStr = today();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(KASSIE_DISMISS_KEY) === todayStr; }
    catch { return false; }
  });
  const [open, setOpen] = useState(false);

  const excerpt = useMemo(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const doy = Math.floor(diff / 86400000);
    return KASSIE_EXCERPTS[doy % KASSIE_EXCERPTS.length];
  }, []);

  function dismiss() {
    try { localStorage.setItem(KASSIE_DISMISS_KEY, todayStr); } catch {}
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div style={{
      background: T.kassieBg, border: `1px solid ${T.kassieBorder}`, borderRadius: 12,
      padding: "14px 16px", marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.kassieLabel, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
            From Kassie — who you're doing this for
          </div>
          <div style={{ fontSize: 13, color: T.kassieText, fontStyle: "italic", lineHeight: 1.5 }}>
            "{excerpt}"
          </div>
          {open && (
            <div style={{ fontSize: 11, color: T.kassieSubtle, marginTop: 8, lineHeight: 1.55 }}>
              Full letter lives at <code style={{ background: T.kassieCodeBg, padding: "1px 5px", borderRadius: 3 }}>chase/identity/kassie-notes.md</code>.
              Read it when the urgency slips. Not guilt — signal.
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: "none", border: "none", color: T.kassieSubtle, cursor: "pointer", fontSize: 11 }}
          >{open ? "hide" : "more"}</button>
          <button
            onClick={dismiss}
            style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 11 }}
          >dismiss</button>
        </div>
      </div>
    </div>
  );
}

// ── Target Company Coverage ──────────────────────────────────────────────────
function CompanyCoverage({ applications, contacts, setTab }) {
  const board = useMemo(() => buildCompanyBoard(applications, contacts), [applications, contacts]);
  const covered = board.filter(r => r.app && r.contact).length;
  const partial = board.filter(r => (r.app || r.contact) && !(r.app && r.contact)).length;

  return (
    <div style={s.dashLowerCard}>
      <div style={s.dashLowerTitle}>
        <span>Target companies</span>
        <span style={{ fontSize: 11, color: covered >= 10 ? T.success : T.muted, fontWeight: 400 }}>
          {covered}/{board.length} covered
        </span>
      </div>
      <div style={s.dashCompanyGrid}>
        {board.map(r => {
          const dotColor = (r.app && r.contact) ? T.success : (r.app || r.contact) ? T.warning : T.border;
          return (
            <div key={r.company} style={s.dashCompanyItem}>
              <span style={{ ...s.dashDot, background: dotColor }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.company}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 11, color: T.muted }}>
        <span><span style={{ ...s.dashDot, background: T.success, width: 8, height: 8 }} /> App + contact</span>
        <span><span style={{ ...s.dashDot, background: T.warning, width: 8, height: 8 }} /> Partial</span>
        <span><span style={{ ...s.dashDot, background: T.border, width: 8, height: 8 }} /> None</span>
      </div>
      <button style={{ ...s.dashLink, marginTop: 6 }} onClick={() => setTab("focus")}>View full board →</button>
    </div>
  );
}

// ── Recent Wins ──────────────────────────────────────────────────────────────
function RecentWins({ wins, setTab }) {
  const recent = useMemo(() =>
    [...(wins || [])].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5),
    [wins]
  );

  const typeColor = (type) => {
    const map = { response: T.success, progression: T.accent, daily_target: T.warning, manual: T.muted };
    return map[type] || T.muted;
  };
  const typeBg = (type) => {
    const map = { response: T.successBg, progression: T.accentBg, daily_target: T.warningBg, manual: T.cardSubtle };
    return map[type] || T.cardSubtle;
  };

  return (
    <div style={s.dashLowerCard}>
      <div style={s.dashLowerTitle}>
        <span>Recent wins</span>
        <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>{(wins || []).length} total</span>
      </div>
      {recent.length === 0 ? (
        <div style={{ fontSize: 13, color: T.muted }}>No wins logged yet</div>
      ) : (
        recent.map((w, i) => (
          <div key={w.id || i} style={{ ...s.dashWinItem, ...(i === recent.length - 1 ? { borderBottom: "none" } : {}) }}>
            <span style={{ ...s.dashWinBadge, color: typeColor(w.type), background: typeBg(w.type) }}>
              {(WIN_TYPES.find(t => t.value === w.type) || {}).label || w.type || "Win"}
            </span>
            <span style={s.dashWinTitle}>{w.title || w.note || "—"}</span>
            <span style={s.dashWinDate}>{w.date || ""}</span>
          </div>
        ))
      )}
      <button style={{ ...s.dashLink, marginTop: 6 }} onClick={() => setTab("focus")}>View all wins →</button>
    </div>
  );
}

// ── Inbox Preview ────────────────────────────────────────────────────────────
function InboxPreview({ inbox, setTab }) {
  const pending = useMemo(() => {
    const now = Date.now();
    return (inbox || []).filter(item => isInboxPending(item, now));
  }, [inbox]);

  return (
    <div style={s.dashLowerCard}>
      <div style={s.dashLowerTitle}>
        <span>Inbox</span>
        {pending.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, background: T.accent, color: T.foreground, borderRadius: 10, padding: "1px 7px" }}>
            {pending.length}
          </span>
        )}
      </div>
      {(inbox || []).length === 0 ? (
        <div style={{ fontSize: 13, color: T.muted }}>Connect Gmail on the Focus tab to see notifications</div>
      ) : pending.length === 0 ? (
        <div style={{ fontSize: 13, color: T.success }}>All caught up</div>
      ) : (
        pending.slice(0, 3).map((item, i) => (
          <div key={item.id || i} style={{ fontSize: 13, color: T.foreground, padding: "4px 0", borderBottom: i < 2 && i < pending.length - 1 ? `1px solid ${T.border}` : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <span style={{ color: T.muted, marginRight: 6 }}>
              {item.kind === "recruiter" ? "📧" : item.kind === "interview_invite" ? "📅" : item.kind === "ats_update" ? "📋" : "💼"}
            </span>
            {item.subject || item.from || "New notification"}
          </div>
        ))
      )}
      {pending.length > 3 && (
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>+{pending.length - 3} more</div>
      )}
      <button style={{ ...s.dashLink, marginTop: 6 }} onClick={() => setTab("focus")}>
        {(inbox || []).length === 0 ? "Set up inbox →" : "View all →"}
      </button>
    </div>
  );
}

// ── Action Queue Summary ─────────────────────────────────────────────────────
function ActionQueueSummary({ applications, contacts, setTab }) {
  const counts = useMemo(() => {
    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    let overdue = 0, needPrep = 0, followUp = 0, stale = 0;

    (applications || []).forEach(app => {
      if (["Rejected", "Withdrawn"].includes(app.stage)) return;
      if (app.nextStepDate) {
        const due = new Date(app.nextStepDate + "T00:00:00");
        if (Math.round((due - todayDate) / 86400000) <= 0) overdue++;
      }
      if (["Phone Screen", "Interview", "Final Round"].includes(app.stage) && !prepSectionsHasContent(app.prepSections, app.prepNotes)) {
        needPrep++;
      }
      if (app.stage === "Applied" && app.appliedDate) {
        const days = Math.round((todayDate - new Date(app.appliedDate + "T00:00:00")) / 86400000);
        if (days >= 14) stale++;
      }
    });

    (contacts || []).forEach(c => {
      if (c.outreachStatus === "sent" && c.outreachDate) {
        const days = Math.round((todayDate - new Date(c.outreachDate + "T00:00:00")) / 86400000);
        if (days >= 5) followUp++;
      }
    });

    return { overdue, needPrep, followUp, stale };
  }, [applications, contacts]);

  const total = counts.overdue + counts.needPrep + counts.followUp + counts.stale;
  const rows = [
    { label: "Overdue next steps", count: counts.overdue, color: T.danger },
    { label: "Need prep notes", count: counts.needPrep, color: T.warning },
    { label: "Follow-ups due", count: counts.followUp, color: T.accent },
    { label: "Stale applications", count: counts.stale, color: T.muted },
  ];

  return (
    <div style={s.dashLowerCard}>
      <div style={s.dashLowerTitle}>
        <span>Action queue</span>
        {total > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, background: T.danger, color: T.foreground, borderRadius: 10, padding: "1px 7px" }}>
            {total}
          </span>
        )}
      </div>
      {total === 0 ? (
        <div style={{ fontSize: 13, color: T.success }}>All clear — no urgent actions</div>
      ) : (
        rows.filter(r => r.count > 0).map(r => (
          <div key={r.label} style={s.dashQueueRow}>
            <div style={{ ...s.dashQueueDot, background: r.color }} />
            <div style={s.dashQueueLabel}>{r.label}</div>
            <div style={{ ...s.dashQueueCount, color: r.color }}>{r.count}</div>
          </div>
        ))
      )}
      <button style={{ ...s.dashLink, marginTop: 6 }} onClick={() => setTab("focus")}>View details →</button>
    </div>
  );
}

// ── Dashboard Tab ────────────────────────────────────────────────────────────
export default function DashboardTab({ applications, contacts, dailyActions, wins, inbox, setTab }) {
  const todayStr = today();
  const todays = useMemo(() => (dailyActions || []).filter(a => a.date === todayStr), [dailyActions, todayStr]);
  const appsToday = todays.filter(a => a.type === "application").length;
  const outreachToday = todays.filter(a => a.type === "outreach").length;
  const dayN = daysSinceLayoff();
  const activeCount = (applications || []).filter(a => !["Rejected", "Withdrawn", "Offer"].includes(a.stage)).length;

  return (
    <div style={s.content}>
      <StatsBar
        dayN={dayN}
        appsToday={appsToday} appsTarget={DAILY_MINIMUMS.applications}
        outreachToday={outreachToday} outreachTarget={DAILY_MINIMUMS.outreach}
        activeCount={activeCount}
      />

      <div style={s.dashPanelRow}>
        <TodaysProgress applications={applications} dailyActions={dailyActions} />
        <PipelineHealth applications={applications} />
      </div>

      <KassieCard />

      <div style={s.dashLowerGrid}>
        <CompanyCoverage applications={applications} contacts={contacts} setTab={setTab} />
        <RecentWins wins={wins} setTab={setTab} />
        <InboxPreview inbox={inbox} setTab={setTab} />
        <ActionQueueSummary applications={applications} contacts={contacts} setTab={setTab} />
      </div>
    </div>
  );
}
