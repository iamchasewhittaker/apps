import React, { useState } from "react";
import { T, STORE, save } from "../theme";
import { Card, SectionLabel, Divider } from "../ui";
import { GmatTracker, LIFE_AREAS, WIN_CATEGORIES } from "./TasksTab";
import { QUOTES } from "./TrackerTab";

// ══════════════════════════════════════════════════════════════════════════
// WIN LOGGER
// ══════════════════════════════════════════════════════════════════════════

export function WinLogger({ wins, setWins, onClose }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState(null);
  const todayWins = (wins || []).filter(w => new Date(w.date).toDateString() === new Date().toDateString());

  const addWin = () => {
    if (!text.trim()) return;
    setWins(prev => [{ id: Date.now(), text: text.trim(), cat, date: new Date().toISOString() }, ...(prev || [])]);
    setText("");
    setCat(null);
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, lineHeight: 1.6 }}>
        Not just task completions — any moment worth remembering. Staying calm, not spiraling, showing up. It all counts.
      </div>

      {/* Category */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {WIN_CATEGORIES.map(o => (
          <button key={o.v} onClick={() => setCat(cat === o.v ? null : o.v)} style={{
            padding: "6px 11px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${cat === o.v ? T.accent : T.border}`,
            background: cat === o.v ? T.accentLight : T.surface,
            color: cat === o.v ? T.accent : T.muted, fontWeight: cat === o.v ? 700 : 400,
          }}>{o.e} {o.l}</button>
        ))}
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="What happened? Even one sentence."
        rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 10 }} />
      <button onClick={addWin} style={{ width: "100%", padding: "11px", borderRadius: 8, background: text.trim() ? T.accent : "#2a2a35", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", marginBottom: 16 }}>
        Log this win ✓
      </button>

      {todayWins.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>Today's wins</div>
          {todayWins.map(w => (
            <div key={w.id} style={{ display: "flex", gap: 8, padding: "8px 10px", background: T.accentLight, borderRadius: 8, marginBottom: 6 }}>
              <span>{WIN_CATEGORIES.find(c => c.v === w.cat)?.e || "🌱"}</span>
              <span style={{ fontSize: 13, color: T.text }}>{w.text}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════
// PATTERNS VIEW — charts
// ══════════════════════════════════════════════════════════════════════════

function PatternsView({ entries }) {
  if (!entries || entries.length < 2) return null;

  const recent = entries.slice(0, 14).reverse(); // oldest → newest for left-to-right charts

  // ── helpers ──
  const moodMap  = { hardest: 1, rough: 3, average: 5, good: 8, best: 10 };
  const sleepMap = { never: 1, over_hour: 3, "30_60": 5, under_30: 8 }; // onset → quality proxy
  const qualMap  = { 1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10 };

  const moodData    = recent.map(e => ({ v: moodMap[e.end_of_day?.overall  || e.endOfDay?.overall] || null,  d: e.date }));
  const sleepData   = recent.map(e => ({ v: e.sleep?.quality ? Number(e.sleep.quality) : (sleepMap[e.sleep?.onset] || null), d: e.date }));
  const focusData   = recent.map(e => ({ v: e.med_checkin?.focusScore ? Number(e.med_checkin.focusScore) : null, d: e.date }));

  const CHART_H = 80;
  const MAX_VAL = 10;

  const barColor = (v, max) => {
    if (v === null) return T.border;
    const r = v / max;
    return r >= 0.7 ? T.accent : r >= 0.4 ? T.yellow : T.red;
  };

  function MiniBarChart({ data, label, color }) {
    const vals = data.map(d => d.v);
    const nonNull = vals.filter(v => v !== null);
    if (nonNull.length === 0) return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No data yet</div>
      </div>
    );
    const avg = (nonNull.reduce((a,b)=>a+b,0)/nonNull.length).toFixed(1);
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted }}>{label}</div>
          <div style={{ fontSize: 11, color: color || T.muted }}>avg {avg}/10</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: CHART_H }}>
          {data.map((pt, i) => {
            const h = pt.v !== null ? Math.max(4, (pt.v / MAX_VAL) * CHART_H) : 4;
            const c = pt.v !== null ? (color || barColor(pt.v, MAX_VAL)) : T.border;
            const dateLabel = new Date(pt.d).toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: CHART_H, justifyContent: "flex-end" }}>
                <div style={{ width: "100%", height: `${h}px`, background: c, borderRadius: "3px 3px 0 0", opacity: pt.v !== null ? 1 : 0.25, transition: "height 0.3s" }} />
                {data.length <= 10 && (
                  <div style={{ fontSize: 8, color: T.muted, writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: 1 }}>{dateLabel}</div>
                )}
              </div>
            );
          })}
        </div>
        {data.length > 10 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted, marginTop: 3 }}>
            <span>{new Date(data[0].d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span>{new Date(data[data.length-1].d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </div>
    );
  }

  // Scripture heatmap — dot per day, filled = logged
  // We detect scripture from health_lifestyle.faith field in entries
  const scriptureDots = recent.map(e => ({
    d: e.date,
    logged: !!(e.health_lifestyle?.faith && e.health_lifestyle.faith !== "none"),
  }));

  return (
    <Card style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 16 }}>
        📊 Last {recent.length} Days
      </div>

      <MiniBarChart data={moodData}  label="Overall Day Score" color={T.accent} />
      <MiniBarChart data={sleepData} label="Sleep Quality (1–10)" color={T.blue} />
      <MiniBarChart data={focusData} label="Focus Score (Daily Tracker)" color={T.warn} />

      {/* Scripture / faith heatmap */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>Faith Practice</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {scriptureDots.map((pt, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                background: pt.logged ? "#C4622D" : T.faint,
                border: `1px solid ${pt.logged ? "#C4622D44" : T.border}`,
                transition: "background 0.2s",
              }} title={new Date(pt.d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              {scriptureDots.length <= 10 && (
                <div style={{ fontSize: 8, color: T.muted }}>{new Date(pt.d).toLocaleDateString("en-US", { day: "numeric" })}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10, color: T.muted, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#C4622D" }} /> Logged
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: T.faint, border: `1px solid ${T.border}` }} /> Not logged
          </div>
        </div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PATTERN ALERTS
// ══════════════════════════════════════════════════════════════════════════

function PatternAlerts({ entries }) {
  if (entries.length < 3) return (
    <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 13 }}>
      Keep logging — patterns surface after a few entries.
    </div>
  );

  const recent = entries.slice(0, 14);
  const scoreMap = { hardest: 1, rough: 3, average: 5, good: 8, best: 10 };
  const alerts = [];

  // Mood streak
  const moodScores = recent.map(e => scoreMap[e.endOfDay?.overall] || null).filter(Boolean);
  const last4Mood = moodScores.slice(0, 4);
  if (last4Mood.length >= 4 && last4Mood.every(s => s <= 3)) {
    alerts.push({ level: "red", icon: "😔", title: "Low mood 4+ days in a row", body: "Your overall day rating has been rough or hardest for 4 consecutive days. Worth flagging to your doctor." });
  } else if (last4Mood.length >= 3 && last4Mood.every(s => s <= 3)) {
    alerts.push({ level: "yellow", icon: "😟", title: "Low mood 3 days in a row", body: "Three rough days back to back. Keep an eye on this." });
  }

  // OCD streak
  const ocdSevere = recent.slice(0, 5).filter(e => e.ocd?.overallOcd === "overwhelming").length;
  if (ocdSevere >= 3) alerts.push({ level: "red", icon: "🧠", title: `OCD overwhelming ${ocdSevere} of last 5 days`, body: "This is worth discussing at your next appointment — especially while your medication combination is still new." });

  // Sleep pattern
  const sleepScores = recent.slice(0, 7).map(e => {
    const q = e.sleep?.sleepQuality;
    return q === "great" ? 4 : q === "okay" ? 3 : q === "poor" ? 2 : q === "terrible" ? 1 : null;
  }).filter(Boolean);
  if (sleepScores.length >= 5 && sleepScores.reduce((a,b) => a+b,0)/sleepScores.length < 2) {
    alerts.push({ level: "red", icon: "😴", title: "Poor sleep most of the week", body: "Consistent poor sleep affects everything — Adderall effectiveness, OCD threshold, mood, focus. Trazodone dose worth revisiting." });
  }

  // Adderall effectiveness dropping
  const adderallWeak = recent.slice(0, 5).filter(e => e.adhd?.adderallEffect === "didnt_do_much").length;
  if (adderallWeak >= 3) alerts.push({ level: "yellow", icon: "💊", title: `Adderall felt weak ${adderallWeak} of last 5 days`, body: "Could be timing, tolerance, sleep debt, or dose. Track your second dose timing and bring this to your prescriber." });

  // Anhedonia streak
  const anhedonia = recent.slice(0, 5).filter(e => e.mood_wellbeing?.anhedonia === "not_at_all" || e.mood_wellbeing?.anhedonia === "barely").length;
  if (anhedonia >= 3) alerts.push({ level: "yellow", icon: "🌫️", title: `Flat/numb feeling ${anhedonia} of last 5 days`, body: "Persistent anhedonia can mean the antidepressant combination needs adjustment. Wellbutrin + Sertraline should be helping here." });

  // Side effects flagged repeatedly
  const sideEffectCounts = {};
  recent.slice(0, 7).forEach(e => {
    Object.entries(e.sideEffects || {}).forEach(([k, v]) => {
      if (v === "yes" || v === "mild") sideEffectCounts[k] = (sideEffectCounts[k] || 0) + 1;
    });
  });
  Object.entries(sideEffectCounts).forEach(([k, count]) => {
    if (count >= 3) alerts.push({ level: count >= 5 ? "red" : "yellow", icon: "⚠️", title: `${k} flagged ${count} of last 7 days`, body: "Recurring side effect — worth logging specifically for your next appointment." });
  });

  // Positive pattern
  const goodDays = moodScores.slice(0, 7).filter(s => s >= 7).length;
  if (goodDays >= 4) alerts.push({ level: "green", icon: "📈", title: `${goodDays} good days in the last week`, body: "Solid stretch. Notice what's been different — sleep, timing, capacity, tasks completed." });

  return (
    <div className="fade">
      <div style={{ fontSize: 12, color: T.muted, background: "#16161c", padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6 }}>
        ⚠️ <strong style={{ color: T.text }}>Pattern detection.</strong> Flags things worth your attention — especially for your prescriber while you're still dialing in your meds.
      </div>

      {alerts.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px", color: T.muted, fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
          ✓ No patterns flagged right now. Keep logging.
        </div>
      )}

      {alerts.map((a, i) => (
        <div key={i} style={{
          background: a.level === "red" ? "#FEF2F2" : a.level === "yellow" ? "#FFFBEB" : "#F0FDF4",
          border: `1.5px solid ${a.level === "red" ? "#FCA5A5" : a.level === "yellow" ? "#FDE68A" : "#86EFAC"}`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{a.body}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DOCTOR PREP VIEW
// ══════════════════════════════════════════════════════════════════════════

function DoctorPrepView({ entries, taskData }) {
  if (entries.length === 0) return (
    <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 13 }}>No data yet. Complete check-ins to build your doctor prep summary.</div>
  );

  const recent30 = entries.slice(0, 30);
  const recent14 = entries.slice(0, 14);
  const scoreMap = { hardest: 1, rough: 3, average: 5, good: 8, best: 10 };

  // Mood average
  const moodScores = recent14.map(e => scoreMap[e.endOfDay?.overall]).filter(Boolean);
  const avgMood = moodScores.length ? (moodScores.reduce((a,b)=>a+b,0)/moodScores.length).toFixed(1) : null;

  // Sleep average
  const sleepMap = { great: 4, okay: 3, poor: 2, terrible: 1 };
  const sleepScores = recent14.map(e => sleepMap[e.sleep?.sleepQuality]).filter(Boolean);
  const avgSleep = sleepScores.length ? (sleepScores.reduce((a,b)=>a+b,0)/sleepScores.length).toFixed(1) : null;
  const sleepLabel = !avgSleep ? "—" : avgSleep >= 3.5 ? "Good" : avgSleep >= 2.5 ? "Fair" : "Poor";

  // OCD breakdown
  const ocdCounts = { quiet: 0, present: 0, overwhelming: 0 };
  recent14.forEach(e => { if (e.ocd?.overallOcd) ocdCounts[e.ocd.overallOcd] = (ocdCounts[e.ocd.overallOcd]||0)+1; });

  // Adderall effectiveness
  const adderallCounts = {};
  recent14.forEach(e => { const v = e.adhd?.adderallEffect; if (v) adderallCounts[v] = (adderallCounts[v]||0)+1; });

  // Side effects in last 30 days
  const sideEffects = {};
  recent30.forEach(e => {
    Object.entries(e.sideEffects || {}).forEach(([k,v]) => {
      if (v === "yes" || v === "mild") sideEffects[k] = (sideEffects[k]||0)+1;
    });
  });
  const flaggedSE = Object.entries(sideEffects).filter(([,c]) => c >= 2).sort((a,b)=>b[1]-a[1]);

  // Doctor notes
  const doctorNotes = recent30.filter(e => e.endOfDay?.doctorNote).map(e => ({
    note: e.endOfDay.doctorNote, date: e.date,
  }));

  // Med timing data
  const adderall2Times = recent14.map(e => e.morning_start?.timeAdderall2).filter(Boolean);

  const Stat = ({ label, value, sub, color }) => (
    <div style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || T.accent }}>{value}</div>
      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: T.muted }}>{sub}</div>}
    </div>
  );

  return (
    <div className="fade">
      <div style={{ background: "#EFF6FF", border: "1.5px solid #2D5A8A44", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#2D5A8A", lineHeight: 1.6 }}>
        🩺 <strong>Ready to screenshot.</strong> A summary of what matters most for your next prescriber visit. Based on your last {Math.min(entries.length, 30)} entries.
      </div>

      {/* Top stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <Stat label="Avg mood" value={avgMood || "—"} sub="out of 10" color={!avgMood ? T.muted : avgMood >= 7 ? T.accent : avgMood >= 4 ? "#D4A017" : T.red} />
        <Stat label="Sleep quality" value={sleepLabel} sub={`${sleepScores.length} nights`} color={sleepLabel === "Good" ? T.accent : sleepLabel === "Fair" ? "#D4A017" : T.red} />
        <Stat label="Entries" value={recent30.length} sub="last 30 days" />
      </div>

      {/* OCD */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 10 }}>🧠 OCD — last 14 days</div>
        {Object.entries(ocdCounts).filter(([,v])=>v>0).map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
            <span style={{ color: k==="overwhelming" ? T.red : k==="present" ? "#D4A017" : T.accent, textTransform: "capitalize" }}>{k}</span>
            <span style={{ color: T.muted }}>{v} days</span>
          </div>
        ))}
        {Object.values(ocdCounts).every(v=>v===0) && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No OCD data logged yet.</div>}
      </Card>

      {/* Adderall */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 10 }}>💊 Adderall effectiveness — last 14 days</div>
        {Object.entries(adderallCounts).map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
            <span style={{ color: T.muted, textTransform: "capitalize" }}>{k.replace(/_/g," ")}</span>
            <span style={{ color: T.text, fontWeight: 600 }}>{v} days</span>
          </div>
        ))}
        {adderall2Times.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>2nd dose timing logged: {adderall2Times.slice(0,5).join(", ")}{adderall2Times.length > 5 ? "..." : ""}</div>
        )}
        {Object.keys(adderallCounts).length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No Adderall data logged yet.</div>}
      </Card>

      {/* Side effects */}
      {flaggedSE.length > 0 && (
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 10 }}>⚠️ Side effects flagged (last 30 days)</div>
          {flaggedSE.map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
              <span style={{ color: T.text, textTransform: "capitalize" }}>{k.replace(/_/g," ")}</span>
              <span style={{ color: T.red, fontWeight: 600 }}>{v} days</span>
            </div>
          ))}
        </Card>
      )}

      {/* Doctor notes */}
      {doctorNotes.length > 0 && (
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#2D5A8A", marginBottom: 10 }}>🩺 Things you flagged for your doctor</div>
          {doctorNotes.map((n, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{n.note}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: T.muted, marginTop: 8 }}>Screenshot this page before your next appointment.</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// AI MONTHLY SUMMARY
// ══════════════════════════════════════════════════════════════════════════

function AIMonthlySummary({ entries, wins, pulseChecks }) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [summary, setSummary] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);

  const recent30 = (entries || []).slice(0, 30);

  // Build a compact data payload for the prompt — plain text, no raw JSON dump
  const buildPrompt = () => {
    const moodMap  = { hardest: 1, rough: 3, average: 5, good: 8, best: 10 };
    const sleepMap = { under_30: 8, "30_60": 5, over_hour: 3, never: 1 };

    const rows = recent30.map(e => {
      const d  = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const mood   = moodMap[e.end_of_day?.overall || e.endOfDay?.overall] ?? "—";
      const sleep  = e.sleep?.quality ?? sleepMap[e.sleep?.onset] ?? "—";
      const focus  = e.med_checkin?.focusScore ?? "—";
      const faith  = e.health_lifestyle?.faith ?? "—";
      const energy = e.med_checkin?.energyLevel ?? "—";
      const note   = e.end_of_day?.biggestThing || e.endOfDay?.biggestThing || "";
      return `${d}: mood=${mood}/10 sleep=${sleep}/10 focus=${focus}/10 energy=${energy} faith=${faith}${note ? ` | "${note}"` : ""}`;
    });

    const recentWins = (wins || []).slice(0, 20).map(w => w.text).join("; ");
    const pulseCount = (pulseChecks || []).filter(p => {
      const d = new Date(p.time);
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
      return d >= cutoff;
    }).length;

    return `You are a warm, honest wellness coach. The user has ADHD and OCD, is managing multiple medications (Sertraline, Adderall, Wellbutrin, Buspar, Trazodone), is job searching, has young kids, and is LDS. Speak directly to Chase — use "you", not "the user".

Here is Chase's daily check-in data for the last ${recent30.length} days (mood/sleep/focus each out of 10, energy=Low/Medium/High, faith=none/brief/moderate/meaningful):

${rows.join("\n")}

Recent wins logged: ${recentWins || "none"}
Pulse checks in last 30 days: ${pulseCount}

Write a monthly summary in 4 short sections:
1. **What the data shows** — honest patterns in mood, sleep, and focus (2–3 sentences)
2. **What's working** — genuine positives worth acknowledging (2–3 sentences)
3. **What to watch** — 1–2 things worth paying attention to, without alarm (2–3 sentences)
4. **One thing to try this month** — a single concrete suggestion tailored to what you see (1–2 sentences)

Keep the whole response under 300 words. Be specific — reference actual numbers and dates where helpful. Avoid generic wellness advice.`;
  };

  const generate = async () => {
    setStatus("loading");
    setSummary("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      setSummary(text);
      setGeneratedAt(new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }));
      setStatus("done");
    } catch (err) {
      setSummary("Something went wrong generating the summary. Check your connection and try again.\n\n" + err.message);
      setStatus("error");
    }
  };

  // Render markdown-ish bold (**text**) simply
  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <div key={i} style={{ marginBottom: line.trim() === "" ? 8 : 4 }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: T.text }}>{part}</strong>
              : <span key={j}>{part}</span>
          )}
        </div>
      );
    });
  };

  if (recent30.length < 5) {
    return (
      <Card>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
          🤖 You need at least 5 check-in entries to generate a meaningful summary. Keep logging — you have {recent30.length} so far.
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>
          🤖 <strong style={{ color: T.text }}>AI monthly summary.</strong> Reads your last {recent30.length} check-ins and writes a plain-English summary of what the data actually shows — patterns, wins, and one thing worth trying.
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, padding: "8px 12px", background: T.faint, borderRadius: 8, lineHeight: 1.5 }}>
          Your data is sent to Anthropic's API to generate this summary. It is not stored anywhere — only used for this request.
        </div>
        <button
          onClick={generate}
          disabled={status === "loading"}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: status === "loading" ? "#2a2a35" : T.accent,
            color: "#fff", fontSize: 13, fontWeight: 700,
            fontFamily: "inherit", cursor: status === "loading" ? "default" : "pointer",
          }}
        >
          {status === "loading" ? "Generating…" : status === "done" ? "Regenerate summary ↺" : "Generate monthly summary →"}
        </button>
      </Card>

      {status === "loading" && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.muted, fontSize: 13 }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${T.accent}`, borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite", flexShrink: 0,
            }} />
            Reading {recent30.length} entries…
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </Card>
      )}

      {(status === "done" || status === "error") && summary && (
        <Card style={{ borderColor: status === "error" ? T.red : T.border }}>
          {generatedAt && (
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 12, textAlign: "right" }}>
              Generated {generatedAt}
            </div>
          )}
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.8 }}>
            {renderText(summary)}
          </div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HISTORY VIEW (default export)
// ══════════════════════════════════════════════════════════════════════════

export default function HistoryView({ entries, taskData, budgetData, wins, pulseChecks, ideasData, setIdeasData, meds, setMeds }) {
  const [histTab, setHistTab] = useState("checkin");

  const scoreMap = {
    overall: { hardest: 1, rough: 3, average: 5, good: 8, best: 10 },
  };

  const thisWeekStart = (() => { const now = new Date(); const sun = new Date(now); sun.setDate(now.getDate() - now.getDay()); sun.setHours(0,0,0,0); return sun; })();
  const td = taskData || {};
  const weeklyWins = (td.weeklyWins || []).filter(w => new Date(w.completedAt) >= thisWeekStart);
  const mediaLogs = td.mediaLogs || [];
  const thisWeekMedia = mediaLogs.filter(m => new Date(m.loggedAt) >= thisWeekStart);

  const restoreFileRef = React.useRef(null);

  const restoreData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== "object" ||
            !["entries", "budget", "tasks", "growthLogs"].some(k => k in parsed)) {
          alert("Not a valid backup file");
          return;
        }
        if (!window.confirm("This will replace ALL current data. Continue?")) return;
        save(parsed);
        window.location.reload();
      } catch {
        alert("Not a valid backup file");
      }
    };
    reader.readAsText(file);
  };

  const exportData = () => {
    const rows = [];
    rows.push([
      "Date","Morning Done","Evening Done","One Word","Overall Day",
      "vs Yesterday","Sleep Onset","Sleep Quality","Hours Slept",
      "Morning Feel","Capacity","OCD Overall","OCD Stuck",
      "Mood","Anxiety","Irritability","Self Talk","Numbness",
      "ADHD Starting","ADHD Brain","Adderall Effect","Background Noise",
      "Physical Energy","Exercise","Eating","Stress","Caffeine",
      "Faith","Screen Time","Money Uncertain","Biggest Thing","Doctor Note","Tomorrow Focus"
    ].join(","));
    (entries || []).forEach(e => {
      const q = s => `"${(s||"").replace(/"/g,"'")}"`;
      rows.push([
        new Date(e.date).toLocaleDateString(),
        e.morningDone?"yes":"no", e.eveningDone?"yes":"no",
        q(e.end_of_day?.oneWord||e.endOfDay?.oneWord),
        e.end_of_day?.overall||e.endOfDay?.overall||"",
        e.end_of_day?.vsYesterday||e.endOfDay?.vsYesterday||"",
        e.sleep?.onset||"", e.sleep?.quality||"", e.sleep?.hours||"",
        e.morning_start?.morningFeel||"", e.morning_start?.capacity||"",
        e.ocd?.overall||"", e.ocd?.stuck||"",
        e.mood_wellbeing?.mood||"", e.mood_wellbeing?.anxiety||"",
        e.mood_wellbeing?.irritability||"", e.mood_wellbeing?.selfTalk||"",
        e.mood_wellbeing?.numbness||"",
        e.adhd?.starting||"", e.adhd?.brain||"",
        e.adhd?.adderall||"", e.adhd?.bgNoise||"",
        e.health_lifestyle?.energy||"", e.health_lifestyle?.exercise||"",
        e.health_lifestyle?.eating||"", e.health_lifestyle?.stress||"",
        e.health_lifestyle?.caffeine||"", e.health_lifestyle?.faith||"",
        e.health_lifestyle?.screenTime||"",
        e.end_of_day?.unplanned||e.endOfDay?.unplanned||"",
        q(e.end_of_day?.biggestThing||e.endOfDay?.biggestThing),
        q(e.end_of_day?.doctorNote||e.endOfDay?.doctorNote),
        q(e.end_of_day?.tomorrowFocus||e.endOfDay?.tomorrowFocus),
      ].join(","));
    });
    rows.push("","WINS LOG","Date,Category,Text");
    (wins||[]).forEach(w => rows.push([new Date(w.date).toLocaleDateString(), w.cat||"", `"${(w.text||"").replace(/"/g,"'")}"`].join(",")));
    rows.push("","COMPLETED TASKS","Date,Task");
    (td.weeklyWins||[]).forEach(w => rows.push([new Date(w.completedAt).toLocaleDateString(), `"${(w.text||"").replace(/"/g,"'")}"`].join(",")));
    const blob = new Blob([rows.join("\n")],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wellness-export-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const BACKUP_FOLDER_KEY = "chase_wellness_backup_folder";

  const getBackupBlob = () => {
    const raw = localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) : {};
    return new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
  };

  const getBackupFilename = () =>
    `wellness-backup-${new Date().toISOString().slice(0, 10)}.json`;

  const fallbackDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backupData = async () => {
    const blob = getBackupBlob();
    const filename = getBackupFilename();

    // File System Access API — supported in Chrome/Edge, not Safari yet
    if (window.showDirectoryPicker) {
      try {
        let dirHandle = null;

        // Try to reuse a previously saved handle
        try {
          const stored = localStorage.getItem(BACKUP_FOLDER_KEY);
          if (stored) {
            dirHandle = JSON.parse(stored);
          }
        } catch {}

        // If no stored handle, prompt user to pick/create a folder
        if (!dirHandle) {
          dirHandle = await window.showDirectoryPicker({
            id: "wellness-backups",
            mode: "readwrite",
            startIn: "documents",
          });
          // Persist the handle for next time
          try {
            localStorage.setItem(BACKUP_FOLDER_KEY, JSON.stringify(dirHandle));
          } catch {}
        }

        // Write the file into the chosen folder
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert(`✅ Backup saved to folder:\n${filename}`);
        return;
      } catch (e) {
        if (e.name === "AbortError") return; // user cancelled picker
        // Fall through to normal download on any other error
      }
    }

    // Fallback: standard download (Safari, Firefox, older browsers)
    fallbackDownload(blob, filename);
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* History sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, marginBottom: 14, overflowX: "auto" }}>
        {[
          { id: "checkin", label: "📋 Check-ins" },
          { id: "pulse",   label: "💊 Pulse Checks" },
          { id: "tasks",   label: "✅ Tasks" },
          { id: "budget",  label: "💰 Budget" },
          { id: "media",   label: "📺 Media" },
          { id: "patterns",label: "⚠️ Patterns" },
          { id: "doctor",  label: "🩺 Doctor Prep" },
          { id: "quotes",  label: "💬 Quotes" },
          { id: "gmat",    label: "📚 GMAT" },
          { id: "summary", label: "🤖 Summary" },
        ].map(t => (
          <button key={t.id} onClick={() => setHistTab(t.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12,
            border: `1.5px solid ${histTab === t.id ? T.accent : T.border}`,
            background: histTab === t.id ? T.accentLight : T.surface,
            color: histTab === t.id ? T.accent : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: histTab === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* CHECK-IN HISTORY */}
      {histTab === "checkin" && (<>
      {entries.length === 0 ? (
        <div style={{ padding: 24, color: T.muted, textAlign: "center", fontSize: 14 }}>No entries yet. Complete your first daily check-in to start building your history.</div>
      ) : (<>
      <Card>
        <SectionLabel>📈 Trend — Overall Day Score</SectionLabel>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>Last {Math.min(entries.length, 14)} entries</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {entries.slice(0, 14).reverse().map((e, i) => {
            const score = scoreMap.overall[e.endOfDay?.overall] || 5;
            const color = score <= 3 ? T.red : score <= 5 ? T.yellow : T.accent;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: "100%", borderRadius: 3, height: `${score * 6}px`, background: color, transition: "height 0.3s ease" }} />
                <div style={{ fontSize: 9, color: T.muted }}>{new Date(e.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {entries.map((entry, i) => {
        const d = new Date(entry.date);
        const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const overall = entry.endOfDay?.overall;
        const vsYest = entry.endOfDay?.vsYesterday;
        const oneWord = entry.endOfDay?.oneWord;
        const doctorNote = entry.endOfDay?.doctorNote;
        const sideEffects = Object.entries(entry.sideEffects || {})
          .filter(([, v]) => v === "yes" || v === "mild")
          .map(([k, v]) => ({ k, v }));
        const mChecks = [entry.morningDone ? "☀️ Morning" : null, entry.eveningDone ? "🌙 Evening" : null].filter(Boolean);
        return (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{dateStr}</div>
                {oneWord && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginTop: 2 }}>"{oneWord}"</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                {overall && <div style={{ fontSize: 12, color: T.muted }}>{overall.replace(/_/g, " ")}</div>}
                {mChecks.length > 0 && <div style={{ fontSize: 11, color: T.accent, marginTop: 2 }}>{mChecks.join(" · ")}</div>}
              </div>
            </div>
            {sideEffects.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, color: T.red, marginBottom: 4 }}>Side effects flagged:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {sideEffects.map(({ k, v }) => (
                    <span key={k} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: v === "yes" ? T.redLight : T.yellowLight, color: v === "yes" ? T.red : T.yellow, fontWeight: 600 }}>{k}</span>
                  ))}
                </div>
              </div>
            )}
            {doctorNote && (
              <div style={{ marginTop: 8, padding: "8px 10px", background: T.blueLight, borderRadius: 6, fontSize: 12, color: T.blue }}>
                🩺 {doctorNote}
              </div>
            )}
          </Card>
        );
      })}
      </>)}
      </>)}

      {/* TASKS HISTORY */}
      {histTab === "tasks" && (
        <div className="fade">
          <Card style={{ background: T.accentLight, border: `1.5px solid ${T.accent}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, marginBottom: 6 }}>🏆 This Week's Wins</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.accent }}>{weeklyWins.length}</div>
            <div style={{ fontSize: 12, color: T.muted }}>tasks completed since Sunday</div>
          </Card>
          {td.weeklyFocus && (
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>This Week's Focus</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{LIFE_AREAS.find(a => a.id === td.weeklyFocus)?.label || td.weeklyFocus}</div>
              {td.weeklyAnchor && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginTop: 4 }}>Anchor: "{td.weeklyAnchor}"</div>}
            </Card>
          )}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Active Tasks ({(td.active || []).length}/5)</div>
            {(td.active || []).length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No active tasks right now.</div>}
            {(td.active || []).map((t, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13, color: T.text }}>{t.text} <span style={{ fontSize: 11, color: T.muted }}>· {t.cat}</span></div>
            ))}
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Brain Dump ({(td.dump || []).length} items)</div>
            {(td.dump || []).length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>Brain dump is empty.</div>}
            {(td.dump || []).slice(0, 8).map((t, i) => (
              <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>{t.text}</div>
            ))}
            {(td.dump || []).length > 8 && <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>+{(td.dump || []).length - 8} more</div>}
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>This Week's Completed Tasks</div>
            {weeklyWins.length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No wins logged yet this week.</div>}
            {weeklyWins.slice().reverse().map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.text }}>
                <span>{w.isOneThing ? "☀️" : "✅"}</span>
                <div><div>{w.text}</div><div style={{ fontSize: 11, color: T.muted }}>{new Date(w.completedAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div></div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* BUDGET HISTORY */}
      {histTab === "budget" && (
        <div className="fade">
          {(() => {
            const bd = budgetData || {};
            const scenarios = [
              { prefix: "now_", label: "📍 Right Now", color: T.blue },
              { prefix: "tgt_", label: "🎯 When Working", color: T.accent },
            ];
            return scenarios.map(sc => {
              const income = (parseFloat(bd[sc.prefix + "wife_income"]) || 0) + (parseFloat(bd[sc.prefix + "income"]) || 0) + (parseFloat(bd[sc.prefix + "unemployment"]) || 0);
              const cats = ["tithing","mortgage","car","insurance","phone","internet","utilities","subscriptions","debt","groceries","gas","kids","medical","dates","savings","chase_personal","wife_personal","other_flex"];
              const totalExp = cats.reduce((s, c) => s + (parseFloat(bd[sc.prefix + c]) || 0), 0);
              const leftover = income - totalExp;
              return (
                <Card key={sc.prefix} style={{ border: `1.5px solid ${sc.color}44` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: sc.color, marginBottom: 10 }}>{sc.label}</div>
                  {income === 0 ? (
                    <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No budget data entered yet.</div>
                  ) : (<>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: T.muted }}>Monthly income</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>${income.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: T.muted }}>Total expenses</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>${totalExp.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: T.muted }}>Leftover</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: leftover >= 0 ? T.accent : T.red }}>{leftover >= 0 ? "+" : ""}${leftover.toLocaleString()}</span>
                    </div>
                  </>)}
                </Card>
              );
            });
          })()}
        </div>
      )}

      {/* PATTERNS */}
      {histTab === "patterns" && (
        <div className="fade">
          <PatternsView entries={entries} />
          <PatternAlerts entries={entries} taskData={taskData} />
        </div>
      )}

      {/* DOCTOR PREP */}
      {histTab === "doctor" && (
        <DoctorPrepView entries={entries} taskData={taskData} />
      )}

      {/* MEDIA HISTORY */}
      {histTab === "media" && (
        <div className="fade">
          {thisWeekMedia.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: T.muted, fontSize: 13 }}>No media logged this week yet.</div>
          ) : (<>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>This Week at a Glance</div>
              {["tv","podcast","audiobook","social","music","news"].map(type => {
                const logs = thisWeekMedia.filter(m => m.type === type);
                if (logs.length === 0) return null;
                const totalMins = logs.reduce((s, m) => s + (parseInt(m.duration) || 0), 0);
                const procrastLogs = logs.filter(m => m.why === "procrastinating").length;
                return (
                  <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <span style={{ fontSize: 13, color: T.text, textTransform: "capitalize" }}>{type}</span>
                      {procrastLogs > 0 && <span style={{ fontSize: 11, color: T.warn, marginLeft: 8 }}>⚠️ {procrastLogs}x procrastination</span>}
                    </div>
                    <span style={{ fontSize: 12, color: T.muted }}>{totalMins}min · {logs.length} sessions</span>
                  </div>
                );
              })}
            </Card>
            {thisWeekMedia.slice().reverse().map((m, i) => (
              <Card key={i} style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, textTransform: "capitalize" }}>{m.type} · {m.duration}min</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{m.why?.replace(/_/g, " ")} · {m.intentional === "yes" ? "intentional" : "mindless"}</div>
                    {m.speed && <div style={{ fontSize: 11, color: T.muted }}>Speed: {m.speed}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: m.focusEffect === "helped" ? T.accent : m.focusEffect === "hurt" ? T.red : T.muted }}>{m.focusEffect?.replace(/_/g, " ")}</div>
                    {m.ocdTrigger === "yes" && <div style={{ fontSize: 11, color: T.red }}>OCD triggered ⚠️</div>}
                  </div>
                </div>
                {m.note && <div style={{ fontSize: 12, color: T.muted, marginTop: 6, fontStyle: "italic" }}>"{m.note}"</div>}
              </Card>
            ))}
          </>)}
        </div>
      )}

      {histTab === "quotes" && (
        <div className="fade">
          <div style={{ fontSize: 12, color: T.muted, background: T.faint, padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6 }}>
            💬 Every quote shown on the Check-In tab, in order. One per day, cycling through all {QUOTES.length}.
          </div>
          {QUOTES.map((q, i) => {
            const tagColors = {
              faith:  { bg: T.accentLight, color: T.accent },
              adhd:   { bg: T.blueLight,   color: T.blue },
              stoic:  { bg: T.faint,        color: T.muted },
              hustle: { bg: T.warnLight,    color: T.warn },
            };
            const tc = tagColors[q.tag] || tagColors.stoic;
            return (
              <Card key={i} style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>"{q.text}"</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: T.muted }}>— {q.source}</div>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
                    background: tc.bg, color: tc.color,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{q.tag}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {histTab === "pulse" && (
        <div className="fade">
          <div style={{ fontSize: 12, color: T.muted, background: T.blueLight, padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6, color: T.blue }}>
            💊 Quick pulse checks logged throughout the day. Tap the Pulse button any time to add one.
          </div>
          {(!pulseChecks || pulseChecks.length === 0) ? (
            <div style={{ padding: 24, color: T.muted, textAlign: "center", fontSize: 14 }}>No pulse checks yet. Tap 💊 Pulse at the bottom of any tab to log one.</div>
          ) : (
            pulseChecks.map((p, i) => {
              const dot = (val, max=10) => {
                if (val === null || val === undefined) return null;
                const pct = val / max;
                const color = pct <= 0.3 ? T.red : pct <= 0.6 ? T.yellow : T.accent;
                return <span style={{ fontWeight: 700, color }}>{val}</span>;
              };
              const date = new Date(p.time);
              const dateLabel = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              return (
                <Card key={i} style={{ padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{dateLabel}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{p.timeLabel}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                    {p.focus !== null && p.focus !== undefined && (
                      <div style={{ fontSize: 12, color: T.muted }}>Focus: {dot(p.focus)}<span style={{color:T.muted}}>/10</span></div>
                    )}
                    {p.mood !== null && p.mood !== undefined && (
                      <div style={{ fontSize: 12, color: T.muted }}>Mood: {dot(p.mood)}<span style={{color:T.muted}}>/10</span></div>
                    )}
                    {p.anxiety !== null && p.anxiety !== undefined && (
                      <div style={{ fontSize: 12, color: T.muted }}>Anxiety: {dot(p.anxiety, 10)}<span style={{color:T.muted}}>/10</span></div>
                    )}
                  </div>
                  {p.medsHelpful && (
                    <div style={{ fontSize: 11, marginBottom: 6 }}>
                      <span style={{ color: T.muted }}>Meds: </span>
                      <span style={{ fontWeight: 700, color: p.medsHelpful === "helpful" ? T.accent : p.medsHelpful === "too_much" ? T.red : T.yellow }}>
                        {p.medsHelpful === "helpful" ? "Helpful" : p.medsHelpful === "not_enough" ? "Not enough" : "Too much"}
                      </span>
                    </div>
                  )}
                  {p.sideEffects === "yes" && p.sideEffectDetail && (
                    <div style={{ fontSize: 11, color: T.warn }}>Side effects: {p.sideEffectDetail}</div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {histTab === "gmat" && (
        <div className="fade">
          <div style={{ fontSize: 12, color: T.muted, background: T.faint, padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6 }}>
            📚 GMAT study sessions and practice scores. Log a session from the Ideas tab while studying.
          </div>
          <GmatTracker ideasData={ideasData} setIdeasData={setIdeasData} taskData={{}} />
        </div>
      )}

      {histTab === "summary" && (
        <div className="fade">
          <AIMonthlySummary entries={entries} wins={wins} pulseChecks={pulseChecks} />
        </div>
      )}

      {/* ── EXPORT ── always visible at bottom of History */}
      <div style={{ marginTop: 24, padding: "16px 18px", background: T.faint, border: `1px solid ${T.border}`, borderRadius: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 4 }}>📤 Export your data</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>
          Downloads a CSV file with all check-ins, wins, and completed tasks. Open in Google Sheets or Excel.
        </div>
        <button onClick={exportData} style={{
          width: "100%", padding: "11px", borderRadius: 8,
          background: T.blue, color: "#fff", border: "none",
          fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
        }}>
          Download CSV →
        </button>
        <div style={{ fontSize: 10, color: T.muted, marginTop: 8, textAlign: "center" }}>
          Your data never leaves your device — this exports only from local storage.
        </div>
      </div>

      {/* ── BACKUP ── full JSON backup of chase_wellness_v1 */}
      <div style={{ marginTop: 12, padding: "16px 18px", background: T.faint, border: `1px solid ${T.border}`, borderRadius: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.warn, marginBottom: 4 }}>💾 Full JSON Backup</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>
          Saves everything to a folder you choose. First tap will ask you to pick or create a folder (e.g. "Wellness Backups" in iCloud) — after that it saves there automatically.
        </div>
        <button onClick={backupData} style={{
          width: "100%", padding: "11px", borderRadius: 8,
          background: T.warn, color: "#fff", border: "none",
          fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
        }}>
          💾 Save Backup to Folder →
        </button>
        <div style={{ fontSize: 10, color: T.muted, marginTop: 8, textAlign: "center" }}>
          Saved as <em>wellness-backup-YYYY-MM-DD.json</em> · Each backup is a separate dated file.
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <button onClick={() => { localStorage.removeItem(BACKUP_FOLDER_KEY); alert("Folder cleared — next backup will ask you to choose a new folder."); }} style={{
            background: "none", border: "none", color: T.muted,
            fontSize: 10, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
          }}>
            Change backup folder
          </button>
        </div>
      </div>

      {/* ── RESTORE ── */}
      <div style={{ marginTop: 10, padding: "14px 18px", background: T.warnLight, border: `1px solid ${T.warn}44`, borderRadius: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.warn, marginBottom: 4 }}>📥 Restore from Backup</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>
          Select a previously saved <em>wellness-backup-*.json</em> file to restore all data. <strong style={{ color: T.warn }}>This replaces everything currently saved.</strong>
        </div>
        <input
          ref={restoreFileRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={restoreData}
        />
        <button onClick={() => restoreFileRef.current && restoreFileRef.current.click()} style={{
          width: "100%", padding: "11px", borderRadius: 8,
          background: "transparent", color: T.warn,
          border: `2px solid ${T.warn}`, fontSize: 13, fontWeight: 700,
          fontFamily: "inherit", cursor: "pointer",
        }}>
          📥 Choose Backup File to Restore →
        </button>
      </div>

    </div>
  );
}
