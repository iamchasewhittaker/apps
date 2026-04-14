import React, { useState, useEffect, useRef } from "react";
import { T, loadBlob, saveBlob, DEFAULT_ROLLERTASK } from "./theme";
import { pullRollertask, pushRollertask, auth, emailRedirectTo } from "./sync";
import RollerTaskTab from "./tabs/RollerTaskTab";
import ErrorBoundary from "./ErrorBoundary";

const AUTH_DEBUG = ["1", "true", "yes"].includes(String(process.env.REACT_APP_AUTH_DEBUG || "").toLowerCase());
function logAuth(message, payload) {
  if (!AUTH_DEBUG) return;
  if (payload === undefined) {
    console.log(`[auth:rollertask] ${message}`);
    return;
  }
  console.log(`[auth:rollertask] ${message}`, payload);
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
        <div style={s.title}>RollerTask Tycoon</div>
        <div style={s.sub}>Sign in to access your tasks.</div>
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

// ── SETTINGS PANEL ────────────────────────────────────────────────────────
function SettingsPanel({ onClose, signOut }) {
  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
    card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 380 },
    title: { fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 16 },
    btnDanger: { width: "100%", padding: 10, borderRadius: 8, background: T.red, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={e => e.stopPropagation()}>
        <div style={s.title}>Settings</div>
        <button onClick={signOut} style={s.btnDanger}>Sign Out</button>
      </div>
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const hasLoaded = useRef(false);
  const [rollertask, setRollertask] = useState(DEFAULT_ROLLERTASK);

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
    const stored = loadBlob() || DEFAULT_ROLLERTASK;
    setRollertask(stored);
    pullRollertask(stored, stored._syncAt || 0).then(remote => {
      if (remote && remote !== stored) setRollertask(remote);
    });
    hasLoaded.current = true;
  }, []); // eslint-disable-line

  // Save + push
  useEffect(() => {
    if (hasLoaded.current) { saveBlob(rollertask); pushRollertask(rollertask); }
  }, [rollertask]); // eslint-disable-line

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>RollerTask Tycoon</div>
        <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", padding: 4 }}>{"\u2699"}</button>
      </div>
      <div style={{ padding: "0 0 80px" }}>
        <ErrorBoundary name="RollerTask">
          <RollerTaskTab blob={rollertask} setBlob={setRollertask} />
        </ErrorBoundary>
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} signOut={signOut} />}
    </div>
  );
}
