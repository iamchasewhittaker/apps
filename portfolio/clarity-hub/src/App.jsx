import React, { useState, useEffect, useRef } from "react";
import { T, loadBlob, saveBlob, DEFAULT_CHECKIN, DEFAULT_TRIAGE, DEFAULT_TIME, DEFAULT_BUDGET, DEFAULT_GROWTH } from "./theme";
import { pullCheckin, pushCheckin, pullTriage, pushTriage, pullTime, pushTime, pullBudget, pushBudget, pullGrowth, pushGrowth, auth, emailRedirectTo } from "./sync";
import CheckinTab from "./tabs/CheckinTab";
import TriageTab from "./tabs/TriageTab";
import TimeTab from "./tabs/TimeTab";
import BudgetTab from "./tabs/BudgetTab";
import GrowthTab from "./tabs/GrowthTab";
import SettingsTab from "./tabs/SettingsTab";
import ErrorBoundary from "./ErrorBoundary";

const AUTH_DEBUG = ["1", "true", "yes"].includes(String(process.env.REACT_APP_AUTH_DEBUG || "").toLowerCase());
function logAuth(message, payload) {
  if (!AUTH_DEBUG) return;
  if (payload === undefined) {
    console.log(`[auth:clarity-hub] ${message}`);
    return;
  }
  console.log(`[auth:clarity-hub] ${message}`, payload);
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
      const { error: e } = await auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo } });
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
    input: { width: "100%", padding: "10px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 15, outline: "none", marginBottom: 12, boxSizing: "border-box" },
    btn: { width: "100%", padding: "12px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" },
    btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
    error: { fontSize: 12, color: T.red, marginTop: 8 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>Clarity Hub</div>
        <div style={s.sub}>Sign in to access your apps.</div>
        {!sent ? (
          <form onSubmit={e => { e.preventDefault(); if (email.trim()) sendOtp(); }}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            <button style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }} disabled={loading} type="submit">{loading ? "Sending\u2026" : "Send Code"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label style={s.label}>Enter the code from your email</label>
            <input style={s.input} type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" autoComplete="one-time-code" />
            <button style={{ ...s.btn, ...(verifying ? s.btnDisabled : {}) }} disabled={verifying} type="submit">{verifying ? "Verifying\u2026" : "Verify"}</button>
            <div style={{ marginTop: 12, fontSize: 12, color: T.muted }}>
              {resendSec > 0 ? `Resend in ${resendSec}s` : <span style={{ cursor: "pointer", color: T.accent }} onClick={sendOtp}>Resend code</span>}
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
  { id: "checkin", label: "Check-in" },
  { id: "triage", label: "Triage" },
  { id: "time", label: "Time" },
  { id: "budget", label: "Budget" },
  { id: "growth", label: "Growth" },
  { id: "settings", label: "\u2699" },
];

const CANONICAL_ORIGIN = String(process.env.REACT_APP_AUTH_CANONICAL_ORIGIN || "").replace(/\/+$/, "");
const DEFAULT_EXTERNALS = {
  ynab: "https://ynab-clarity-web.vercel.app",
  tasks: "https://rollertask-tycoon-web.vercel.app",
};
function toCanonicalApp(pathValue, fallback) {
  if (!CANONICAL_ORIGIN) return fallback;
  const path = String(pathValue || "").startsWith("/") ? pathValue : `/${pathValue || ""}`;
  return `${CANONICAL_ORIGIN}${path}`;
}

const EXTERNAL_LINKS = [
  {
    label: "YNAB",
    url: toCanonicalApp(process.env.REACT_APP_YNAB_APP_PATH || "/ynab", DEFAULT_EXTERNALS.ynab),
  },
  {
    label: "Tasks",
    url: toCanonicalApp(process.env.REACT_APP_TASKS_APP_PATH || "/tasks", DEFAULT_EXTERNALS.tasks),
  },
];

function NavTabs({ active, onSelect }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.surface, position: "sticky", top: 0, zIndex: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {EXTERNAL_LINKS.map(link => (
        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
          flex: "0 0 auto", padding: "12px 12px", background: "none", border: "none",
          borderBottom: "2px solid transparent", color: T.muted, fontWeight: 400,
          fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none",
        }}>{link.label} {"\u2197"}</a>
      ))}
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} onClick={() => onSelect(tab.id)} style={{
            flex: "0 0 auto", padding: "12px 12px", background: "none", border: "none",
            borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
            color: isActive ? T.accent : T.muted, fontWeight: isActive ? 700 : 400,
            fontSize: 13, cursor: "pointer", transition: "color 0.15s", whiteSpace: "nowrap",
          }}>{tab.label}</button>
        );
      })}
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState("checkin");
  const hasLoaded = useRef(false);

  const [checkin, setCheckin] = useState(DEFAULT_CHECKIN);
  const [triage, setTriage] = useState(DEFAULT_TRIAGE);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [growth, setGrowth] = useState(DEFAULT_GROWTH);

  // Auth gate
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

  // Load from localStorage + pull from Supabase
  useEffect(() => {
    const apps = [
      { key: "checkin", def: DEFAULT_CHECKIN, set: setCheckin, pull: pullCheckin },
      { key: "triage", def: DEFAULT_TRIAGE, set: setTriage, pull: pullTriage },
      { key: "time", def: DEFAULT_TIME, set: setTime, pull: pullTime },
      { key: "budget", def: DEFAULT_BUDGET, set: setBudget, pull: pullBudget },
      { key: "growth", def: DEFAULT_GROWTH, set: setGrowth, pull: pullGrowth },
    ];
    for (const app of apps) {
      const stored = loadBlob(app.key) || app.def;
      app.set(stored);
      app.pull(stored, stored._syncAt || 0).then(remote => {
        if (remote && remote !== stored) app.set(remote);
      });
    }
    hasLoaded.current = true;
  }, []); // eslint-disable-line

  // Save + push effects (one per blob)
  useEffect(() => { if (hasLoaded.current) { saveBlob("checkin", checkin); pushCheckin(checkin); } }, [checkin]); // eslint-disable-line
  useEffect(() => { if (hasLoaded.current) { saveBlob("triage", triage); pushTriage(triage); } }, [triage]); // eslint-disable-line
  useEffect(() => { if (hasLoaded.current) { saveBlob("time", time); pushTime(time); } }, [time]); // eslint-disable-line
  useEffect(() => { if (hasLoaded.current) { saveBlob("budget", budget); pushBudget(budget); } }, [budget]); // eslint-disable-line
  useEffect(() => { if (hasLoaded.current) { saveBlob("growth", growth); pushGrowth(growth); } }, [growth]); // eslint-disable-line

  if (session === undefined) {
    return <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: T.muted, fontSize: 14 }}>Loading{"\u2026"}</div>
    </div>;
  }

  const authed = !auth || !!session;
  if (!authed) return <LoginScreen />;

  const signOut = async () => { if (auth) await auth.signOut(); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <NavTabs active={tab} onSelect={setTab} />
      <div style={{ padding: "0 0 80px" }}>
        <ErrorBoundary name="Check-in">{tab === "checkin" && <CheckinTab blob={checkin} setBlob={setCheckin} />}</ErrorBoundary>
        <ErrorBoundary name="Triage">{tab === "triage" && <TriageTab blob={triage} setBlob={setTriage} />}</ErrorBoundary>
        <ErrorBoundary name="Time">{tab === "time" && <TimeTab blob={time} setBlob={setTime} />}</ErrorBoundary>
        <ErrorBoundary name="Budget">{tab === "budget" && <BudgetTab blob={budget} setBlob={setBudget} />}</ErrorBoundary>
        <ErrorBoundary name="Growth">{tab === "growth" && <GrowthTab blob={growth} setBlob={setGrowth} />}</ErrorBoundary>
        <ErrorBoundary name="Settings">{tab === "settings" && <SettingsTab signOut={signOut} checkin={checkin} triage={triage} time={time} budget={budget} growth={growth} />}</ErrorBoundary>
      </div>
    </div>
  );
}
