import React, { useState } from "react";
import { T } from "../theme";
import { load } from "../theme";

// ══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════

const TASK_CATEGORIES = ["Job Search", "Home & Family", "Health", "Financial", "Other"];
const TASK_SIZES = [
  { id: "quick", label: "⚡ Quick", sub: "< 10 min", color: "#2D6A4F" },
  { id: "short", label: "🔵 Short", sub: "10–30 min", color: "#2D5A8A" },
  { id: "medium", label: "🟡 Medium", sub: "30–90 min", color: "#D4A017" },
];
const CAPACITY_OPTIONS = [
  { id: "survival", label: "😔 Survival", sub: "1 hr or less", slots: 1 },
  { id: "limited", label: "😐 Limited", sub: "1–2 hrs", slots: 2 },
  { id: "average", label: "🙂 Average", sub: "2–4 hrs", slots: 4 },
  { id: "strong", label: "💪 Strong", sub: "4+ hrs", slots: 5 },
];

export const LIFE_AREAS = [
  { id: "job",    label: "💼 Job Search",     desc: "Applications, follow-ups, interview prep" },
  { id: "family", label: "👨‍👩‍👧 Family",          desc: "Being present, connection, kids" },
  { id: "money",  label: "💰 Money",           desc: "Budget, bills, financial stress" },
  { id: "health", label: "❤️ Health",           desc: "Meds, appointments, sleep" },
  { id: "home",   label: "🏠 Home",             desc: "Chores, projects, things piling up" },
  { id: "gmat",   label: "📚 GMAT",             desc: "Studying, practice tests, prep" },
  { id: "goals",  label: "🌱 Personal Goals",   desc: "Things that matter to you long-term" },
];

export const GMAT_SECTIONS = [
  { id: "quant",    label: "📐 Quantitative",   color: "#2D5A8A" },
  { id: "verbal",   label: "📖 Verbal",          color: "#2D6A4F" },
  { id: "di",       label: "📊 Data Insights",   color: "#7B5EA7" },
  { id: "full",     label: "📝 Full Practice Test", color: "#C4622D" },
  { id: "mixed",    label: "🔀 Mixed Review",    color: "#D4A017" },
];

export const WIN_CATEGORIES = [
  { v: "task",      e: "✅", l: "Finished a task" },
  { v: "ocd",       e: "🧠", l: "Didn't act on a compulsion" },
  { v: "present",   e: "👨‍👩‍👧", l: "Was present with family" },
  { v: "health",    e: "❤️", l: "Did something good for my health" },
  { v: "brave",     e: "💪", l: "Did something hard despite anxiety" },
  { v: "job",       e: "💼", l: "Made progress on job search" },
  { v: "calm",      e: "😌", l: "Stayed calm in a hard moment" },
  { v: "other",     e: "🌱", l: "Something else worth noting" },
];

// ══════════════════════════════════════════════════════════════════════════
// GMAT TRACKER
// ══════════════════════════════════════════════════════════════════════════

export function GmatTracker({ ideasData, setIdeasData, taskData }) {
  const [logStep, setLogStep] = useState(0);
  const [form, setForm] = useState({});
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scoreForm, setScoreForm] = useState({});

  const id = ideasData || {};
  const update = (key, val) => setIdeasData(prev => ({ ...prev, [key]: val }));
  const sessions = id.gmatSessions || [];
  const scores = id.gmatScores || [];
  const todayCapacity = (taskData || {}).capacity;
  const isStrongDay = todayCapacity === "strong" || todayCapacity === "average";

  const btnBase = { padding: "10px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, border: "none" };

  const saveSession = () => {
    if (!form.section || !form.duration) return;
    update("gmatSessions", [{ ...form, id: Date.now(), date: new Date().toISOString() }, ...sessions]);
    setForm({});
    setLogStep(0);
  };

  const saveScore = () => {
    if (!scoreForm.total) return;
    update("gmatScores", [{ ...scoreForm, id: Date.now(), date: new Date().toISOString() }, ...scores]);
    setScoreForm({});
    setShowScoreForm(false);
  };

  // Stats
  const totalMins = sessions.reduce((s, sess) => s + (parseInt(sess.duration) || 0), 0);
  const totalHrs = (totalMins / 60).toFixed(1);
  const thisWeekStart = (() => { const now = new Date(); const sun = new Date(now); sun.setDate(now.getDate() - now.getDay()); sun.setHours(0,0,0,0); return sun; })();
  const weekSessions = sessions.filter(s => new Date(s.date) >= thisWeekStart);
  const weekMins = weekSessions.reduce((s, sess) => s + (parseInt(sess.duration) || 0), 0);
  const latestScore = scores[0];

  const sharpMap = { sharp: "🟢", average: "🟡", sluggish: "🔴", scattered: "🔴" };

  return (
    <div>
      {/* Capacity nudge */}
      {isStrongDay && (
        <div style={{ background: "#0d2b1e", border: "1.5px solid #2D6A4F44", borderRadius: 10, padding: "11px 14px", marginBottom: 14, fontSize: 12, color: "#2D6A4F" }}>
          💪 <strong>Good brain day.</strong> Strong capacity logged — solid time to study.
        </div>
      )}

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Total hours", value: totalHrs, color: T.accent },
          { label: "This week", value: `${Math.round(weekMins/60*10)/10}h`, color: T.blue },
          { label: "Best score", value: latestScore?.total || "—", color: "#C4622D" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "11px 6px", background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log session button */}
      {logStep === 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setLogStep(1)} style={{ ...btnBase, flex: 2, background: T.accent, color: "#fff", fontSize: 13 }}>
            + Log Study Session
          </button>
          <button onClick={() => setShowScoreForm(!showScoreForm)} style={{ ...btnBase, flex: 1, background: "#2b1a0f", color: "#C4622D", border: "1px solid #C4622D44", fontSize: 12 }}>
            + Score
          </button>
        </div>
      )}

      {/* Score form */}
      {showScoreForm && (
        <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "18px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12 }}>Log Practice Test Score</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {[
              { key: "total", placeholder: "Total (205-805)" },
              { key: "quant", placeholder: "Quant" },
              { key: "verbal", placeholder: "Verbal" },
              { key: "di", placeholder: "DI" },
            ].map(f => (
              <input key={f.key} type="number" value={scoreForm[f.key] || ""} onChange={e => setScoreForm(p => ({...p, [f.key]: e.target.value}))}
                placeholder={f.placeholder} style={{ flex: 1, padding: "8px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 12, fontFamily: "inherit", minWidth: 0 }} />
            ))}
          </div>
          <textarea value={scoreForm.note || ""} onChange={e => setScoreForm(p => ({...p, note: e.target.value}))}
            placeholder="Notes on this test — what went well, what fell apart..." rows={2}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setShowScoreForm(false); setScoreForm({}); }} style={{ ...btnBase, background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>Cancel</button>
            <button onClick={saveScore} style={{ ...btnBase, flex: 1, background: scoreForm.total ? "#C4622D" : "#2a2a35", color: "#fff" }}>Save Score</button>
          </div>
        </div>
      )}

      {/* Step 1 — Section + Duration */}
      {logStep === 1 && (
        <div style={{ background: "#1a1a1f", border: `1.5px solid ${T.accent}`, borderRadius: 12, padding: "20px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Study Session · Step 1 of 2</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>What did you work on?</div>

          {GMAT_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setForm(p => ({...p, section: s.id}))} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
              borderRadius: 8, marginBottom: 7,
              border: `1.5px solid ${form.section === s.id ? s.color : T.border}`,
              background: form.section === s.id ? s.color + "18" : T.surface,
              color: T.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>
              <span>{s.label}</span>
            </button>
          ))}

          <div style={{ fontSize: 12, color: T.muted, marginBottom: 6, marginTop: 10, fontWeight: 600 }}>How long?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {["15 min", "30 min", "45 min", "1 hr", "1.5 hr", "2 hr", "2+ hr"].map(d => (
              <button key={d} onClick={() => setForm(p => ({...p, duration: d}))} style={{
                padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                border: `1.5px solid ${form.duration === d ? T.accent : T.border}`,
                background: form.duration === d ? T.accentLight : T.surface,
                color: form.duration === d ? T.accent : T.muted, fontWeight: form.duration === d ? 700 : 400,
              }}>{d}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setLogStep(0); setForm({}); }} style={{ ...btnBase, background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>Cancel</button>
            <button onClick={() => form.section && form.duration && setLogStep(2)} style={{ ...btnBase, flex: 1, background: (form.section && form.duration) ? T.accent : "#2a2a35", color: "#fff" }}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 2 — Brain sharpness + notes */}
      {logStep === 2 && (
        <div style={{ background: "#1a1a1f", border: `1.5px solid ${T.accent}`, borderRadius: 12, padding: "20px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Study Session · Step 2 of 2</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>How did your brain feel?</div>

          {[
            { v: "sharp",     e: "🟢", l: "Sharp — focused, things clicked" },
            { v: "average",   e: "🟡", l: "Average — got through it, nothing special" },
            { v: "sluggish",  e: "🟠", l: "Sluggish — slow but pushed through" },
            { v: "scattered", e: "🔴", l: "Scattered — hard to stay on anything" },
          ].map(o => (
            <button key={o.v} onClick={() => setForm(p => ({...p, sharpness: o.v}))} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
              borderRadius: 8, marginBottom: 7,
              border: `1.5px solid ${form.sharpness === o.v ? T.accent : T.border}`,
              background: form.sharpness === o.v ? T.accentLight : T.surface,
              color: T.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}><span>{o.e}</span><span>{o.l}</span></button>
          ))}

          <div style={{ fontSize: 12, color: T.muted, marginBottom: 6, marginTop: 8, fontWeight: 600 }}>Quick note? <span style={{ fontWeight: 400 }}>(optional)</span></div>
          <textarea value={form.note || ""} onChange={e => setForm(p => ({...p, note: e.target.value}))}
            placeholder="What you covered, what was hard, what clicked..."
            rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.faint, color: T.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 12 }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLogStep(1)} style={{ ...btnBase, background: T.surface, border: `1px solid ${T.border}`, color: T.muted }}>← Back</button>
            <button onClick={saveSession} style={{ ...btnBase, flex: 1, background: T.accent, color: "#fff" }}>Save Session ✓</button>
          </div>
        </div>
      )}

      {/* Score history */}
      {scores.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>📊 Score History</div>
          {/* Mini trend bar */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40, marginBottom: 10 }}>
            {scores.slice(0, 10).reverse().map((s, i) => {
              const pct = Math.min(100, Math.max(5, ((parseInt(s.total) - 205) / 600) * 100));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", borderRadius: 3, height: `${pct * 0.4}px`, background: "#C4622D", transition: "height 0.3s" }} />
                  <div style={{ fontSize: 9, color: T.muted }}>{s.total}</div>
                </div>
              );
            })}
          </div>
          {scores.slice(0, 5).map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: i === 0 ? "#2b1a0f" : T.surface, border: `1px solid ${i === 0 ? "#C4622D44" : T.border}`, borderRadius: 8, marginBottom: 5 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#C4622D" }}>{s.total}</span>
                {s.quant && <span style={{ fontSize: 11, color: T.muted, marginLeft: 8 }}>Q:{s.quant} V:{s.verbal} DI:{s.di}</span>}
              </div>
              <div style={{ fontSize: 11, color: T.muted }}>{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>Recent Sessions</div>
          {sessions.slice(0, 7).map((s, i) => {
            const sec = GMAT_SECTIONS.find(x => x.id === s.section);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{sec?.label || s.section} · {s.duration}</div>
                  {s.note && <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontStyle: "italic" }}>{s.note}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                  <div style={{ fontSize: 13 }}>{sharpMap[s.sharpness] || "—"}</div>
                  <div style={{ fontSize: 10, color: T.muted }}>{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sessions.length === 0 && logStep === 0 && (
        <div style={{ textAlign: "center", padding: "24px", color: T.muted, fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
          No sessions logged yet. Log your first study session to start tracking.
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// IDEAS IN TASKS
// ══════════════════════════════════════════════════════════════════════════

const PRESSURE_TEST_QUESTIONS = [
  { id: "who",     q: "Who has this problem?",                           hint: "Be specific. 'Everyone' is not an answer. A real person you could name or describe." },
  { id: "pay",     q: "Would they pay to solve it?",                     hint: "Have you asked anyone? What's your honest gut feeling — and why?" },
  { id: "build",   q: "Could you actually build or deliver this?",       hint: "What skills or connections do you have that make you a reasonable person to solve this?" },
  { id: "exists",  q: "Does anything like this already exist?",          hint: "Google for 20 minutes before answering. Competitors aren't a dealbreaker — they mean the market is real." },
  { id: "year",    q: "Would you still care about this in a year?",      hint: "Excitement fades. Frustration with a real problem doesn't. Which is this?" },
];

const DAILY_PROMPTS = [
  "What annoyed you today that felt like it shouldn't be that hard?",
  "What did someone ask for your help with this week?",
  "What did you search for online and find a terrible answer to?",
  "What's something you know how to do that most people don't?",
  "What industry do you understand better than most people because of your background?",
  "What problem have you personally lived through that you wish someone had solved?",
  "What would you build if you knew it would work?",
  "What do people always complain about in your network that nobody fixes?",
  "What inefficiency did you notice today — in your work, home, or daily life?",
  "What did you pay for recently where you thought 'I could do this better'?",
];

export function IdeasInTasks({ ideasData, setIdeasData, taskData, setTaskData }) {
  const [view, setView] = useState("capture");
  const [newIdea, setNewIdea] = useState("");
  const [newLog, setNewLog] = useState("");
  const [expandedIdea, setExpandedIdea] = useState(null);
  const [ptAnswer, setPtAnswer] = useState("");

  const id = ideasData || {};
  const update = (key, val) => setIdeasData(prev => ({ ...prev, [key]: val }));

  const rawIdeas = id.rawIdeas || [];
  const testIdeas = id.testIdeas || [];
  const explorationLogs = id.explorationLogs || [];

  // Daily prompt — rotates by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayPrompt = DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];

  // Capacity nudge — check today's task capacity
  const todayCapacity = (taskData || {}).capacity;
  const isStrongDay = todayCapacity === "strong" || todayCapacity === "average";

  // Add raw idea
  const addRawIdea = () => {
    if (!newIdea.trim()) return;
    update("rawIdeas", [{ id: Date.now(), text: newIdea.trim(), date: new Date().toISOString() }, ...rawIdeas]);
    setNewIdea("");
  };

  // Promote to pressure test
  const promoteIdea = (idea) => {
    const already = testIdeas.find(t => t.sourceId === idea.id);
    if (already) { setExpandedIdea(already.id); setView("test"); return; }
    const newTest = {
      id: Date.now(), sourceId: idea.id, text: idea.text,
      promotedAt: new Date().toISOString(), answers: {}, status: "exploring",
    };
    update("testIdeas", [newTest, ...testIdeas]);
    setExpandedIdea(newTest.id);
    setView("test");
  };

  // Save pressure test answer
  const savePTAnswer = (ideaId, questionId, answer) => {
    update("testIdeas", testIdeas.map(t =>
      t.id === ideaId ? { ...t, answers: { ...t.answers, [questionId]: { text: answer, savedAt: new Date().toISOString() } } } : t
    ));
    setPtAnswer("");
  };

  // Add exploration log entry
  const addLog = () => {
    if (!newLog.trim()) return;
    update("explorationLogs", [{ id: Date.now(), text: newLog.trim(), date: new Date().toISOString() }, ...explorationLogs]);
    setNewLog("");
  };

  // Send exploration step to Tasks
  const sendToTasks = (text) => {
    const dump = (taskData || {}).dump || [];
    setTaskData(prev => ({ ...prev, dump: [{ id: Date.now(), text }, ...dump] }));
  };

  const btnBase = { padding: "10px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, border: "none" };

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* Capacity nudge */}
      {isStrongDay && (
        <div style={{ background: "#0d2b1e", border: "1.5px solid #2D6A4F44", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: "#2D6A4F", lineHeight: 1.6 }}>
          💪 <strong>You have capacity today.</strong> Even 10 minutes on your ideas tab is worth it on a good brain day.
        </div>
      )}

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
        {[
          { id: "capture", label: "💡 Capture" },
          { id: "test",    label: "🔬 Pressure Test" },
          { id: "explore", label: "🚶 Explore" },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flexShrink: 0, padding: "8px 16px", borderRadius: 20, fontSize: 12,
            border: `1.5px solid ${view === t.id ? T.accent : T.border}`,
            background: view === t.id ? T.accentLight : T.surface,
            color: view === t.id ? T.accent : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: view === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── CAPTURE ── */}
      {view === "capture" && (
        <div className="fade">
          {/* Daily prompt */}
          <div style={{ background: "#1a1a1f", border: "1.5px solid #E8E4DC", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, marginBottom: 8 }}>Today's prompt</div>
            <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6, fontStyle: "italic" }}>"{todayPrompt}"</div>
          </div>

          {/* Input */}
          <div style={{ background: "#16161c", border: "1px dashed #E8E4DC", borderRadius: 10, padding: "12px 14px", marginBottom: 10, fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
            💡 <strong style={{ color: T.text }}>No filter, no judgment.</strong> Half-baked is fine. Obvious is fine. Stupid is fine. Just write it down.
          </div>
          <textarea value={newIdea} onChange={e => setNewIdea(e.target.value)}
            placeholder="What's the idea, or what problem did you notice?"
            rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#1a1a1f", color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 8 }} />
          <button onClick={addRawIdea} style={{ ...btnBase, width: "100%", background: T.accent, color: "#fff", marginBottom: 20 }}>Capture it</button>

          {/* Raw ideas list */}
          {rawIdeas.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: T.muted, fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
              Nothing yet. Answer today's prompt, or just write down whatever crossed your mind.
            </div>
          )}
          {rawIdeas.map(idea => (
            <div key={idea.id} style={{ background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 10, padding: "13px 14px", marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: T.text, marginBottom: 6, lineHeight: 1.5 }}>{idea.text}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: T.muted }}>{new Date(idea.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => promoteIdea(idea)} style={{ ...btnBase, padding: "5px 10px", fontSize: 11, background: "#0d2b1e", color: "#2D6A4F", border: "1px solid #2D6A4F44" }}>
                    → Pressure test
                  </button>
                  <button onClick={() => update("rawIdeas", rawIdeas.filter(r => r.id !== idea.id))} style={{ ...btnBase, padding: "5px 8px", fontSize: 11, background: "transparent", color: T.muted, border: "1px solid #E8E4DC" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRESSURE TEST ── */}
      {view === "test" && (
        <div className="fade">
          <div style={{ fontSize: 12, color: T.muted, background: "#16161c", padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6 }}>
            🔬 <strong style={{ color: T.text }}>Five honest questions.</strong> Answer one at a time, over days. No rush. Clarity builds slowly.
          </div>

          {testIdeas.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: T.muted, fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
              No ideas in pressure test yet. Capture an idea first, then promote it here.
            </div>
          )}

          {testIdeas.map(idea => {
            const isOpen = expandedIdea === idea.id;
            const answeredCount = Object.keys(idea.answers || {}).length;
            return (
              <div key={idea.id} style={{ background: "#1a1a1f", border: "1.5px solid #E8E4DC", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                {/* Header */}
                <div onClick={() => setExpandedIdea(isOpen ? null : idea.id)}
                  style={{ padding: "13px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>{idea.text}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{answeredCount} of 5 questions answered</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Progress dots */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {PRESSURE_TEST_QUESTIONS.map(q => (
                        <div key={q.id} style={{ width: 8, height: 8, borderRadius: "50%", background: idea.answers?.[q.id] ? T.accent : "#2a2a35" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: T.muted }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Questions */}
                {isOpen && (
                  <div style={{ padding: "0 16px 16px" }}>
                    {PRESSURE_TEST_QUESTIONS.map((q, qi) => {
                      const saved = idea.answers?.[q.id];
                      return (
                        <div key={q.id} style={{ borderTop: "1px solid #E8E4DC", paddingTop: 12, marginTop: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                            {qi + 1}. {q.q}
                          </div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontStyle: "italic" }}>{q.hint}</div>
                          {saved ? (
                            <div>
                              <div style={{ fontSize: 12, color: T.text, background: "#16161c", padding: "9px 12px", borderRadius: 8, marginBottom: 6, lineHeight: 1.5 }}>{saved.text}</div>
                              <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Saved {new Date(saved.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              <button onClick={() => {
                                update("testIdeas", testIdeas.map(t => t.id === idea.id
                                  ? { ...t, answers: Object.fromEntries(Object.entries(t.answers).filter(([k]) => k !== q.id)) }
                                  : t
                                ));
                              }} style={{ ...btnBase, padding: "5px 10px", fontSize: 11, background: "transparent", color: T.muted, border: "1px solid #E8E4DC" }}>Edit answer</button>
                            </div>
                          ) : (
                            <div>
                              <textarea
                                placeholder="Take your time. Come back to this."
                                rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: T.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 8 }}
                                onBlur={e => e.target.value.trim() && savePTAnswer(idea.id, q.id, e.target.value.trim())}
                                defaultValue=""
                              />
                              <div style={{ fontSize: 11, color: T.muted }}>Click away to save</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                      <button onClick={() => sendToTasks(`Research idea: ${idea.text}`)} style={{ ...btnBase, padding: "7px 12px", fontSize: 11, background: "#0d2b1e", color: "#2D6A4F", border: "1px solid #2D6A4F44" }}>
                        → Send to Tasks
                      </button>
                      <button onClick={() => {
                        if (window.confirm("Remove this idea from pressure test?"))
                          update("testIdeas", testIdeas.filter(t => t.id !== idea.id));
                      }} style={{ ...btnBase, padding: "7px 10px", fontSize: 11, background: "transparent", color: T.muted, border: "1px solid #E8E4DC" }}>Remove</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── EXPLORE ── */}
      {view === "explore" && (
        <div className="fade">
          <div style={{ fontSize: 12, color: T.muted, background: "#16161c", padding: "10px 14px", borderRadius: 8, marginBottom: 14, lineHeight: 1.6 }}>
            🚶 <strong style={{ color: T.text }}>Tiny next actions, not a roadmap.</strong> Log what you explored. Send steps to your task list when you're ready to act.
          </div>

          {/* Quick action ideas */}
          <div style={{ background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 10, padding: "13px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Starting moves — pick one</div>
            {[
              "Google whether this problem already has solutions",
              "Find 3 people who might have this problem and write their names",
              "Ask one person today if they've ever felt this frustration",
              "Spend 20 min reading about this market or industry",
              "Write down what 'version 1' of this would look like",
              "Find one person on LinkedIn who built something similar",
              "Look up if there are any subreddits or forums about this problem",
            ].map((action, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #E8E4DC" }}>
                <span style={{ fontSize: 12, color: T.text, flex: 1, paddingRight: 8 }}>{action}</span>
                <button onClick={() => sendToTasks(action)} style={{ ...btnBase, padding: "4px 10px", fontSize: 11, background: "#0d2b1e", color: "#2D6A4F", border: "1px solid #2D6A4F44", flexShrink: 0 }}>+ Tasks</button>
              </div>
            ))}
          </div>

          {/* Log an exploration */}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>Log what you explored</div>
          <textarea value={newLog} onChange={e => setNewLog(e.target.value)}
            placeholder="What did you do? What did you find? Even 10 minutes of googling counts."
            rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#1a1a1f", color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 8 }} />
          <button onClick={addLog} style={{ ...btnBase, width: "100%", background: T.accent, color: "#fff", marginBottom: 20 }}>Log it</button>

          {/* Log history */}
          {explorationLogs.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: T.muted, fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
              Nothing logged yet. Any small action counts.
            </div>
          )}
          {explorationLogs.map(log => (
            <div key={log.id} style={{ background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 8, padding: "11px 13px", marginBottom: 6 }}>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5, marginBottom: 4 }}>{log.text}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: T.muted }}>{new Date(log.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                <button onClick={() => update("explorationLogs", explorationLogs.filter(l => l.id !== log.id))} style={{ ...btnBase, padding: "4px 8px", fontSize: 11, background: "transparent", color: T.muted, border: "1px solid #E8E4DC" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TASKS TAB
// ══════════════════════════════════════════════════════════════════════════

function TasksTab({ taskData, setTaskData, ideasData, setIdeasData }) {
  const [view, setView] = useState("today");
  const [paralysisMode, setParalysisMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDumpPicker, setShowDumpPicker] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", cat: "Job Search", size: "quick", mins: "" });
  const [newDump, setNewDump] = useState("");
  const [newThought, setNewThought] = useState("");
  const [setupStep, setSetupStep] = useState(0);
  const [setupAnswers, setSetupAnswers] = useState({});
  const [oneThingInput, setOneThingInput] = useState("");
  const [breakingDown, setBreakingDown] = useState(null);
  const [breakdownText, setBreakdownText] = useState("");
  const [planStep, setPlanStep] = useState(0); // 0=idle 1=energy 2=area 3=task 4=done
  const [planAnswers, setPlanAnswers] = useState({});
  const [weeklyStep, setWeeklyStep] = useState(0); // 0=idle 1=wins 2=undone 3=rank 4=anchor 5=done
  const [weeklyAnswers, setWeeklyAnswers] = useState({});
  const [mediaLogStep, setMediaLogStep] = useState(0);
  const [mediaNewLog, setMediaNewLog] = useState({});
  const [showWaiting, setShowWaiting] = useState(false);

  const td = taskData || {};
  const activeTasks = td.active || [];
  const dumpTasks = td.dump || [];
  const thoughts = td.thoughts || [];
  const oneThing = td.oneThing || null;
  const capacity = td.capacity || null;
  const weeklyWins = td.weeklyWins || [];

  const update = (key, val) => setTaskData(prev => ({ ...prev, [key]: val }));
  const weeklyFocus = td.weeklyFocus || null;
  const weeklyAnchor = td.weeklyAnchor || null;
  const isSunday = new Date().getDay() === 0;
  const thisWeekStart = (() => { const now = new Date(); const sun = new Date(now); sun.setDate(now.getDate() - now.getDay()); sun.setHours(0,0,0,0); return sun; })();
  const thisWeekWins = weeklyWins.filter(w => new Date(w.completedAt) >= thisWeekStart);

  const addActive = (task) => {
    if (activeTasks.length >= 5) return;
    update("active", [...activeTasks, { ...task, id: Date.now(), done: false }]);
  };

  const addDump = (text) => {
    if (!text.trim()) return;
    update("dump", [...dumpTasks, { id: Date.now(), text: text.trim() }]);
    setNewDump("");
  };

  const addThought = (text) => {
    if (!text.trim()) return;
    update("thoughts", [...thoughts, { id: Date.now(), text: text.trim(), date: new Date().toLocaleDateString() }]);
    setNewThought("");
  };

  const completeTask = (id) => {
    const task = activeTasks.find(t => t.id === id);
    const updated = activeTasks.filter(t => t.id !== id);
    update("active", updated);
    if (task) update("weeklyWins", [...weeklyWins, { ...task, completedAt: new Date().toISOString() }]);
    if (updated.length === 0) setShowCelebration(true);
  };

  const completeOneThing = () => {
    if (!oneThing) return;
    update("weeklyWins", [...weeklyWins, { text: oneThing, completedAt: new Date().toISOString(), isOneThing: true }]);
    update("oneThing", null);
    setSetupStep(0);
    setSetupAnswers({});
    setOneThingInput("");
  };

  const promoteFromDump = (dumpTask) => {
    if (activeTasks.length >= 5) return;
    update("dump", dumpTasks.filter(t => t.id !== dumpTask.id));
    addActive({ text: dumpTask.text, cat: "Other", size: "quick", mins: "10" });
    setShowDumpPicker(false);
  };

  const cantDecide = () => {
    const quickTasks = activeTasks.filter(t => t.size === "quick");
    if (quickTasks.length > 0) {
      update("oneThing", quickTasks[0].text);
    } else if (dumpTasks.length > 0) {
      update("oneThing", dumpTasks[0].text);
    } else {
      update("oneThing", "Take your medications and drink a glass of water");
    }
    update("capacity", "average");
    setSetupStep(4);
  };

  const finishSetup = () => {
    const suggested = oneThingInput || setupAnswers.nag || "Take your medications and check in with yourself";
    update("oneThing", suggested);
    update("capacity", setupAnswers.energy || "average");
    setSetupStep(4);
  };

  const doneCount = weeklyWins.filter(w => {
    const d = new Date(w.completedAt);
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0,0,0,0);
    return d >= sunday;
  }).length;

  const btnBase = {
    padding: "10px 14px", borderRadius: 8, fontSize: 16,
    cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
    border: "none", transition: "all 0.15s",
  };

  if (paralysisMode) {
    const quickTask = activeTasks.find(t => t.size === "quick");
    return (
      <div style={{ paddingTop: 16, paddingBottom: 40 }}>
        <div style={{ background: "#0f1e30", border: "1.5px solid #2D5A8A", borderRadius: 12, padding: "20px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🧘</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2D5A8A", marginBottom: 6 }}>Paralysis Mode</div>
          <div style={{ fontSize: 16, color: "#6b6a72", marginBottom: 16, lineHeight: 1.6 }}>Everything is hidden. Just these two things exist right now.</div>
          <button onClick={() => setParalysisMode(false)} style={{ ...btnBase, background: "#1a1a1f", color: "#6b6a72", border: "1.5px solid #E8E4DC", fontSize: 12 }}>← Show everything again</button>
        </div>
        {oneThing && (
          <div style={{ background: "#1a1a1f", border: "2px solid #2D6A4F", borderRadius: 12, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2D6A4F", marginBottom: 8, fontWeight: 700 }}>☀️ Your One Thing</div>
            <div style={{ fontSize: 20, color: "#e8e6e0", fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>{oneThing}</div>
            <button onClick={completeOneThing} style={{ ...btnBase, background: "#2D6A4F", color: "#fff", width: "100%" }}>✓ Done</button>
          </div>
        )}
        {quickTask && (
          <div style={{ background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 12, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6a72", marginBottom: 8, fontWeight: 700 }}>One Quick Task ⚡</div>
            <div style={{ fontSize: 20, color: "#e8e6e0", marginBottom: 14 }}>{quickTask.text}</div>
            <button onClick={() => completeTask(quickTask.id)} style={{ ...btnBase, background: "#0d2b1e", color: "#2D6A4F", width: "100%" }}>✓ Done</button>
          </div>
        )}
        {!oneThing && !quickTask && (
          <div style={{ background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 12, padding: "32px 22px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
            <div style={{ fontSize: 20, color: "#6b6a72" }}>Nothing on your list right now. Rest is valid.</div>
          </div>
        )}
      </div>
    );
  }

  // Capacity-aware suggestion from Brain Dump
  const suggestion = dumpTasks.length > 0 ? dumpTasks[0] : null;
  const capacityLabel = capacity ? CAPACITY_OPTIONS.find(c => c.id === capacity)?.label : null;

  // Today's done items (completedAt today)
  const todayStr = new Date().toDateString();
  const todayDone = weeklyWins.filter(w => new Date(w.completedAt).toDateString() === todayStr);

  // ── TRIAGE LOGIC ──
  // pinnedIds resets each day at midnight via stored date
  const triageDateKey = new Date().toDateString();
  const storedTriage = td.triage || {};
  const pinnedIds = (storedTriage.date === triageDateKey ? storedTriage.pinned : []) || [];
  const triageNeeded = dumpTasks.length > 3 && pinnedIds.length === 0;
  const [triageSelecting, setTriageSelecting] = React.useState(false);
  const [triagePicks, setTriagePicks] = React.useState([]);

  const completeAndReplenish = (task) => {
    const newDump = dumpTasks.filter(d => d.id !== task.id);
    const newPinned = pinnedIds.filter(id => id !== task.id);
    const newWaiting = newDump.filter(t => !newPinned.includes(t.id));
    const finalPinned = newPinned.length === 0 && newWaiting.length > 0
      ? newWaiting.slice(0, 3).map(t => t.id)
      : newPinned;
    update("weeklyWins", [...weeklyWins, { text: task.text, completedAt: new Date().toISOString() }]);
    update("dump", newDump);
    update("triage", { date: triageDateKey, pinned: finalPinned });
  };

  const saveTriage = (picks) => {
    update("triage", { date: triageDateKey, pinned: picks });
    setTriageSelecting(false);
    setTriagePicks([]);
  };

  const pinnedTasks = pinnedIds.length > 0
    ? dumpTasks.filter(t => pinnedIds.includes(t.id))
    : dumpTasks.slice(0, 3);
  const waitingTasks = pinnedIds.length > 0
    ? dumpTasks.filter(t => !pinnedIds.includes(t.id))
    : dumpTasks.slice(3);

  // ── TOMORROW'S FOCUS from last evening check-in ──
  const tomorrowFocus = (() => {
    const stored = load();
    const allEntries = stored.entries || [];
    if (allEntries.length === 0) return null;
    const latest = allEntries[0];
    const latestDate = new Date(latest.date).toDateString();
    const focus = latest?.end_of_day?.tomorrowFocus || latest?.endOfDay?.tomorrowFocus;
    // Only show if it was set yesterday or today
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (latestDate === new Date().toDateString() || latestDate === yesterday.toDateString()) {
      return focus || null;
    }
    return null;
  })();

  return (
    <div style={{ paddingTop: 16, paddingBottom: 60 }}>

      {/* ── TOMORROW'S FOCUS BANNER ── */}
      {tomorrowFocus && (
        <div style={{ background: T.blueLight, border: `1.5px solid ${T.blue}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🌙</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.blue, marginBottom: 2 }}>You decided last night</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{tomorrowFocus}</div>
          </div>
        </div>
      )}

      {/* ── SUNDAY WEEKLY REVIEW NUDGE (auto-surfaced) ── */}
      {isSunday && weeklyStep === 0 && (() => {
        // Only show if review hasn't been done since this Sunday
        const reviewDoneThisWeek = weeklyAnchor && (() => {
          const stored = td.weeklyAnchorSetAt;
          return stored && new Date(stored) >= thisWeekStart;
        })();
        if (reviewDoneThisWeek) return null;
        return (
          <div style={{ background: "#2b1a0f", border: "2px solid #C4622D", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C4622D" }}>📅 It's Sunday — weekly review time</div>
              <button onClick={() => update("_sundayDismissed", new Date().toDateString())} style={{ background: "transparent", border: "none", color: "#6b6a72", fontSize: 16, cursor: "pointer", lineHeight: 1, padding: "0 0 0 8px" }}>✕</button>
            </div>
            <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 12, lineHeight: 1.5 }}>10 minutes to reflect on the week and set your focus for what's next.</div>
            <button onClick={() => { setView("weekly"); setWeeklyStep(1); }} style={{ ...btnBase, background: "#C4622D", color: "#fff", width: "100%", fontSize: 13 }}>
              Start Weekly Review →
            </button>
          </div>
        );
      })()}

      {/* ── TRIAGE CARD — only when >3 items and not yet triaged today ── */}
      {triageNeeded && !triageSelecting && (
        <div style={{ background: T.warnLight, border: `2px solid ${T.warn}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.warn, marginBottom: 4 }}>Your list has {dumpTasks.length} things on it.</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>A list that size doesn't work — it just creates pressure. Pick the 3 that matter most right now. Everything else waits.</div>
          <button onClick={() => setTriageSelecting(true)} style={{ ...btnBase, background: T.warn, color: "#fff", width: "100%", fontSize: 13 }}>Pick my 3 →</button>
        </div>
      )}

      {/* ── TRIAGE PICKER ── */}
      {triageSelecting && (
        <div style={{ background: T.warnLight, border: `2px solid ${T.warn}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.warn, marginBottom: 4 }}>Tap 3 that matter most right now</div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>{triagePicks.length}/3 selected</div>
          {dumpTasks.map(t => {
            const picked = triagePicks.includes(t.id);
            return (
              <button key={t.id} onClick={() => {
                if (picked) setTriagePicks(prev => prev.filter(id => id !== t.id));
                else if (triagePicks.length < 3) setTriagePicks(prev => [...prev, t.id]);
              }} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "10px 14px", borderRadius: 8, marginBottom: 6, cursor: "pointer", fontFamily: "inherit",
                border: `1.5px solid ${picked ? T.warn : T.border}`,
                background: picked ? T.warn + "18" : T.surface,
                color: T.text, fontSize: 13,
              }}>
                <span style={{ fontSize: 16, color: picked ? T.warn : T.border, flexShrink: 0 }}>{picked ? "●" : "○"}</span>
                {t.text}
              </button>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { setTriageSelecting(false); setTriagePicks([]); }} style={{ ...btnBase, background: T.surface, border: `1px solid ${T.border}`, color: T.muted, fontSize: 12 }}>Cancel</button>
            <button onClick={() => saveTriage(triagePicks)} disabled={triagePicks.length !== 3} style={{ ...btnBase, flex: 1, background: triagePicks.length === 3 ? T.warn : "#2a2a35", color: "#fff", fontSize: 13 }}>
              {triagePicks.length === 3 ? "Set my 3 →" : `Pick ${3 - triagePicks.length} more`}
            </button>
          </div>
        </div>
      )}

      {/* ── INPUT FIRST ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newDump}
          onChange={e => setNewDump(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && newDump.trim()) { addDump(newDump); } }}
          placeholder="What's on your plate? Add anything..."
          style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#1a1a1f", color: "#e8e6e0", fontSize: 15, fontFamily: "inherit" }}
        />
        <button onClick={() => { if (newDump.trim()) addDump(newDump); }} style={{ ...btnBase, background: "#2D6A4F", color: "#fff", padding: "12px 18px", fontSize: 15 }}>Add</button>
      </div>

      {/* ── WHAT NOW? SUGGESTION ── */}
      {pinnedTasks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 8 }}>
            What now?
          </div>
          <div style={{ background: "#1a1a1f", border: "2px solid #2D6A4F", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 12, lineHeight: 1.5 }}>{pinnedTasks[0].text}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => {
                const t = pinnedTasks[0];
                completeAndReplenish(t);
              }} style={{ ...btnBase, flex: 1, background: "#2D6A4F", color: "#fff", fontSize: 13 }}>✓ Done</button>
              <button onClick={() => {
                const t = pinnedTasks[0];
                const rest = dumpTasks.filter(d => d.id !== t.id);
                update("dump", [...rest, t]);
                update("triage", { date: triageDateKey, pinned: pinnedIds.filter(id => id !== t.id) });
              }} style={{ ...btnBase, background: "#1a1a1f", border: "1.5px solid #E8E4DC", color: "#6b6a72", fontSize: 12 }}>Skip →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOCUS LIST (pinned 3) ── */}
      {pinnedTasks.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 8 }}>
            {pinnedIds.length > 0 ? `Your 3 (${pinnedTasks.length} left)` : `On your list (${dumpTasks.length})`}
          </div>
          {pinnedTasks.map((t, i) => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#1a1a1f", border: "1px solid #E8E4DC",
              borderRadius: 8, padding: "11px 14px", marginBottom: 6,
            }}>
              <button onClick={() => {
                completeAndReplenish(t);
              }} style={{
                width: 24, height: 24, borderRadius: "50%", border: "2px solid #2D6A4F",
                background: "transparent", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#2D6A4F",
              }}> </button>
              <span style={{ fontSize: 14, color: "#e8e6e0", flex: 1, lineHeight: 1.4 }}>
                {i === 0 && <span style={{ fontSize: 10, color: "#2D6A4F", fontWeight: 700, marginRight: 6, textTransform: "uppercase" }}>↑ up next</span>}
                {t.text}
              </span>
              <button onClick={() => {
                update("dump", dumpTasks.filter(d => d.id !== t.id));
                update("triage", { date: triageDateKey, pinned: pinnedIds.filter(id => id !== t.id) });
              }} style={{ ...btnBase, padding: "4px 8px", fontSize: 11, background: "transparent", border: "none", color: "#C8C4BC" }}>✕</button>
            </div>
          ))}
          {pinnedIds.length > 0 && pinnedTasks.length > 0 && (
            <button onClick={() => update("triage", { date: triageDateKey, pinned: [] })} style={{ ...btnBase, fontSize: 11, background: "transparent", border: `1px solid ${T.border}`, color: T.muted, marginTop: 4 }}>
              Re-triage →
            </button>
          )}
        </div>
      )}

      {/* ── WAITING SECTION ── */}
      {waitingTasks.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setShowWaiting(w => !w)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
            padding: "9px 13px", borderRadius: 8, background: T.faint, border: `1px solid ${T.border}`,
            color: T.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>
            <span>⏳ Waiting ({waitingTasks.length})</span>
            <span>{showWaiting ? "▲" : "▼"}</span>
          </button>
          {showWaiting && (
            <div style={{ marginTop: 6 }}>
              {waitingTasks.map(t => (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 10, opacity: 0.6,
                  background: "#1a1a1f", border: "1px solid #E8E4DC",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 5,
                }}>
                  <span style={{ fontSize: 13, color: T.muted, flex: 1 }}>{t.text}</span>
                  <button onClick={() => update("dump", dumpTasks.filter(d => d.id !== t.id))} style={{ ...btnBase, padding: "4px 8px", fontSize: 11, background: "transparent", border: "none", color: "#C8C4BC" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {dumpTasks.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px 20px", color: "#6b6a72", fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
          List is clear. Add something above to get started.
        </div>
      )}

      {/* ── DONE TODAY ── */}
      {todayDone.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2D6A4F", marginBottom: 8 }}>
            ✓ Done today ({todayDone.length})
          </div>
          {todayDone.slice().reverse().map((w, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#0d2b1e", border: "1px solid #2D6A4F22",
              borderRadius: 8, padding: "10px 14px", marginBottom: 5,
            }}>
              <span style={{ fontSize: 14, color: "#2D6A4F" }}>✓</span>
              <span style={{ fontSize: 13, color: "#2D6A4F", flex: 1, textDecoration: "line-through", opacity: 0.7 }}>{w.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── CAPACITY ROW ── */}
      <div style={{ marginBottom: 20 }}>
        {!capacity ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 4 }}>How's your brain today?</div>
            <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 8 }}>Self-awareness check — doesn't change what's on your list, just helps you be honest with yourself about the day.</div>
            <div style={{ display: "flex", gap: 6 }}>
              {CAPACITY_OPTIONS.map(o => (
                <button key={o.id} onClick={() => update("capacity", o.id)} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11,
                  border: "1.5px solid #E8E4DC", background: "#1a1a1f",
                  color: "#e8e6e0", cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{o.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{o.label.split(" ").slice(1).join(" ")}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#16161c", border: "1px solid #E8E4DC", borderRadius: 8, padding: "9px 13px" }}>
            <span style={{ fontSize: 12, color: "#6b6a72" }}>Capacity: <strong style={{ color: "#e8e6e0" }}>{capacityLabel}</strong></span>
            <button onClick={() => update("capacity", null)} style={{ background: "transparent", border: "none", fontSize: 11, color: "#6b6a72", cursor: "pointer", fontFamily: "inherit" }}>change</button>
          </div>
        )}
      </div>

      {/* ── SECONDARY NAV ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
        {[{ id: "weekly", label: "📅 This Week" }, { id: "thoughts", label: "💭 Thoughts" }, { id: "ideas", label: "💡 Ideas" }].map(v => (
          <button key={v.id} onClick={() => setView(view === v.id ? "today" : v.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12,
            border: `1.5px solid ${view === v.id ? "#2D6A4F" : "#2a2a35"}`,
            background: view === v.id ? "#0d2b1e" : "#1a1a1f",
            color: view === v.id ? "#2D6A4F" : "#6b6a72",
            cursor: "pointer", fontFamily: "inherit", fontWeight: view === v.id ? 700 : 400,
          }}>{v.label}</button>
        ))}
      </div>

      {/* ── OVERWHELMED ── */}
      <button onClick={() => setParalysisMode(true)} style={{ ...btnBase, width: "100%", background: "#2b1a0f", color: "#C4622D", border: "1.5px solid #C4622D44", fontSize: 12, marginBottom: 20 }}>
        😰 Overwhelmed — strip everything away
      </button>

      {view === "weekly" && (
        <div className="fade">
          {weeklyFocus && weeklyStep === 0 && (
            <div style={{ background: "#0d2b1e", border: "1.5px solid #2D6A4F", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2D6A4F", marginBottom: 4 }}>This Week's Focus</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 4 }}>{LIFE_AREAS.find(a => a.id === weeklyFocus)?.label || weeklyFocus}</div>
              {weeklyAnchor && <div style={{ fontSize: 13, color: "#6b6a72", fontStyle: "italic" }}>"{weeklyAnchor}"</div>}
            </div>
          )}
          {isSunday && weeklyStep === 0 && (
            <div style={{ background: "#2b1a0f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C4622D", marginBottom: 4 }}>📅 Sunday — Weekly Review Time</div>
              <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 12, lineHeight: 1.5 }}>10 minutes to set your focus for the week.</div>
              <button onClick={() => setWeeklyStep(1)} style={{ ...btnBase, background: "#C4622D", color: "#fff", width: "100%", fontSize: 13 }}>Start Weekly Review →</button>
            </div>
          )}
          {weeklyStep === 1 && (
            <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 4 }}>Weekly Review · Step 1 of 4</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 8, lineHeight: 1.4 }}>What actually happened this week?</div>
              <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 12 }}>Look at what you completed. Even small things count.</div>
              {thisWeekWins.length === 0
                ? <div style={{ fontSize: 13, color: "#6b6a72", fontStyle: "italic", marginBottom: 12 }}>Nothing logged yet — that's okay. This week is starting now.</div>
                : thisWeekWins.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "8px 10px", background: "#16161c", borderRadius: 6, marginBottom: 4, fontSize: 12, color: "#e8e6e0" }}>
                    <span>{w.isOneThing ? "☀️" : "✅"}</span><span>{w.text}</span>
                  </div>
                ))
              }
              <button onClick={() => setWeeklyStep(2)} style={{ ...btnBase, background: "#C4622D", color: "#fff", width: "100%", marginTop: 8, fontSize: 13 }}>Next →</button>
            </div>
          )}
          {weeklyStep === 2 && (
            <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 4 }}>Weekly Review · Step 2 of 4</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 6, lineHeight: 1.4 }}>What's still sitting undone that's been nagging you?</div>
              <textarea value={weeklyAnswers.undone || ""} onChange={e => setWeeklyAnswers(p => ({...p, undone: e.target.value}))}
                placeholder="e.g. still haven't followed up with the recruiter..." rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 12 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setWeeklyStep(1)} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72", fontSize: 13 }}>← Back</button>
                <button onClick={() => setWeeklyStep(3)} style={{ ...btnBase, flex: 1, background: "#C4622D", color: "#fff", fontSize: 13 }}>Next →</button>
              </div>
            </div>
          )}
          {weeklyStep === 3 && (
            <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 4 }}>Weekly Review · Step 3 of 4</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 6, lineHeight: 1.4 }}>Which area of life needs the most attention this week?</div>
              {LIFE_AREAS.map(a => (
                <button key={a.id} onClick={() => setWeeklyAnswers(p => ({...p, focus: a.id}))} style={{
                  display: "flex", flexDirection: "column", width: "100%", padding: "11px 14px", borderRadius: 8, marginBottom: 6,
                  border: `1.5px solid ${weeklyAnswers.focus === a.id ? "#C4622D" : "#2a2a35"}`,
                  background: weeklyAnswers.focus === a.id ? "#2b1a0f" : "#1a1a1f",
                  color: "#e8e6e0", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</span>
                  <span style={{ fontSize: 11, color: "#6b6a72", marginTop: 2 }}>{a.desc}</span>
                </button>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => setWeeklyStep(2)} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72", fontSize: 13 }}>← Back</button>
                <button onClick={() => weeklyAnswers.focus && setWeeklyStep(4)} style={{ ...btnBase, flex: 1, background: weeklyAnswers.focus ? "#C4622D" : "#2a2a35", color: "#fff", fontSize: 13 }}>Next →</button>
              </div>
            </div>
          )}
          {weeklyStep === 4 && (
            <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 4 }}>Weekly Review · Step 4 of 4</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 4, lineHeight: 1.4 }}>What's the one thing that needs to happen this week no matter what?</div>
              <input value={weeklyAnswers.anchor || ""} onChange={e => setWeeklyAnswers(p => ({...p, anchor: e.target.value}))}
                placeholder="e.g. submit the Qualtrics application..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setWeeklyStep(3)} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72", fontSize: 13 }}>← Back</button>
                <button onClick={() => {
                  if (!weeklyAnswers.anchor?.trim()) return;
                  update("weeklyFocus", weeklyAnswers.focus);
                  update("weeklyAnchor", weeklyAnswers.anchor);
                  update("weeklyAnchorSetAt", new Date().toISOString());
                  const alreadyActive = activeTasks.some(t => t.text === weeklyAnswers.anchor);
                  if (!alreadyActive) update("dump", [...dumpTasks, { id: Date.now(), text: weeklyAnswers.anchor }]);
                  setWeeklyStep(5);
                }} style={{ ...btnBase, flex: 1, background: weeklyAnswers.anchor?.trim() ? "#C4622D" : "#2a2a35", color: "#fff", fontSize: 13 }}>Save Weekly Plan ✓</button>
              </div>
            </div>
          )}
          {weeklyStep === 5 && (
            <div style={{ background: "#0d2b1e", border: "2px solid #2D6A4F", borderRadius: 12, padding: "24px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#2D6A4F", marginBottom: 8 }}>Weekly plan set</div>
              <div style={{ fontSize: 13, color: "#6b6a72", marginBottom: 6, lineHeight: 1.6 }}>Focus: <strong>{LIFE_AREAS.find(a => a.id === weeklyAnswers.focus)?.label}</strong></div>
              <div style={{ fontSize: 13, color: "#6b6a72", marginBottom: 16, fontStyle: "italic" }}>"{weeklyAnswers.anchor}"</div>
              <button onClick={() => { setWeeklyStep(0); setWeeklyAnswers({}); }} style={{ ...btnBase, background: "#2D6A4F", color: "#fff", width: "100%", fontSize: 13 }}>Done ✓</button>
            </div>
          )}
          {weeklyStep === 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 10 }}>🏆 This Week's Wins — {thisWeekWins.length} completed</div>
              {thisWeekWins.length === 0 && <div style={{ textAlign: "center", padding: "20px", color: "#6b6a72", fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>No wins yet this week. Complete something to start building the record.</div>}
              {thisWeekWins.slice().reverse().map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, marginTop: 1 }}>{w.isOneThing ? "☀️" : "✅"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#e8e6e0" }}>{w.text}</div>
                    <div style={{ fontSize: 11, color: "#6b6a72", marginTop: 2 }}>{new Date(w.completedAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                  </div>
                </div>
              ))}
              {!isSunday && (
                <button onClick={() => setWeeklyStep(1)} style={{ ...btnBase, width: "100%", marginTop: 8, background: "#2b1a0f", border: "1px solid #C4622D44", color: "#C4622D", fontSize: 12 }}>
                  📅 Run Weekly Review anytime →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {view === "thoughts" && (
        <div className="fade">
          <div style={{ background: "#16161c", border: "1px dashed #E8E4DC", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#6b6a72", lineHeight: 1.6 }}>💭 <strong style={{ color: "#e8e6e0" }}>Not a task — just a thought.</strong> Ideas, worries, things to research. They live here so your task list stays clean.</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input value={newThought} onChange={e => setNewThought(e.target.value)} onKeyDown={e => e.key === "Enter" && addThought(newThought)}
              placeholder="What's on your mind?"
              style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#1a1a1f", color: "#e8e6e0", fontSize: 14, fontFamily: "inherit" }} />
            <button onClick={() => addThought(newThought)} style={{ ...btnBase, background: "#2D5A8A", color: "#fff", padding: "10px 16px" }}>Add</button>
          </div>
          {thoughts.length === 0 && <div style={{ textAlign: "center", padding: "24px", color: "#6b6a72", fontSize: 13 }}>Nothing here yet. Safe place for things that aren't tasks.</div>}
          {thoughts.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 8, padding: "11px 14px", marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#e8e6e0" }}>{t.text}</div>
                <div style={{ fontSize: 11, color: "#6b6a72", marginTop: 3 }}>{t.date}</div>
              </div>
              <button onClick={() => update("thoughts", thoughts.filter(th => th.id !== t.id))} style={{ ...btnBase, padding: "6px 10px", fontSize: 11, background: "transparent", border: "1px solid #E8E4DC", color: "#6b6a72" }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {view === "ideas" && (
        <IdeasInTasks ideasData={ideasData} setIdeasData={setIdeasData} taskData={taskData} setTaskData={setTaskData} />
      )}

    </div>
  );
}

export default TasksTab;
