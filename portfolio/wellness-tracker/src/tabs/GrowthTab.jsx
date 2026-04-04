import React, { useState } from "react";
import { T } from "../theme";
import { JOB_TRACKER_URL } from "../theme";

// ══════════════════════════════════════════════════════════════════════════
// GROWTH TAB
// ══════════════════════════════════════════════════════════════════════════

const GROWTH_AREAS = [
  { id: "gmat",   name: "GMAT prep",          tag: "Test prep",  icon: "📐",
    milestones: ["Quant practice","Verbal practice","Data insights section","Full practice test","Error log reviewed","New concept mastered","OG problems done"] },
  { id: "job",    name: "Job search",          tag: "Career",     icon: "💼",
    milestones: ["Application submitted","Networking outreach","Phone / video interview","Interview prep","LinkedIn updated","Referral conversation","Company / role researched"] },
  { id: "ai",     name: "AI learning",         tag: "Learning",   icon: "🤖",
    milestones: ["Course lesson done","Built something","Read article / paper","Watched tutorial","Applied to a project","Shared a learning"] },
  { id: "pm",     name: "Project mgmt (PMP)",  tag: "Learning",   icon: "📋",
    milestones: ["Course lesson done","Case study reviewed","Framework practiced","Quiz or assessment","Notes reviewed","Applied to real scenario"] },
  { id: "claude", name: "Learning Claude",     tag: "AI / Tools", icon: "⚡",
    milestones: ["Prompt engineering practiced","Built or improved an artifact","Learned a new capability","Read docs / release notes","Used Claude in a real workflow","Explored a new use case"] },
  { id: "bom",    name: "Book of Mormon",      tag: "Scripture",  icon: "📖",
    milestones: ["Read at least one verse","Read a full chapter","Read multiple chapters","Pondered / journaled","Marked a meaningful passage","Prayed about what I read"] },
  { id: "cfm",    name: "Come Follow Me",      tag: "Scripture",  icon: "🙏",
    milestones: ["Read this week's lesson","Read companion scriptures","Pondered / journaled","Family study done","Personal prayer after","Shared insight with family"] },
];

const GROWTH_BG = [
  { id: "quiet",   label: "🤫 Quiet" },
  { id: "music",   label: "🎵 Music" },
  { id: "endel",   label: "🌿 Endel" },
  { id: "podcast", label: "🎙 Podcast" },
  { id: "youtube", label: "▶️ YouTube" },
  { id: "other",   label: "🔊 Other" },
];

function gToday() { return new Date().toISOString().split("T")[0]; }
function gPrev(iso) { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0]; }
function gFmt(iso) { return new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function gStreak(logs, id) {
  const days = [...new Set(logs.filter(l => l.area === id).map(l => l.date))].sort().reverse();
  if (!days.length) return 0;
  let s = 0, cur = gToday();
  for (const d of days) {
    if (d === cur) { s++; cur = gPrev(cur); }
    else if (d === gPrev(cur)) { s++; cur = gPrev(cur); }
    else break;
  }
  return s;
}
function gMins(logs, id) { return logs.filter(l => !id || l.area === id).reduce((s, l) => s + (l.mins || 0), 0); }
function gDoneToday(logs, id) { return logs.some(l => l.area === id && l.date === gToday()); }

function GrowthBadge({ n }) {
  if (n === 0) return <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: T.faint, color: T.muted }}>No streak</span>;
  if (n < 3)   return <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: T.accentLight, color: T.accent }}>{n} day streak</span>;
  if (n < 7)   return <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: T.yellowLight, color: T.yellow }}>{n} day streak 🔥</span>;
  return               <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: T.accentLight, color: "#5DCAA5" }}>{n} day streak ⚡</span>;
}

function getJobPipelineSummary() {
  try {
    const raw = localStorage.getItem("chase_job_search_v1");
    if (!raw) return null;
    const data = JSON.parse(raw);
    const apps = data.applications || [];
    const active = apps.filter(a => !["Rejected","Withdrawn"].includes(a.stage));
    const today = new Date();
    const overdue = active.filter(a => {
      if (!a.appliedDate) return false;
      const applied = new Date(a.appliedDate);
      const days = Math.floor((today - applied) / 86400000);
      return days >= 7 && a.stage === "Applied";
    });
    return { active: active.length, overdue: overdue.length };
  } catch { return null; }
}

function GrowthAreaCard({ area, logs, onClick }) {
  const streak = gStreak(logs, area.id);
  const mins = gMins(logs, area.id);
  const sessions = logs.filter(l => l.area === area.id).length;
  const done = gDoneToday(logs, area.id);
  const jobSummary = area.id === "job" ? getJobPipelineSummary() : null;

  return (
    <div onClick={onClick} style={{
      background: T.surface, border: `1px solid ${done ? T.accent : T.border}`,
      borderRadius: 12, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden",
      WebkitTapHighlightColor: "transparent",
    }}>
      {done && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: T.accent }} />}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: T.muted, textTransform: "uppercase", marginBottom: 5 }}>{area.tag}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>{area.icon} {area.name}</div>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>{sessions} session{sessions !== 1 ? "s" : ""} · {(mins / 60).toFixed(1)}h</div>
      <GrowthBadge n={streak} />
      {area.id === "job" && jobSummary && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11, background: T.blueLight, color: T.blue, borderRadius: 100, padding: "2px 8px" }}>
              {jobSummary.active} active
            </span>
            {jobSummary.overdue > 0 && (
              <span style={{ fontSize: 11, background: T.warnLight, color: T.warn, borderRadius: 100, padding: "2px 8px" }}>
                {jobSummary.overdue} follow-up{jobSummary.overdue !== 1 ? "s" : ""} due
              </span>
            )}
          </div>
          <a
            href={JOB_TRACKER_URL}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "block", textAlign: "center", fontSize: 12, fontWeight: 600,
              color: T.blue, background: T.blueLight,
              borderRadius: 8, padding: "6px 10px", textDecoration: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Open Job Tracker →
          </a>
        </div>
      )}
    </div>
  );
}

function GrowthWeekChart({ logs }) {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  const labels = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const mins = days.map(d => logs.filter(l => l.date === d).reduce((s, l) => s + l.mins, 0));
  const maxM = Math.max(1, ...mins);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56, marginBottom: 20 }}>
      {days.map((d, i) => {
        const h = Math.max(3, Math.round((mins[i] / maxM) * 40));
        const dow = new Date(d + "T12:00:00").getDay();
        return (
          <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: mins[i] > 0 ? T.accent : T.faint, height: h }} />
            <div style={{ fontSize: 10, color: T.muted }}>{labels[dow]}</div>
          </div>
        );
      })}
    </div>
  );
}

function GrowthLogPanel({ initialArea, onSave, onCancel }) {
  const [area, setArea] = useState(initialArea || GROWTH_AREAS[0].id);
  const [mins, setMins] = useState(30);
  const [note, setNote] = useState("");
  const [selMs, setSelMs] = useState([]);
  const [selBg, setSelBg] = useState([]);
  const areaObj = GROWTH_AREAS.find(a => a.id === area);
  const chip = (sel) => ({
    fontSize: 12, padding: "5px 11px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit",
    border: `1px solid ${sel ? T.accent : T.border}`,
    background: sel ? T.accentLight : T.faint,
    color: sel ? T.accent : T.muted,
    WebkitTapHighlightColor: "transparent",
  });
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14 }}>Log a session</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 6 }}>Area</div>
        <select value={area} onChange={e => { setArea(e.target.value); setSelMs([]); }}
          style={{ width: "100%", fontSize: 14, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 11px", background: T.faint, color: T.text, fontFamily: "inherit" }}>
          {GROWTH_AREAS.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 6 }}>Minutes</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input type="range" min="5" max="180" step="5" value={mins} onChange={e => setMins(Number(e.target.value))}
            style={{ flex: 1, accentColor: T.accent }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, minWidth: 36, textAlign: "right" }}>{mins}m</span>
        </div>
      </div>
      {areaObj && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 6 }}>What did you do? (optional)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {areaObj.milestones.map(m => (
              <button key={m} onClick={() => setSelMs(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])} style={chip(selMs.includes(m))}>{m}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 6 }}>Background (optional)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GROWTH_BG.map(o => (
            <button key={o.id} onClick={() => setSelBg(p => p.includes(o.id) ? p.filter(x => x !== o.id) : [...p, o.id])} style={chip(selBg.includes(o.id))}>{o.label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 6 }}>Note (optional)</div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What did you cover or learn?"
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", minHeight: 60 }} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
        <button onClick={onCancel} style={{ fontSize: 13, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: "8px 12px", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onSave({ area, mins, note: note.trim(), milestones: selMs, bg: selBg, date: gToday(), ts: Date.now() })}
          style={{ fontSize: 13, fontWeight: 700, background: T.accent, color: "#fff", border: "none", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontFamily: "inherit" }}>
          Save session ✓
        </button>
      </div>
    </div>
  );
}

function GrowthHistorySection({ logs }) {
  const [activeArea, setActiveArea] = useState("all");
  let filtered = [...logs].reverse();
  if (activeArea !== "all") filtered = filtered.filter(l => l.area === activeArea);
  filtered = filtered.slice(0, 30);
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>Recent sessions</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[{ id: "all", name: "All", icon: "" }, ...GROWTH_AREAS].map(a => (
          <button key={a.id} onClick={() => setActiveArea(a.id)} style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit",
            border: `1px solid ${activeArea === a.id ? T.border : "transparent"}`,
            background: activeArea === a.id ? T.surface : "transparent",
            color: activeArea === a.id ? T.text : T.muted,
            fontWeight: activeArea === a.id ? 600 : 400,
          }}>{a.icon ? `${a.icon} ` : ""}{a.name}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ fontSize: 13, color: T.muted, padding: "20px 0", textAlign: "center" }}>No sessions yet — tap + Log session to start.</div>
      ) : filtered.map((l, i) => {
        const area = GROWTH_AREAS.find(a => a.id === l.area);
        return (
          <div key={l.ts || i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: (l.note || (l.milestones && l.milestones.length > 0)) ? 6 : 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{area ? `${area.icon} ${area.name}` : l.area}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{l.mins}m</span>
                <span style={{ fontSize: 11, color: T.muted }}>{gFmt(l.date)}</span>
              </div>
            </div>
            {l.note ? <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{l.note}</div> : null}
            {l.milestones && l.milestones.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                {l.milestones.map(m => (
                  <span key={m} style={{ fontSize: 11, background: T.accentLight, color: T.accent, borderRadius: 100, padding: "2px 8px" }}>{m}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GrowthTab({ growthLogs, setGrowthLogs }) {
  const [logOpen, setLogOpen] = useState(false);
  const [logArea, setLogArea] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  function openLog(id) { setLogArea(id); setLogOpen(true); }
  function closeLog() { setLogOpen(false); setLogArea(null); }
  function handleSave(entry) {
    setGrowthLogs(prev => [...prev, entry]);
    closeLog();
    setToast({ visible: true, message: "Session saved ✓" });
    setTimeout(() => setToast({ visible: false, message: "" }), 2200);
  }

  const totalSessions = growthLogs.length;
  const totalHours = (gMins(growthLogs, null) / 60).toFixed(1);
  const activeStreaks = GROWTH_AREAS.filter(a => gStreak(growthLogs, a.id) >= 2).length;

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {[
          { label: "Sessions", value: totalSessions, sub: "all time" },
          { label: "Hours",    value: totalHours,    sub: "all time" },
          { label: "Streaks",  value: activeStreaks, sub: "active (2+ days)" },
        ].map(s => (
          <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 12px" }}>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Week chart */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>This week</div>
      <GrowthWeekChart logs={growthLogs} />

      {/* Log button */}
      <button onClick={() => openLog(null)} style={{
        width: "100%", padding: "12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
        background: T.accent, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, marginBottom: 18,
      }}>+ Log session</button>

      {/* Log panel */}
      {logOpen && <GrowthLogPanel initialArea={logArea} onSave={handleSave} onCancel={closeLog} />}

      {/* Areas grid */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 10 }}>Areas</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        {GROWTH_AREAS.map(a => (
          <GrowthAreaCard key={a.id} area={a} logs={growthLogs} onClick={() => openLog(a.id)} />
        ))}
      </div>

      {/* History */}
      <GrowthHistorySection logs={growthLogs} />

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 90, left: "50%",
        transform: `translateX(-50%) translateY(${toast.visible ? 0 : 12}px)`,
        background: T.accent, color: "#fff", fontSize: 13, fontWeight: 600,
        padding: "9px 18px", borderRadius: 100,
        opacity: toast.visible ? 1 : 0, transition: "all 0.25s",
        pointerEvents: "none", whiteSpace: "nowrap", zIndex: 99,
      }}>{toast.message}</div>

    </div>
  );
}

export default GrowthTab;
