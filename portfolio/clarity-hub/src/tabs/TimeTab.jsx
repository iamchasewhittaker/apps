import React, { useState, useEffect } from "react";
import { T, today, fmtDuration, computeStreak } from "../theme";

// ── CATEGORIES (mirrors TimeConfig.swift) ───────────────────────────────────

const CATEGORIES = [
  { key: "deep", label: "Deep work" },
  { key: "work", label: "Work" },
  { key: "spiritual", label: "Spiritual" },
  { key: "health", label: "Health" },
  { key: "other", label: "Other" },
];

// ── TIMER MATH (mirrors TimeTimerMath.swift) ─────────────────────────────────

function elapsedMs(timer, nowMs) {
  let raw = nowMs - timer.startedAtMs - timer.accumulatedPausedMs;
  if (timer.pauseBeganAtMs != null) raw -= nowMs - timer.pauseBeganAtMs;
  return Math.max(0, raw);
}

function elapsedSeconds(timer, nowMs) {
  return Math.floor(elapsedMs(timer, nowMs) / 1000);
}

// ── SHARED STYLES ────────────────────────────────────────────────────────────

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  btn: { padding: "10px 18px", borderRadius: 10, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  btnSmall: { padding: "7px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnDanger: { padding: "7px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${T.red}`, color: T.red, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 12, color: T.muted, marginBottom: 5, display: "block" },
};

// ── TIMER SECTION ────────────────────────────────────────────────────────────

function TimerSection({ blob, setBlob }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("deep");
  const [, forceUpdate] = useState(0);

  // Tick every second when timer is running and not paused
  useEffect(() => {
    const timer = blob.activeTimer;
    if (!timer || timer.pauseBeganAtMs != null) return;
    const id = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [blob.activeTimer]);

  const active = blob.activeTimer;
  const isPaused = active?.pauseBeganAtMs != null;
  const elapsed = active ? elapsedSeconds(active, Date.now()) : 0;

  const start = () => {
    setBlob(prev => ({
      ...prev,
      activeTimer: {
        id: crypto.randomUUID(),
        title: title.trim() || "Focus session",
        category,
        startedAtMs: Date.now(),
        accumulatedPausedMs: 0,
        pauseBeganAtMs: null,
      },
    }));
    setTitle("");
  };

  const pause = () => {
    setBlob(prev => ({
      ...prev,
      activeTimer: { ...prev.activeTimer, pauseBeganAtMs: Date.now() },
    }));
  };

  const resume = () => {
    const t = blob.activeTimer;
    const pausedFor = Date.now() - t.pauseBeganAtMs;
    setBlob(prev => ({
      ...prev,
      activeTimer: { ...prev.activeTimer, accumulatedPausedMs: t.accumulatedPausedMs + pausedFor, pauseBeganAtMs: null },
    }));
  };

  const stop = () => {
    const t = blob.activeTimer;
    const secs = elapsedSeconds(t, Date.now());
    if (secs < 1) { discard(); return; }
    const session = {
      id: crypto.randomUUID(),
      title: t.title,
      category: t.category,
      kind: "timer",
      durationSeconds: secs,
      date: today(),
      timestampMs: Date.now(),
    };
    setBlob(prev => ({
      ...prev,
      sessions: [session, ...prev.sessions],
      activeTimer: null,
    }));
  };

  const discard = () => setBlob(prev => ({ ...prev, activeTimer: null }));

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Focus Timer</div>
      {!active ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input style={S.input} placeholder="Session label (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <select style={S.select} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <button style={S.btn} onClick={start}>Start</button>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 40, fontWeight: 700, color: isPaused ? T.muted : T.accent, letterSpacing: 2, padding: "12px 0" }}>
            {fmtDuration(elapsed)}
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: T.muted, marginBottom: 14 }}>
            {active.title} &middot; {CATEGORIES.find(c => c.key === active.category)?.label}
            {isPaused && <span style={{ color: T.yellow, marginLeft: 8 }}>Paused</span>}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {isPaused
              ? <button style={S.btn} onClick={resume}>Resume</button>
              : <button style={S.btnSmall} onClick={pause}>Pause</button>
            }
            <button style={S.btnSmall} onClick={stop}>Stop &amp; Save</button>
            <button style={S.btnDanger} onClick={discard}>Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MANUAL SESSION SECTION ───────────────────────────────────────────────────

function ManualSection({ blob, setBlob }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("deep");
  const [minutes, setMinutes] = useState(25);

  const log = () => {
    const session = {
      id: crypto.randomUUID(),
      title: title.trim() || "Manual session",
      category,
      kind: "manual",
      durationSeconds: minutes * 60,
      date: today(),
      timestampMs: Date.now(),
    };
    setBlob(prev => ({ ...prev, sessions: [session, ...prev.sessions] }));
    setTitle("");
    setMinutes(25);
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Manual Session</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input style={S.input} placeholder="Label (optional)" value={title} onChange={e => setTitle(e.target.value)} />
        <select style={S.select} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ ...S.label, marginBottom: 0 }}>Minutes:</label>
          <button style={{ ...S.btnSmall, padding: "4px 12px" }} onClick={() => setMinutes(m => Math.max(1, m - 5))}>-</button>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text, minWidth: 36, textAlign: "center" }}>{minutes}</span>
          <button style={{ ...S.btnSmall, padding: "4px 12px" }} onClick={() => setMinutes(m => Math.min(180, m + 5))}>+</button>
          <input type="number" min="1" max="180" value={minutes} onChange={e => setMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))} style={{ ...S.input, width: 70 }} />
        </div>
        <button style={S.btn} onClick={log}>Log Session</button>
      </div>
    </div>
  );
}

// ── SESSIONS LIST ────────────────────────────────────────────────────────────

function SessionsList({ blob, setBlob }) {
  const sessions = [...blob.sessions].sort((a, b) => b.timestampMs - a.timestampMs);
  const deleteSession = (id) => setBlob(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }));

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Recent Sessions</div>
      {sessions.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No sessions yet.</div>}
      {sessions.slice(0, 20).map(s => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
            <div style={{ fontSize: 11, color: T.muted }}>
              {CATEGORIES.find(c => c.key === s.category)?.label} &middot; {fmtDuration(s.durationSeconds)} &middot; {s.date}
              <span style={{ marginLeft: 6, color: s.kind === "timer" ? T.accent : T.green }}>
                {s.kind === "timer" ? "Timer" : "Manual"}
              </span>
            </div>
          </div>
          <button onClick={() => deleteSession(s.id)} style={{ background: "none", border: "none", color: T.red, fontSize: 15, cursor: "pointer", padding: 4 }}>&times;</button>
        </div>
      ))}
      {sessions.length > 20 && <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>Showing 20 of {sessions.length} sessions</div>}
    </div>
  );
}

// ── SCRIPTURE STREAK SECTION ─────────────────────────────────────────────────

function ScriptureSection({ blob, setBlob }) {
  const todayStr = today();
  const existing = blob.scriptureDays.find(d => d.date === todayStr) || { date: todayStr, completed: false, scriptureReference: "" };
  const streak = computeStreak(blob.scriptureDays.filter(d => d.completed).map(d => d.date));

  const updateToday = (patch) => {
    setBlob(prev => {
      const days = prev.scriptureDays.filter(d => d.date !== todayStr);
      return { ...prev, scriptureDays: [...days, { ...existing, ...patch }] };
    });
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Scripture Streak</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: streak > 0 ? T.accent : T.muted }}>{streak}</span>
        <span style={{ fontSize: 14, color: T.muted }}>day{streak === 1 ? "" : "s"} in a row</span>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 10 }}>TODAY — {todayStr}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            onClick={() => updateToday({ completed: !existing.completed })}
            style={{ width: 22, height: 22, borderRadius: 6, background: existing.completed ? T.accent : "transparent", border: `2px solid ${existing.completed ? T.accent : T.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            {existing.completed && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: 14, color: T.text }}>Scripture done today</span>
        </div>
        <input style={S.input} placeholder="Reference (optional, e.g. 1 Nephi 3:7)" value={existing.scriptureReference} onChange={e => updateToday({ scriptureReference: e.target.value })} />
      </div>
    </div>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function TimeTab({ blob, setBlob }) {
  return (
    <div style={{ padding: 16 }}>
      <TimerSection blob={blob} setBlob={setBlob} />
      <ManualSection blob={blob} setBlob={setBlob} />
      <ScriptureSection blob={blob} setBlob={setBlob} />
      <SessionsList blob={blob} setBlob={setBlob} />
    </div>
  );
}
