// APP_META: { "app": "clarity-command", "version": "1.0" }
import React, { useState, useEffect, useRef } from "react";
import { T, load, save, today, DEFAULT_STATE } from "./theme";
import { push, pull, auth, APP_KEY, emailRedirectTo } from "./sync";
import MissionTab from "./tabs/MissionTab";
import ScoreboardTab from "./tabs/ScoreboardTab";
import SettingsTab from "./tabs/SettingsTab";
import ErrorBoundary from "./ErrorBoundary";

const AUTH_DEBUG = ["1", "true", "yes"].includes(String(process.env.REACT_APP_AUTH_DEBUG || "").toLowerCase());
function logAuth(message, payload) {
  if (!AUTH_DEBUG) return;
  if (payload === undefined) {
    console.log(`[auth:clarity-command] ${message}`);
    return;
  }
  console.log(`[auth:clarity-command] ${message}`, payload);
}

// ── LOGIN SCREEN ───────────────────────────────────────────────────────────
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
    const t = setInterval(() => setResendSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendSec]);

  const sendOtp = async () => {
    setLoading(true); setError("");
    try {
      const { error: e } = await auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true, emailRedirectTo },
      });
      if (e) throw e;
      setSent(true); setResendSec(45);
    } catch (e) { setError(e.message || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, "").slice(0, 8);
    if (!code) return;
    setVerifying(true); setError("");
    try {
      const { error: authErr } = await auth.verifyOtp({ email: email.trim(), token: code, type: "email" });
      if (authErr) throw authErr;
    } catch (e) { setError(e.message || "Invalid code. Try again."); }
    finally { setVerifying(false); }
  };

  const s = {
    wrap: { minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
    card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: "100%", maxWidth: 380 },
    title: { fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 4 },
    sub: { fontSize: 13, color: T.muted, marginBottom: 24 },
    label: { fontSize: 12, color: T.muted, marginBottom: 6, display: "block" },
    input: { width: "100%", padding: "10px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 15, outline: "none", marginBottom: 12 },
    btn: { width: "100%", padding: "12px", borderRadius: 8, background: T.accent, border: "none", color: "#0a0d14", fontWeight: 700, fontSize: 15, cursor: "pointer" },
    btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
    error: { fontSize: 12, color: T.red, marginTop: 8 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>Clarity Command</div>
        <div style={s.sub}>Sign in to begin your daily mission.</div>
        {!sent ? (
          <form onSubmit={e => { e.preventDefault(); if (email.trim()) sendOtp(); }}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            <button style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }} disabled={loading} type="submit">
              {loading ? "Sending…" : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label style={s.label}>Enter the code from your email</label>
            <input style={s.input} type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" autoComplete="one-time-code" />
            <button style={{ ...s.btn, ...(verifying ? s.btnDisabled : {}) }} disabled={verifying} type="submit">
              {verifying ? "Verifying…" : "Verify"}
            </button>
            <div style={{ marginTop: 12, fontSize: 12, color: T.muted }}>
              {resendSec > 0
                ? `Resend in ${resendSec}s`
                : <span style={{ cursor: "pointer", color: T.accent }} onClick={sendOtp}>Resend code</span>}
            </div>
          </form>
        )}
        {error && <div style={s.error}>{error}</div>}
      </div>
    </div>
  );
}

// ── NAV TABS ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "mission", label: "Mission" },
  { id: "scoreboard", label: "Scoreboard" },
  { id: "settings", label: "Settings" },
];

function NavTabs({ active, onSelect }) {
  return (
    <div style={{
      display: "flex", borderBottom: `1px solid ${T.border}`,
      background: T.surface, position: "sticky", top: 0, zIndex: 10,
    }}>
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} onClick={() => onSelect(tab.id)} style={{
            flex: 1, padding: "14px 8px", background: "none", border: "none",
            borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
            color: isActive ? T.accent : T.muted,
            fontWeight: isActive ? 700 : 400, fontSize: 14, cursor: "pointer",
            transition: "color 0.15s",
          }}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [tab, setTab] = useState("mission");
  const hasLoaded = useRef(false);

  // ── state lifted from DEFAULT_STATE ──
  const [layoffDate, setLayoffDate] = useState(DEFAULT_STATE.layoffDate);
  const [scriptures, setScriptures] = useState(DEFAULT_STATE.scriptures);
  const [reminders, setReminders] = useState(DEFAULT_STATE.reminders);
  const [targets, setTargets] = useState(DEFAULT_STATE.targets);
  const [dailyLogs, setDailyLogs] = useState(DEFAULT_STATE.dailyLogs);

  // ── Cross-app live data (read-only pulls from other apps) ──
  const [jobSearchDaily, setJobSearchDaily] = useState(null);
  const [wellnessDaily, setWellnessDaily] = useState(null);

  // ── Auth gate (same pattern as Wellness) ──
  useEffect(() => {
    if (!auth) {
      logAuth("local_mode_no_auth");
      setSession(null);
      return;
    }
    auth.getSession().then(({ data: { session: s } }) => {
      logAuth("initial_session", { hasSession: !!s });
      setSession(s);
    });
    const { data: { subscription } } = auth.onAuthStateChange((event, s) => {
      logAuth("state_change", { event, hasSession: !!s });
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load from localStorage + pull from Supabase ──
  useEffect(() => {
    const stored = load();
    if (stored.layoffDate !== undefined) setLayoffDate(stored.layoffDate);
    if (stored.scriptures) setScriptures(stored.scriptures);
    if (stored.reminders) setReminders(stored.reminders);
    if (stored.targets) setTargets({ ...DEFAULT_STATE.targets, ...stored.targets });
    if (stored.dailyLogs) setDailyLogs(stored.dailyLogs);

    pull(APP_KEY, stored, stored._syncAt).then(remote => {
      if (remote && remote !== stored) {
        if (remote.layoffDate !== undefined) setLayoffDate(remote.layoffDate);
        if (remote.scriptures) setScriptures(remote.scriptures);
        if (remote.reminders) setReminders(remote.reminders);
        if (remote.targets) setTargets({ ...DEFAULT_STATE.targets, ...remote.targets });
        if (remote.dailyLogs) setDailyLogs(remote.dailyLogs);
      }
    });
    // Pull cross-app daily summaries (read-only; timestamp 0 = always get remote)
    pull('job-search-daily', {}, 0).then(d => { if (d && d.date) setJobSearchDaily(d); });
    pull('wellness-daily', {}, 0).then(d => { if (d && d.date) setWellnessDaily(d); });
    hasLoaded.current = true;
  }, []); // run once on mount

  // ── Save to localStorage + push to Supabase ──
  useEffect(() => {
    if (!hasLoaded.current) return;
    const blob = { layoffDate, scriptures, reminders, targets, dailyLogs };
    save(blob);
    push(APP_KEY, blob);
  }, [layoffDate, scriptures, reminders, targets, dailyLogs]);

  // ── Helpers passed to tabs ──
  const getTodayLog = () => dailyLogs.find(l => l.date === today()) || null;

  const upsertTodayLog = (patch) => {
    setDailyLogs(prev => {
      const todayStr = today();
      const existing = prev.find(l => l.date === todayStr) || {
        date: todayStr,
        areas: { jobs: 0, time: 0, budget: false, wellness: { morning: false, evening: false, activity: false }, scripture: 0, prayer: { morning: false, evening: false } },
        jobActions: [],
        excuses: "",
        notes: "",
        top3Tomorrow: ["", "", ""],
        committed: false,
      };
      const updated = { ...existing, ...patch, areas: { ...existing.areas, ...(patch.areas || {}) } };
      const others = prev.filter(l => l.date !== todayStr);
      // Keep max 180 days
      return [...others, updated].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 180);
    });
  };

  // ── Render ──
  if (session === undefined) {
    return <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: T.muted, fontSize: 14 }}>Loading…</div>
    </div>;
  }

  // No auth configured (no .env) — run in local-only mode
  const authed = !auth || !!session;

  if (!authed) return <LoginScreen />;

  const sharedProps = {
    layoffDate, setLayoffDate,
    scriptures, setScriptures,
    reminders, setReminders,
    targets, setTargets,
    dailyLogs, setDailyLogs,
    getTodayLog, upsertTodayLog,
    jobSearchDaily,
    wellnessDaily,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <NavTabs active={tab} onSelect={setTab} />
      <div style={{ padding: "0 0 80px" }}>
        <ErrorBoundary name="Mission">
          {tab === "mission" && <MissionTab {...sharedProps} />}
        </ErrorBoundary>
        <ErrorBoundary name="Scoreboard">
          {tab === "scoreboard" && <ScoreboardTab dailyLogs={dailyLogs} layoffDate={layoffDate} targets={targets} jobSearchDaily={jobSearchDaily} wellnessDaily={wellnessDaily} />}
        </ErrorBoundary>
        <ErrorBoundary name="Settings">
          {tab === "settings" && <SettingsTab {...sharedProps} />}
        </ErrorBoundary>
      </div>
    </div>
  );
}
