import React, { useState, useEffect, useRef } from "react";

// ── STORAGE ────────────────────────────────────────────────────────────────
const STORE = "chase_growth_v1";
const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || { logs: [] }; } catch { return { logs: [] }; } };
const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {} };

// ── THEME ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#F7F7F4",
  surface: "#FFFFFF",
  surface2: "#F0EFEB",
  border: "#E8E4DC",
  borderMd: "#D0CBC0",
  text: "#1A1A18",
  text2: "#6B6B64",
  text3: "#A0A098",
  greenBg: "#EAF3DE", greenText: "#3B6D11",
  amberBg: "#FAEEDA", amberText: "#854F0B",
  tealBg: "#E1F5EE", tealText: "#0F6E56", tealBd: "#5DCAA5",
};

// ── AREAS ──────────────────────────────────────────────────────────────────
const AREAS = [
  {
    id: "cfm", name: "Come Follow Me", tag: "Scripture",
    milestones: [
      "Read this week's lesson",
      "Read companion scriptures",
      "Pondered / journaled",
      "Family study done",
      "Personal prayer after",
      "Shared insight with family",
      "Listened to podcast / discussion",
    ],
  },
  {
    id: "bom", name: "Book of Mormon", tag: "Scripture",
    milestones: [
      "Read at least one verse",
      "Read a full chapter",
      "Read multiple chapters",
      "Pondered / journaled",
      "Marked a meaningful passage",
      "Prayed about what I read",
      "Shared insight with family",
    ],
  },
  {
    id: "gmat", name: "GMAT prep", tag: "Test prep",
    milestones: [
      "Quant practice",
      "Verbal practice",
      "Data insights section",
      "Full practice test",
      "Error log reviewed",
      "New concept mastered",
      "OG problems done",
    ],
  },
  {
    id: "job", name: "Job search", tag: "Career",
    milestones: [
      "Application submitted",
      "Networking outreach",
      "Phone / video interview",
      "Interview prep",
      "LinkedIn updated",
      "Referral conversation",
      "Company / role researched",
    ],
  },
  {
    id: "ai", name: "AI learning", tag: "Learning",
    milestones: [
      "Course lesson done",
      "Built something",
      "Read article / paper",
      "Watched tutorial",
      "Applied to a project",
      "Shared a learning",
    ],
  },
  {
    id: "pm", name: "Project mgmt", tag: "Learning",
    milestones: [
      "Course lesson done",
      "Case study reviewed",
      "Framework practiced",
      "Quiz or assessment",
      "Notes reviewed",
      "Applied to real scenario",
    ],
  },
  {
    id: "claude", name: "Learning Claude", tag: "AI / Tools",
    milestones: [
      "Prompt engineering practiced",
      "Built or improved an artifact",
      "Learned a new capability",
      "Read docs / release notes",
      "Used Claude in a real workflow",
      "Explored a new use case",
      "Taught or shared a technique",
    ],
  },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split("T")[0]; }
function prevDay(iso) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}
function fmtDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function getStreak(logs, id) {
  const days = [...new Set(logs.filter(l => l.area === id).map(l => l.date))].sort().reverse();
  if (!days.length) return 0;
  let s = 0, cur = todayStr();
  for (const d of days) {
    if (d === cur) { s++; cur = prevDay(cur); }
    else if (d === prevDay(cur)) { s++; cur = prevDay(cur); }
    else break;
  }
  return s;
}
function totalMins(logs, id) {
  return logs.filter(l => !id || l.area === id).reduce((s, l) => s + (l.mins || 0), 0);
}
function hadToday(logs, id) {
  return logs.some(l => l.area === id && l.date === todayStr());
}
function streakCls(n) {
  if (n === 0) return { bg: T.surface2, color: T.text3 };
  if (n < 3) return { bg: T.greenBg, color: T.greenText };
  if (n < 7) return { bg: T.amberBg, color: T.amberText };
  return { bg: T.tealBg, color: T.tealText };
}
function streakLbl(n) {
  if (n === 0) return "No streak";
  if (n === 1) return "1 day";
  return `${n} day streak`;
}

// ── SMALL COMPONENTS ───────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.border}`,
      borderRadius: 12, padding: "13px 14px",
    }}>
      <div style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: T.text3, marginTop: 3 }}>{sub}</div>
    </div>
  );
}

function AreaCard({ area, logs, onClick }) {
  const streak = getStreak(logs, area.id);
  const mins = totalMins(logs, area.id);
  const sessions = logs.filter(l => l.area === area.id).length;
  const done = hadToday(logs, area.id);
  const sc = streakCls(streak);
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        border: `0.5px solid ${done ? T.tealBd : T.border}`,
        borderRadius: 12, padding: 15, cursor: "pointer",
        position: "relative", overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {done && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 2.5, background: T.tealBd,
        }} />
      )}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: T.text3, textTransform: "uppercase", marginBottom: 9 }}>
        {area.tag}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 3 }}>{area.name}</div>
      <div style={{ fontSize: 11, color: T.text2, marginBottom: 9 }}>
        {sessions} session{sessions !== 1 ? "s" : ""} · {(mins / 60).toFixed(1)}h
      </div>
      <span style={{
        display: "inline-block", fontSize: 11, fontWeight: 500,
        padding: "3px 9px", borderRadius: 100,
        background: sc.bg, color: sc.color,
      }}>
        {streakLbl(streak)}
      </span>
    </div>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12, padding: "5px 11px", borderRadius: 100,
        border: `0.5px solid ${selected ? T.tealBd : T.border}`,
        background: selected ? T.tealBg : T.surface2,
        color: selected ? T.tealText : T.text2,
        cursor: "pointer", fontFamily: "inherit",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}

function WeekChart({ logs }) {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  const labels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const mins = days.map(d => logs.filter(l => l.date === d).reduce((s, l) => s + l.mins, 0));
  const maxM = Math.max(1, ...mins);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64, marginBottom: 24 }}>
      {days.map((d, i) => {
        const h = Math.max(3, Math.round((mins[i] / maxM) * 46));
        const dow = new Date(d + "T12:00:00").getDay();
        return (
          <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: "100%", borderRadius: "3px 3px 0 0",
              background: mins[i] > 0 ? T.tealBd : T.surface2,
              height: h,
            }} />
            <div style={{ fontSize: 10, color: T.text3 }}>{labels[dow]}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── LOG PANEL ──────────────────────────────────────────────────────────────
const BG_OPTIONS = [
  { id: "nothing",  label: "🤫 Nothing / Quiet" },
  { id: "music",    label: "🎵 Music" },
  { id: "endel",    label: "🌿 Endel" },
  { id: "podcast",  label: "🎙 Podcast" },
  { id: "youtube",  label: "▶️ YouTube" },
  { id: "tv",       label: "📺 TV / Movie" },
  { id: "other",    label: "🔊 Other" },
];

function LogPanel({ initialArea, onSave, onCancel }) {
  const [area, setArea] = useState(initialArea || AREAS[0].id);
  const [mins, setMins] = useState(30);
  const [note, setNote] = useState("");
  const [selMs, setSelMs] = useState([]);
  const [selBg, setSelBg] = useState([]);

  const areaObj = AREAS.find(a => a.id === area);

  function toggleMs(m) {
    setSelMs(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }
  function toggleBg(id) {
    setSelBg(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function handleAreaChange(e) {
    setArea(e.target.value);
    setSelMs([]);
  }
  function handleSave() {
    onSave({ area, mins, note: note.trim(), milestones: selMs, bg: selBg, date: todayStr(), ts: Date.now() });
  }

  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.borderMd}`,
      borderRadius: 12, padding: 18, marginBottom: 22,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Log a session</div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Area</label>
        <select value={area} onChange={handleAreaChange} style={inputStyle}>
          {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Minutes</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="range" min="5" max="180" step="5" value={mins}
            onChange={e => setMins(Number(e.target.value))}
            style={{ flex: 1, accentColor: T.text }}
          />
          <span style={{ fontSize: 15, fontWeight: 600, minWidth: 36, textAlign: "right" }}>{mins}m</span>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Milestones (optional)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {areaObj.milestones.map(m => (
            <Chip key={m} label={m} selected={selMs.includes(m)} onClick={() => toggleMs(m)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Background (optional)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BG_OPTIONS.map(o => (
            <Chip key={o.id} label={o.label} selected={selBg.includes(o.id)} onClick={() => toggleBg(o.id)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 4 }}>
        <label style={labelStyle}>Note</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What did you cover or learn?"
          style={{ ...inputStyle, minHeight: 68, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18, paddingTop: 14, borderTop: `0.5px solid ${T.border}` }}>
        <button onClick={onCancel} style={{ fontSize: 14, color: T.text2, background: "none", border: "none", cursor: "pointer", padding: "8px 10px", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{
          fontSize: 14, fontWeight: 500, background: T.text, color: T.bg || "#fff",
          border: "none", borderRadius: 100, padding: "8px 20px", cursor: "pointer", fontFamily: "inherit",
        }}>
          Save
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600, color: "#6B6B64",
  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6,
};
const inputStyle = {
  width: "100%", fontSize: 15, border: "0.5px solid #D0CBC0",
  borderRadius: 8, padding: "9px 11px", background: "#F0EFEB",
  color: "#1A1A18", fontFamily: "inherit", appearance: "none", WebkitAppearance: "none",
};

// ── HISTORY ────────────────────────────────────────────────────────────────
function HistorySection({ logs }) {
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [{ id: "all", label: "All" }, ...AREAS.map(a => ({ id: a.id, label: a.name }))];
  let filtered = [...logs].reverse();
  if (activeTab !== "all") filtered = filtered.filter(l => l.area === activeTab);
  filtered = filtered.slice(0, 30);

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: T.text3, marginBottom: 11 }}>
        Recent sessions
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 13 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              fontSize: 13, padding: "5px 13px", borderRadius: 100,
              border: `0.5px solid ${activeTab === t.id ? T.borderMd : T.border}`,
              background: activeTab === t.id ? T.surface : "none",
              color: activeTab === t.id ? T.text : T.text2,
              fontWeight: activeTab === t.id ? 500 : 400,
              cursor: "pointer", fontFamily: "inherit",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ fontSize: 14, color: T.text3, padding: "20px 0 10px" }}>
            No sessions yet — tap "+ Log session" to start.
          </div>
        ) : filtered.map((l, i) => {
          const area = AREAS.find(a => a.id === l.area);
          return (
            <div key={l.ts || i} style={{
              background: T.surface, border: `0.5px solid ${T.border}`,
              borderRadius: 12, padding: "13px 15px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{area ? area.name : l.area}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{l.mins}m</span>
                  <span style={{ fontSize: 11, color: T.text3 }}>{fmtDate(l.date)}</span>
                </div>
              </div>
              {l.note ? <div style={{ fontSize: 13, color: T.text2, marginTop: 3, lineHeight: 1.45 }}>{l.note}</div> : null}
              {l.milestones && l.milestones.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 7 }}>
                  {l.milestones.map(m => (
                    <span key={m} style={{
                      fontSize: 11, background: T.tealBg, color: T.tealText,
                      borderRadius: 100, padding: "2px 8px",
                    }}>{m}</span>
                  ))}
                </div>
              )}
              {l.bg && l.bg.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                  {l.bg.map(b => {
                    const opt = BG_OPTIONS.find(o => o.id === b);
                    return (
                      <span key={b} style={{
                        fontSize: 11, background: T.surface2, color: T.text2,
                        borderRadius: 100, padding: "2px 8px",
                        border: `0.5px solid ${T.border}`,
                      }}>{opt ? opt.label : b}</span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TOAST ──────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      background: T.text, color: "#fff",
      fontSize: 14, fontWeight: 500,
      padding: "10px 20px", borderRadius: 100,
      opacity: visible ? 1 : 0,
      transition: "all 0.25s",
      pointerEvents: "none", whiteSpace: "nowrap", zIndex: 99,
    }}>
      {message}
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const hasLoaded = useRef(false);
  const [data, setData] = useState({ logs: [] });
  const [logOpen, setLogOpen] = useState(false);
  const [logArea, setLogArea] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const logPanelRef = useRef(null);

  // Load on mount
  useEffect(() => {
    setData(load());
    hasLoaded.current = true;
  }, []);

  // Save whenever data changes (after load)
  useEffect(() => {
    if (!hasLoaded.current) return;
    save(data);
  }, [data]);

  function openLog(id) {
    setLogArea(id);
    setLogOpen(true);
    setTimeout(() => {
      logPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  }
  function closeLog() {
    setLogOpen(false);
    setLogArea(null);
  }
  function handleSave(entry) {
    setData(prev => ({ ...prev, logs: [...prev.logs, entry] }));
    closeLog();
    showToast("Session saved");
  }
  function showToast(msg) {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 2200);
  }

  const { logs } = data;
  const totalSessions = logs.length;
  const totalHours = (totalMins(logs, null) / 60).toFixed(1);
  const activeStreaks = AREAS.filter(a => getStreak(logs, a.id) >= 2).length;
  const headerDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{
      background: T.bg, minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
    }}>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 16px 100px" }}>

        {/* Header */}
        <div style={{ padding: "52px 0 18px", borderBottom: `0.5px solid ${T.border}`, marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.4px", color: T.text }}>Growth</h1>
              <div style={{ fontSize: 13, color: T.text2, marginTop: 4 }}>{headerDate}</div>
            </div>
            <button
              onClick={() => openLog(null)}
              style={{
                fontSize: 14, fontWeight: 500, background: T.text, color: "#fff",
                border: "none", borderRadius: 100, padding: "8px 18px",
                cursor: "pointer", whiteSpace: "nowrap", marginTop: 2,
                fontFamily: "inherit", WebkitTapHighlightColor: "transparent",
              }}
            >
              + Log session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9, marginBottom: 24 }}>
          <StatCard label="Sessions" value={totalSessions} sub="all time" />
          <StatCard label="Hours" value={totalHours} sub="all time" />
          <StatCard label="Streaks" value={activeStreaks} sub="active (2+ days)" />
        </div>

        {/* Week chart */}
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: T.text3, marginBottom: 11 }}>
          This week
        </div>
        <WeekChart logs={logs} />

        {/* Areas */}
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: T.text3, marginBottom: 11 }}>
          Areas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 26 }}>
          {AREAS.map(a => (
            <AreaCard key={a.id} area={a} logs={logs} onClick={() => openLog(a.id)} />
          ))}
        </div>

        {/* Log panel */}
        <div ref={logPanelRef}>
          {logOpen && (
            <LogPanel initialArea={logArea} onSave={handleSave} onCancel={closeLog} />
          )}
        </div>

        {/* History */}
        <HistorySection logs={logs} />

      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
