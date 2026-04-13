// APP_META: { "app": "wellness", "version": "15.10" }
import React, { useState, useEffect } from "react";
import { T, load, save, loadDraft, saveDraft, clearDraft, DEFAULT_MEDS, loadMeds, saveMeds } from "./theme";
import { push, pull, auth, APP_KEY } from "./sync";
import TrackerTab, { MORNING_SECTIONS, EVENING_SECTIONS, getCheckinMode } from "./tabs/TrackerTab";
import TasksTab from "./tabs/TasksTab";
import TimeTrackerTab from "./tabs/TimeTrackerTab";
import BudgetTool, { WantsTracker } from "./tabs/BudgetTab";
import HistoryView, { WinLogger } from "./tabs/HistoryTab";
import GrowthTab from "./tabs/GrowthTab";
import { PulseCheckModal } from "./tabs/TrackerTab";
import ErrorBoundary from "./ErrorBoundary";

// ── LOGIN SCREEN (shown when no Supabase session) ──────────────────────────
// Email OTP + verifyOtp: iOS home-screen PWA has separate localStorage from Safari;
// entering the code here stores the session in the same context as the app (magic link in Mail often opens Safari).
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendSec, setResendSec] = useState(0);

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setInterval(() => setResendSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendSec]);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: authErr } = await auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });
      if (authErr) throw authErr;
      setSent(true);
      setResendSec(45);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await sendOtp();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, "").slice(0, 8);
    if (!code.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const { error: authErr } = await auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: "email",
      });
      if (authErr) throw authErr;
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendSec > 0 || loading) return;
    setOtp("");
    await sendOtp();
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${T.border}`,
    background: T.bg, color: T.text, fontSize: 16, fontFamily: "inherit", marginBottom: 16,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 360, width: "100%", background: T.surface, borderRadius: 16, padding: 32, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🌿</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.text, textAlign: "center", marginBottom: 4 }}>Wellness Tracker</div>
        <div style={{ fontSize: 13, color: T.muted, textAlign: "center", marginBottom: 28 }}>Sign in to sync your data across devices</div>
        {sent ? (
          <form onSubmit={handleVerify}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>
              We sent a sign-in email to <strong style={{ color: T.text }}>{email}</strong>.
              Enter the code from that email (best for the iPhone home-screen app). You can also tap the link in the email if you use Safari.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, lineHeight: 1.45 }}>
              If the email has <strong style={{ color: T.text }}>only a link</strong> and no code, open the project in Supabase → <strong>Authentication</strong> → <strong>Email Templates</strong> → <strong>Magic link</strong> and add the variable <code style={{ fontSize: 10, color: T.text }}>{'{{ .Token }}'}</code> to the template body (see app <code style={{ fontSize: 10 }}>CLAUDE.md</code>).
            </div>
            <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Code from email</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="000000"
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 12, color: T.warn, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={verifying || otp.replace(/\D/g, "").length < 6} style={{
              width: "100%", padding: "12px", borderRadius: 8, border: "none",
              background: T.accent, color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "inherit", cursor: verifying ? "wait" : "pointer",
              opacity: verifying || otp.replace(/\D/g, "").length < 6 ? 0.6 : 1,
            }}>
              {verifying ? "Verifying…" : "Verify and sign in"}
            </button>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: T.muted }}>
              <button type="button" onClick={() => { setSent(false); setOtp(""); setError(""); }} style={{
                background: "none", border: "none", color: T.accent, cursor: "pointer", padding: 0, fontFamily: "inherit", fontSize: 12,
              }}>Change email</button>
              <button type="button" onClick={handleResend} disabled={resendSec > 0 || loading} style={{
                background: "none", border: "none", color: resendSec > 0 ? T.muted : T.accent, cursor: resendSec > 0 ? "default" : "pointer", padding: 0, fontFamily: "inherit", fontSize: 12,
              }}>
                {resendSec > 0 ? `Resend in ${resendSec}s` : "Resend email"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 12, color: T.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 12, color: T.warn, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={loading || !email.trim()} style={{
              width: "100%", padding: "12px", borderRadius: 8, border: "none",
              background: T.accent, color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "inherit", cursor: loading ? "wait" : "pointer",
              opacity: loading || !email.trim() ? 0.6 : 1,
            }}>
              {loading ? "Sending…" : "Send sign-in email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── NAV TABS ───────────────────────────────────────────────────────────────
function NavTabs({ active, onChange }) {
  const tabs = [
    { id: "tracker", label: "Check-In", icon: "📋" },
    { id: "tasks", label: "Tasks", icon: "✅" },
    { id: "time", label: "Time", icon: "⏱️" },
    { id: "budget", label: "Budget", icon: "💰" },
    { id: "growth", label: "Growth", icon: "🌱" },
    { id: "history", label: "History", icon: "📈" },
  ];
  return (
    <div style={{
      display: "flex", gap: 4, padding: "12px 8px",
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
      overflowX: "auto", WebkitOverflowScrolling: "touch",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: "0 0 auto", minWidth: 52, padding: "9px 6px", borderRadius: 8,
          border: `1.5px solid ${active === t.id ? T.accent : "transparent"}`,
          background: active === t.id ? T.accentLight : "transparent",
          color: active === t.id ? T.accent : T.muted,
          fontSize: 20, fontWeight: active === t.id ? 700 : 400,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 16 }}>{t.icon}</span>
          <span style={{ fontSize: 10 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState("tracker");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [wantsOpen, setWantsOpen] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const [pulseOpen, setPulseOpen] = useState(false);
  const [ideasData, setIdeasData] = useState({});
  const [growthLogs, setGrowthLogs] = useState([]);
  const [wins, setWins] = useState([]);
  const [formData, setFormData] = useState({});
  const [budgetData, setBudgetData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [timeData, setTimeData] = useState({});
  const [scriptureStreak, setScriptureStreak] = useState({ count: 0, lastDate: null });
  const [entries, setEntries] = useState([]);
  const [pulseChecks, setPulseChecks] = useState([]);
  const [savedMorning, setSavedMorning] = useState(false);
  const [savedEvening, setSavedEvening] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [checkinMode, setCheckinMode] = useState(getCheckinMode());
  const [meds, setMeds] = useState(DEFAULT_MEDS);

  // ── Auth session ─────────────────────────────────────────────────────────
  // null = not yet checked, false = no session, object = logged in
  const [session, setSession] = useState(null);
  useEffect(() => {
    if (!auth) { setSession(true); return; }
    const hasCode = window.location.search.includes('code=') || window.location.hash.includes('access_token=');
    const { data: { subscription } } = auth.onAuthStateChange((_event, s) => setSession(s || false));
    auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session);
      else if (!hasCode) setSession(false);
      // if hasCode but no session yet, keep null (loading) until onAuthStateChange fires
    });
    return () => subscription.unsubscribe();
  }, []);

  const activeSections = checkinMode === "morning" ? MORNING_SECTIONS : EVENING_SECTIONS;

  function hydrateState(data) {
    const today = new Date().toDateString();
    if (data.entries) setEntries(data.entries);
    if (data.budget) setBudgetData(data.budget);
    if (data.tasks) setTaskData(data.tasks);
    if (data.ideas) setIdeasData(data.ideas);
    if (data.growthLogs) setGrowthLogs(data.growthLogs);
    if (data.wins) setWins(data.wins);
    if (data.pulseChecks) setPulseChecks(data.pulseChecks);
    if (data.timeData) setTimeData(data.timeData);
    if (data.scriptureStreak) setScriptureStreak(data.scriptureStreak);
    if (data.savedMorning === today) setSavedMorning(true);
    if (data.savedEvening === today) setSavedEvening(true);
    if (data.savedMorning === today) setTab("tasks");
  }

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = load();
    hydrateState(stored);
    setMeds(loadMeds());
    // Restore draft only if it's from today
    const draft = loadDraft();
    if (draft.formData && Object.keys(draft.formData).length > 0 && draft.date === today) {
      setFormData(draft.formData);
      if (draft.sectionIdx !== undefined) setSectionIdx(draft.sectionIdx);
      if (draft.checkinMode) setCheckinMode(draft.checkinMode);
      setHasDraft(true);
    } else if (draft.date && draft.date !== today) {
      clearDraft();
    }
    hasLoaded.current = true;

    // Pull from Supabase — if remote is newer, re-hydrate and update localStorage
    pull(APP_KEY, stored, stored._syncAt).then(remote => {
      if (remote === stored) return; // no change (same reference = local wins)
      hydrateState(remote);
      save(remote); // update localStorage with the newer remote snapshot
    });
  }, []);

  // Guard: don't save on first render before load has run
  const hasLoaded = React.useRef(false);

  // Single unified save — fires whenever any persistent state changes
  useEffect(() => {
    if (!hasLoaded.current) return;
    const today = new Date().toDateString();
    const blob = {
      entries,
      budget: budgetData,
      tasks: taskData,
      ideas: ideasData,
      growthLogs,
      wins,
      savedMorning: savedMorning ? today : null,
      savedEvening: savedEvening ? today : null,
      pulseChecks,
      timeData,
      scriptureStreak,
    };
    save(blob);          // writes to localStorage + stamps _syncAt
    push(APP_KEY, blob); // fire-and-forget background sync to Supabase
  }, [entries, budgetData, taskData, ideasData, growthLogs, wins, savedMorning, savedEvening, pulseChecks, timeData, scriptureStreak]);

  useEffect(() => { saveMeds(meds); }, [meds]);

  // Auto-save check-in draft
  useEffect(() => {
    if (Object.keys(formData).length > 0 && !savedMorning && !savedEvening) {
      saveDraft({ formData, sectionIdx, checkinMode, date: new Date().toDateString() });
    }
  }, [formData, sectionIdx, checkinMode]);

  // Scripture streak — update whenever timeData changes
  // Streak persists across days: {count, lastDate (toDateString)}
  useEffect(() => {
    if (!hasLoaded.current) return;
    const todayStr = new Date().toDateString();
    const d = timeData || {};
    const sessions = (d.day === todayStr ? d.sessions : []) || [];
    const activeSession = d.day === todayStr ? d.active : null;
    const scriptureLoggedToday =
      sessions.some(s => s.catId === "scripture") ||
      (activeSession && activeSession.catId === "scripture");

    if (!scriptureLoggedToday) return; // don't reset — only increment when logged

    setScriptureStreak(prev => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      if (prev.lastDate === todayStr) return prev; // already counted today
      const newCount = prev.lastDate === yesterdayStr ? prev.count + 1 : 1; // streak continues or resets
      return { count: newCount, lastDate: todayStr };
    });
  }, [timeData]);

  const saveEntry = () => {
    const isMorning = checkinMode === "morning";
    const today = new Date().toDateString();
    const existingIdx = entries.findIndex(e => new Date(e.date).toDateString() === today);
    const existing = existingIdx >= 0 ? entries[existingIdx] : {};
    // Build merged entry — preserve existing data for the other check-in half
    const newSections = Object.fromEntries(activeSections.map(s => [s, formData[s] || {}]));
    const merged = {
      ...existing,
      ...newSections,
      date: existing.date || new Date().toISOString(),
      // Preserve the other half's side effects and end of day if already saved
      sideEffects: isMorning ? (existing.sideEffects || {}) : (formData.side_effects || existing.sideEffects || {}),
      endOfDay: isMorning ? (existing.endOfDay || {}) : (formData.end_of_day || existing.endOfDay || {}),
      morningDone: isMorning ? true : !!(existing.morningDone),
      eveningDone: !isMorning ? true : !!(existing.eveningDone),
    };
    const updated = existingIdx >= 0
      ? entries.map((e, i) => i === existingIdx ? merged : e)
      : [merged, ...entries].slice(0, 90);
    setEntries(updated);
    clearDraft();
    setHasDraft(false);
    if (isMorning) {
      setSavedMorning(true);
      setTab("tasks");
    } else setSavedEvening(true);
  };

  const resetTracker = () => {
    // Only clear the form — never wipe saved flags (that would lose the entry)
    setFormData({});
    setSectionIdx(0);
    setHasDraft(false);
    clearDraft();
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Auth gate — session=null means still checking, session=false means not logged in
  if (session === null) {
    return <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>Loading…</div>;
  }
  if (session === false) {
    return <LoginScreen />;
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: T.text }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; touch-action: manipulation; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: fadeUp 0.25s ease; }
        input, select, textarea { font-size: 16px !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: T.surface,
        padding: "16px 20px 0", position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted }}>Wellness Tracker</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{today}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 20, color: T.muted }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"} logged
            </div>
          </div>
          <NavTabs active={tab} onChange={t => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

          {/* Floating buttons */}
          {tab !== "budget" && (
            <button onClick={() => setWantsOpen(true)} style={{
              position: "fixed", bottom: 24, right: 20, zIndex: 50,
              background: "#C4622D", color: "#fff", border: "none", borderRadius: 28,
              padding: "11px 16px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 4px 16px #C4622D55",
            }}>🛒 Want</button>
          )}
          <button onClick={() => setWinOpen(true)} style={{
            position: "fixed", bottom: 24, left: 20, zIndex: 50,
            background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 28,
            padding: "11px 16px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
            cursor: "pointer", boxShadow: "0 4px 16px #2D6A4F55",
          }}>🏆 Win</button>

          {/* Pulse check floating button */}
          <button onClick={() => setPulseOpen(true)} style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 50,
            background: "#2D5A8A", color: "#fff", border: "none", borderRadius: 28,
            padding: "11px 18px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
            cursor: "pointer", boxShadow: "0 4px 16px #2D5A8A55",
          }}>💊 Pulse</button>

          {/* Win log modal */}
          {winOpen && (
            <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 100, display: "flex", alignItems: "flex-end" }}
              onClick={e => e.target === e.currentTarget && setWinOpen(false)}>
              <div style={{ background: T.bg, borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", width: "100%", maxHeight: "70vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>🏆 Log a Win</div>
                  <button onClick={() => setWinOpen(false)} style={{ background: "transparent", border: "none", fontSize: 20, color: T.muted, cursor: "pointer" }}>✕</button>
                </div>
                <WinLogger wins={wins} setWins={setWins} onClose={() => setWinOpen(false)} />
              </div>
            </div>
          )}

          {/* Wants quick-log modal */}
          {wantsOpen && (
            <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 100, display: "flex", alignItems: "flex-end" }}
              onClick={e => e.target === e.currentTarget && setWantsOpen(false)}>
              <div style={{ background: T.bg, borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>🛒 Log a Want</div>
                  <button onClick={() => setWantsOpen(false)} style={{ background: "transparent", border: "none", fontSize: 20, color: T.muted, cursor: "pointer" }}>✕</button>
                </div>
                <WantsTracker budgetData={budgetData} setBudgetData={setBudgetData} />
              </div>
            </div>
          )}

          {/* Pulse check modal */}
          {pulseOpen && (
            <PulseCheckModal
              onClose={() => setPulseOpen(false)}
              onSave={entry => setPulseChecks(prev => [entry, ...prev].slice(0, 200))}
            />
          )}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>

        {/* TRACKER TAB */}
        {tab === "tracker" && (
          <div className="fade">
            <ErrorBoundary name="Check-In">
              <TrackerTab
                entries={entries}
                formData={formData}
                setFormData={setFormData}
                sectionIdx={sectionIdx}
                setSectionIdx={setSectionIdx}
                savedMorning={savedMorning}
                savedEvening={savedEvening}
                setSavedMorning={setSavedMorning}
                setSavedEvening={setSavedEvening}
                hasDraft={hasDraft}
                setHasDraft={setHasDraft}
                checkinMode={checkinMode}
                setCheckinMode={setCheckinMode}
                setTab={setTab}
                saveEntry={saveEntry}
                resetTracker={resetTracker}
                clearDraft={clearDraft}
                meds={meds}
                setMeds={setMeds}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* TASKS TAB */}
        {tab === "tasks" && (
          <div className="fade">
            <ErrorBoundary name="Tasks">
              <TasksTab taskData={taskData} setTaskData={setTaskData} ideasData={ideasData} setIdeasData={setIdeasData} />
            </ErrorBoundary>
          </div>
        )}

        {/* TIME TRACKER TAB */}
        {tab === "time" && (
          <div className="fade">
            <ErrorBoundary name="Time">
              <TimeTrackerTab timeData={timeData} setTimeData={setTimeData} scriptureStreak={scriptureStreak} />
            </ErrorBoundary>
          </div>
        )}

        {/* BUDGET TAB */}
        {tab === "budget" && (
          <div className="fade" style={{ paddingTop: 16 }}>
            <ErrorBoundary name="Budget">
              <BudgetTool budgetData={budgetData} setBudgetData={setBudgetData} />
            </ErrorBoundary>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div className="fade" style={{ paddingTop: 16 }}>
            <ErrorBoundary name="History">
              <HistoryView entries={entries} taskData={taskData} budgetData={budgetData} wins={wins} pulseChecks={pulseChecks} ideasData={ideasData} setIdeasData={setIdeasData} meds={meds} setMeds={setMeds} />
            </ErrorBoundary>
          </div>
        )}

        {tab === "growth" && (
          <div className="fade" style={{ paddingTop: 16 }}>
            <ErrorBoundary name="Growth">
              <GrowthTab growthLogs={growthLogs} setGrowthLogs={setGrowthLogs} />
            </ErrorBoundary>
          </div>
        )}

      </div>
    </div>
  );
}
