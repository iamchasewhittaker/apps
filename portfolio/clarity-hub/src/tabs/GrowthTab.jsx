import React, { useMemo, useState } from "react";
import { T, today, computeStreak } from "../theme";

const GROWTH_AREAS = [
  { id: "faith", label: "Faith", emoji: "\ud83d\ude4f" },
  { id: "family", label: "Family", emoji: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66" },
  { id: "fitness", label: "Fitness", emoji: "\ud83d\udcaa" },
  { id: "finance", label: "Finance", emoji: "\ud83d\udcb0" },
  { id: "career", label: "Career", emoji: "\ud83c\udfaf" },
  { id: "learning", label: "Learning", emoji: "\ud83d\udcda" },
  { id: "creative", label: "Creative", emoji: "\ud83c\udfa8" },
];

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  btn: { padding: "10px 16px", borderRadius: 10, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  btnSmall: { padding: "7px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnDanger: { padding: "7px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${T.red}`, color: T.red, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 64, resize: "vertical" },
  label: { fontSize: 12, color: T.muted, marginBottom: 5, display: "block" },
};

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// ── WEEKLY SUMMARY BAR ──────────────────────────────────────────────────────

function WeeklySummary({ blob }) {
  const days = useMemo(() => {
    const now = new Date();
    const dow = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((dow + 6) % 7));
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    return labels.map((label, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const mins = (blob.sessions || [])
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + (s.mins || 0), 0);
      return { label, dateStr, mins };
    });
  }, [blob.sessions]);

  const maxMins = Math.max(...days.map((d) => d.mins), 1);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>This Week</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, alignItems: "end", height: 140 }}>
        {days.map((d) => (
          <div key={d.dateStr} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 4 }}>
              {d.mins > 0 ? `${d.mins}m` : ""}
            </div>
            <div style={{
              width: "100%", maxWidth: 32, borderRadius: 6,
              background: d.mins > 0 ? T.accent : T.surfaceHigh,
              height: d.mins > 0 ? Math.max(8, (d.mins / maxMins) * 100) : 8,
              transition: "height 0.2s",
            }} />
            <div style={{ fontSize: 11, color: d.dateStr === today() ? T.accent : T.muted, fontWeight: 600, marginTop: 4 }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AREA GRID ────────────────────────────────────────────────────────────────

function AreaGrid({ blob, onLog }) {
  const stats = useMemo(() => {
    const sessions = blob.sessions || [];
    return GROWTH_AREAS.map((area) => {
      const areaSessions = sessions.filter((s) => s.area === area.id);
      const uniqueDates = [...new Set(areaSessions.map((s) => s.date))];
      const streak = computeStreak(uniqueDates);
      const totalMins = areaSessions.reduce((sum, s) => sum + (s.mins || 0), 0);
      return { ...area, streak, totalMins };
    });
  }, [blob.sessions]);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Growth Areas</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((area) => (
          <div key={area.id} style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 24 }}>{area.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{area.label}</div>
            <div style={{ fontSize: 12, color: T.muted }}>
              {area.streak > 0 ? <span style={{ color: T.accent }}>{area.streak}d streak</span> : "No streak"}
              {" \u00b7 "}
              {area.totalMins > 0 ? `${area.totalMins}m total` : "0m"}
            </div>
            <button style={{ ...S.btnSmall, marginTop: 2 }} onClick={() => onLog(area.id)}>Log</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LOG SESSION FORM ────────────────────────────────────────────────────────

const DURATION_PRESETS = [15, 30, 45, 60];

function LogSession({ setBlob, preselectedArea, onClose }) {
  const [area, setArea] = useState(preselectedArea || GROWTH_AREAS[0].id);
  const [mins, setMins] = useState(30);
  const [custom, setCustom] = useState(false);
  const [note, setNote] = useState("");
  const [milestone, setMilestone] = useState("");

  const save = () => {
    if (mins < 1) return;
    const entry = {
      id: makeId(),
      area,
      mins,
      note: note.trim(),
      milestones: milestone.trim() ? [milestone.trim()] : [],
      backgrounds: [],
      date: today(),
      timestampMs: Date.now(),
    };
    setBlob((prev) => ({ ...prev, sessions: [entry, ...(prev.sessions || [])] }));
    onClose();
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Log Session</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={S.label}>Area</label>
          <select style={S.select} value={area} onChange={(e) => setArea(e.target.value)}>
            {GROWTH_AREAS.map((a) => <option key={a.id} value={a.id}>{a.emoji} {a.label}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Duration (minutes)</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DURATION_PRESETS.map((d) => (
              <button key={d} onClick={() => { setMins(d); setCustom(false); }} style={{
                ...S.btnSmall,
                border: `1px solid ${!custom && mins === d ? T.accent : T.border}`,
                color: !custom && mins === d ? T.accent : T.text,
                background: !custom && mins === d ? T.accentLight : T.surfaceHigh,
              }}>{d}m</button>
            ))}
            <button onClick={() => setCustom(true)} style={{
              ...S.btnSmall,
              border: `1px solid ${custom ? T.accent : T.border}`,
              color: custom ? T.accent : T.text,
              background: custom ? T.accentLight : T.surfaceHigh,
            }}>Custom</button>
          </div>
          {custom && (
            <input type="number" min="1" max="480" value={mins} onChange={(e) => setMins(Math.max(1, Math.min(480, parseInt(e.target.value) || 1)))} style={{ ...S.input, width: 100, marginTop: 8 }} />
          )}
        </div>
        <div>
          <label style={S.label}>Note (optional)</label>
          <textarea style={S.textarea} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you work on?" />
        </div>
        <div>
          <label style={S.label}>Milestone (optional)</label>
          <input style={S.input} value={milestone} onChange={(e) => setMilestone(e.target.value)} placeholder="e.g. Finished chapter 3" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn} onClick={save}>Save Session</button>
          <button style={S.btnSmall} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── HISTORY SECTION ─────────────────────────────────────────────────────────

function HistorySection({ blob, setBlob }) {
  const grouped = useMemo(() => {
    const sorted = [...(blob.sessions || [])].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)).slice(0, 20);
    const groups = [];
    let current = null;
    for (const s of sorted) {
      if (!current || current.date !== s.date) {
        current = { date: s.date, items: [] };
        groups.push(current);
      }
      current.items.push(s);
    }
    return groups;
  }, [blob.sessions]);

  const deleteSession = (id) => setBlob((prev) => ({ ...prev, sessions: (prev.sessions || []).filter((s) => s.id !== id) }));

  const findArea = (id) => GROWTH_AREAS.find((a) => a.id === id);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Recent Sessions</div>
      {grouped.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No sessions yet.</div>}
      {grouped.map((group) => (
        <div key={group.date}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, padding: "10px 0 6px", borderBottom: `1px solid ${T.border}` }}>
            {group.date === today() ? "Today" : group.date}
          </div>
          {group.items.map((s) => {
            const area = findArea(s.area);
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 18 }}>{area?.emoji || ""}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{area?.label || s.area} &middot; {s.mins}m</div>
                  {s.note ? <div style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.note}</div> : null}
                  {s.milestones && s.milestones.length > 0 ? <div style={{ fontSize: 11, color: T.green }}>Milestone: {s.milestones[0]}</div> : null}
                </div>
                <button onClick={() => deleteSession(s.id)} style={{ background: "none", border: "none", color: T.red, fontSize: 15, cursor: "pointer", padding: 4 }}>&times;</button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function GrowthTab({ blob, setBlob }) {
  const [logArea, setLogArea] = useState(null);

  return (
    <div style={{ padding: 16 }}>
      <WeeklySummary blob={blob} />
      {logArea !== null ? (
        <LogSession setBlob={setBlob} preselectedArea={logArea} onClose={() => setLogArea(null)} />
      ) : (
        <AreaGrid blob={blob} onLog={setLogArea} />
      )}
      <HistorySection blob={blob} setBlob={setBlob} />
    </div>
  );
}
