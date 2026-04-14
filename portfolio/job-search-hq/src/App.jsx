// APP_META: { "app": "jobsearch", "version": "8.5" }
import React, { useState, useEffect, useRef } from "react";
import {
  STORAGE_KEY, API_KEY_STORAGE,
  defaultData, blankApp, blankContact, normalizeApplication, normalizePrepSections, normalizeStarStories,
  callClaude, getApiKey, CHASE_CONTEXT,
  s, css, today, generateId,
} from "./constants";
import { push, pull, auth, APP_KEY, emailRedirectTo } from "./sync";
import ApiKeyModal from "./components/ApiKeyModal";
import AppModal from "./components/AppModal";
import ContactModal from "./components/ContactModal";
import ProfileModal from "./components/ProfileModal";
import PrepModal from "./components/PrepModal";
import FocusTab from "./tabs/FocusTab";
import PipelineTab from "./tabs/PipelineTab";
import ContactsTab from "./tabs/ContactsTab";
import AITab from "./tabs/AITab";
import ResourcesTab from "./tabs/ResourcesTab";
import { AppNav, resolveAppUrl } from "./shared/ui";

const APP_NAV_LINKS = [
  { key: "wellness", label: "Wellness", url: resolveAppUrl("/wellness", "https://wellnes-tracker.vercel.app") },
  { key: "clarity-hub", label: "Clarity Hub", url: resolveAppUrl("/hub", "https://clarity-hub-lilac.vercel.app") },
];

const AUTH_DEBUG = ["1", "true", "yes"].includes(String(process.env.REACT_APP_AUTH_DEBUG || "").toLowerCase());
function logAuth(message, payload) {
  if (!AUTH_DEBUG) return;
  if (payload === undefined) {
    console.log(`[auth:job-search] ${message}`);
    return;
  }
  console.log(`[auth:job-search] ${message}`, payload);
}

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
          emailRedirectTo,
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
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #374151",
    background: "#0f1117", color: "#f3f4f6", fontSize: 16, fontFamily: "inherit", marginBottom: 16,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 360, width: "100%", background: "#161b27", borderRadius: 16, padding: 32, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🎯</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#f3f4f6", textAlign: "center", marginBottom: 4 }}>Job Search HQ</div>
        <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 28 }}>Sign in to sync your data across devices</div>
        {sent ? (
          <form onSubmit={handleVerify}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>
              We sent a sign-in email to <strong style={{ color: "#f3f4f6" }}>{email}</strong>.
              Enter the code from that email (best for the iPhone home-screen app). You can also tap the link in the email if you use Safari.
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 14, lineHeight: 1.45 }}>
              If the email has <strong style={{ color: "#f3f4f6" }}>only a link</strong> and no code, edit Supabase → <strong>Authentication</strong> → <strong>Email Templates</strong> → <strong>Magic link</strong> and add <code style={{ fontSize: 10, color: "#f3f4f6" }}>{'{{ .Token }}'}</code> to the template (see <code style={{ fontSize: 10 }}>CLAUDE.md</code>).
            </div>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Code from email</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="000000"
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={verifying || otp.replace(/\D/g, "").length < 6} style={{
              width: "100%", padding: "12px", borderRadius: 8, border: "none",
              background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "inherit", cursor: verifying ? "wait" : "pointer",
              opacity: verifying || otp.replace(/\D/g, "").length < 6 ? 0.6 : 1,
            }}>
              {verifying ? "Verifying…" : "Verify and sign in"}
            </button>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6b7280" }}>
              <button type="button" onClick={() => { setSent(false); setOtp(""); setError(""); }} style={{
                background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 0, fontFamily: "inherit", fontSize: 12,
              }}>Change email</button>
              <button type="button" onClick={handleResend} disabled={resendSec > 0 || loading} style={{
                background: "none", border: "none", color: resendSec > 0 ? "#6b7280" : "#3b82f6", cursor: resendSec > 0 ? "default" : "pointer", padding: 0, fontFamily: "inherit", fontSize: 12,
              }}>
                {resendSec > 0 ? `Resend in ${resendSec}s` : "Resend email"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={loading || !email.trim()} style={{
              width: "100%", padding: "12px", borderRadius: 8, border: "none",
              background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 700,
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

export default function JobSearchTracker() {
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState("focus");
  const hasLoaded = useRef(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // ── Auth session ─────────────────────────────────────────────────────────
  // null = not yet checked, false = no session, object = logged in
  const [session, setSession] = useState(null);
  useEffect(() => {
    if (!auth) {
      logAuth("local_mode_no_auth");
      setSession(true);
      return;
    } // localStorage-only mode (no .env) — skip auth gate
    const hasCode = window.location.search.includes('code=') || window.location.hash.includes('access_token=');
    const { data: { subscription } } = auth.onAuthStateChange((event, s) => {
      logAuth("state_change", { event, hasSession: !!s });
      setSession(s || false);
    });
    auth.getSession().then(({ data: d }) => {
      logAuth("initial_session", { hasSession: !!d.session, hasCode });
      if (d.session) setSession(d.session);
      else if (!hasCode) setSession(false);
      // if hasCode but no session yet, keep null (loading) until onAuthStateChange fires
    });
    return () => subscription.unsubscribe();
  }, []);

  const [appModal, setAppModal] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [prepModal, setPrepModal] = useState(null);

  // Shared state that multiple tabs read or set
  const [kitApp, setKitApp] = useState(null);
  const [resumeTab, setResumeTab] = useState("tailor");
  const [, setKitResumeResult] = useState("");
  const [, setKitCoverResult] = useState("");

  const [expandedBlock, setExpandedBlock] = useState(null);
  const [completedBlocks, setCompletedBlocks] = useState({});

  const [errorToast, setErrorToast] = useState("");
  const errorToastTimer = useRef(null);
  const importUrlConsumed = useRef(false);

  // ── LOAD / SAVE ──────────────────────────────────────────────────────────
  function hydrateState(parsed) {
    const next = { ...defaultData, ...parsed, profile: { ...defaultData.profile, ...(parsed.profile || {}) } };
    next.applications = (next.applications || []).map(normalizeApplication);
    next.starStories = normalizeStarStories(next.starStories);
    setData(next);
  }

  useEffect(() => {
    let stored = defaultData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey) {
          localStorage.setItem(API_KEY_STORAGE, parsed.apiKey);
          delete parsed.apiKey;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        stored = parsed;
        hydrateState(parsed);
      }
      const savedKey = localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setApiKey(savedKey);
    } catch (e) {}
    hasLoaded.current = true;

    // Pull from Supabase — if remote is newer, re-hydrate and update localStorage
    pull(APP_KEY, stored, stored._syncAt).then(remote => {
      if (remote === stored) return; // no change (same reference = local wins)
      hydrateState(remote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    });
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    const blob = { ...data, _syncAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
    push(APP_KEY, blob); // fire-and-forget background sync to Supabase
  }, [data]);

  // Push daily job-search summary for Clarity Command cross-app scoreboard
  useEffect(() => {
    if (!hasLoaded.current) return;
    const todayStr = today();
    const todayActions = (data.dailyActions || []).filter(a => a.date === todayStr);
    push('job-search-daily', {
      date: todayStr,
      count: todayActions.length,
      met: todayActions.length >= 5,
      actions: todayActions,
      _syncAt: Date.now(),
    });
  }, [data.dailyActions]); // run once on mount

  // Extension / bookmarklet URL imports — run after session is ready so modals render
  useEffect(() => {
    if (session === null || session === false) return;
    if (!hasLoaded.current) return;
    if (importUrlConsumed.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("importContact") === "1") {
      importUrlConsumed.current = true;
      const sourceParam = params.get("source") || "sales_navigator";
      const imported = {
        ...blankContact(),
        name: params.get("name") || "",
        role: params.get("role") || "",
        company: params.get("company") || "",
        linkedin: params.get("linkedin") || "",
        companySize: params.get("companySize") || "",
        industry: params.get("industry") || "",
        isHiring: params.get("isHiring") === "true",
        source: sourceParam === "chrome_extension" ? "chrome_extension" : sourceParam,
        type: "other",
        outreachStatus: "none",
      };
      setContactModal({ mode: "new", contact: imported });
      setTab("contacts");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (params.get("importJob") === "1") {
      importUrlConsumed.current = true;
      const imported = {
        ...blankApp(),
        title: params.get("title") || "",
        company: params.get("company") || "",
        url: params.get("url") || "",
        jobDescription: params.get("jobDescription") || "",
        stage: "Interested",
      };
      setAppModal({ mode: "new", app: imported });
      setTab("pipeline");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    const hash = window.location.hash || "";
    if (hash.startsWith("#importJob=")) {
      try {
        const json = decodeURIComponent(hash.slice("#importJob=".length));
        const payload = JSON.parse(json);
        importUrlConsumed.current = true;
        const imported = {
          ...blankApp(),
          title: payload.title || "",
          company: payload.company || "",
          url: payload.url || "",
          jobDescription: payload.jobDescription || "",
          stage: "Interested",
        };
        setAppModal({ mode: "new", app: imported });
        setTab("pipeline");
      } catch (e) {
        // leave URL for debugging if parse fails
      }
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [session]);

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function showError(msg) {
    setErrorToast(msg);
    clearTimeout(errorToastTimer.current);
    errorToastTimer.current = setTimeout(() => setErrorToast(""), 6000);
  }

  function saveApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, key.trim()); // pre-deploy-ignore: separate key, not app data
    setApiKey(key.trim());
    setShowApiKeyModal(false);
  }

  function saveApp(app) {
    setData(d => {
      const exists = d.applications.find(a => a.id === app.id);
      return { ...d, applications: exists ? d.applications.map(a => a.id === app.id ? app : a) : [...d.applications, app] };
    });
  }
  function deleteApp(id) { setData(d => ({ ...d, applications: d.applications.filter(a => a.id !== id) })); }
  function saveContact(c) {
    setData(d => {
      const exists = d.contacts.find(x => x.id === c.id);
      return { ...d, contacts: exists ? d.contacts.map(x => x.id === c.id ? c : x) : [...d.contacts, c] };
    });
  }
  function deleteContact(id) { setData(d => ({ ...d, contacts: d.contacts.filter(c => c.id !== id) })); }
  function saveProfile(p) { setData(d => ({ ...d, profile: p })); }
  function saveStarStories(stories) { setData(d => ({ ...d, starStories: normalizeStarStories(stories) })); }

  function addDailyAction(type, note = "") {
    const action = { id: generateId(), date: today(), type, note, time: new Date().toTimeString().slice(0, 5) };
    setData(d => ({ ...d, dailyActions: [...(d.dailyActions || []), action] }));
  }
  function removeDailyAction(id) {
    setData(d => ({ ...d, dailyActions: (d.dailyActions || []).filter(a => a.id !== id) }));
  }

  function profileContext() {
    const p = data.profile;
    return `${CHASE_CONTEXT}\n\nPROFILE DETAILS:\nTarget Roles: ${p.targetRoles}\nTarget Industries: ${p.targetIndustries}\nSalary Target: ${p.salaryTarget}\nTop Achievements: ${p.topAchievements}\nAdditional Context: ${p.notes}`.trim();
  }

  async function handleClaudeCall(fn, errorSetter) {
    if (!getApiKey()) { setShowApiKeyModal(true); return; }
    try { await fn(); }
    catch (e) {
      if (e.message === "NO_API_KEY") { setShowApiKeyModal(true); return; }
      if (e.message === "NETWORK_ERROR") {
        showError("Network error — check your connection and try again");
      } else if (e.message === "OVERLOADED") {
        showError("Claude is overloaded right now — wait 30 seconds and try again");
      } else if (e.message === "AUTH_ERROR") {
        localStorage.removeItem(API_KEY_STORAGE);
        setApiKey("");
        setShowApiKeyModal(true);
        showError("API key rejected — please re-enter your key");
      } else {
        showError(e.message || "Something went wrong — check your API key and try again");
        errorSetter?.("Something went wrong. Check your API key in Settings and try again.");
      }
    }
  }

  async function runInterviewPrep(app, onResult) {
    const jdText = app.jobDescription || "";
    await handleClaudeCall(async () => {
      const result = await callClaude(
        `You are an expert interview coach for enterprise sales and payments professionals.
Generate structured interview prep for Chase Whittaker and return ONLY valid JSON.

Required JSON shape:
{
  "companyResearch": "string",
  "roleAnalysis": "string",
  "starStories": "string",
  "questionsToAsk": "string"
}

Rules:
- Each field must be concise, practical, and specific to the role/JD.
- Use plain language; no buzzword-heavy phrasing.
- Ground points in Chase's real background (Authorize.Net, 98% integration resolution, ~200 merchants/month, KPI overachievement, CyberSource enterprise accounts, Select Bankcard risk/chargeback experience).
- "starStories" should include at least 3 STAR-ready story bullets.
- "questionsToAsk" should include at least 5 thoughtful interviewer questions.
- No markdown code fences. Output JSON only.`,
        `${profileContext()}\n\nROLE BEING INTERVIEWED FOR:\nCompany: ${app.company}\nTitle: ${app.title}\nStage: ${app.stage}\n\nJOB DESCRIPTION:\n${jdText || "(no JD saved — generate structured prep from the role title and Chase's background)"}\n\nReturn the structured prep JSON now.`,
        1500
      );
      let parsed;
      try {
        parsed = JSON.parse(result.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { roleAnalysis: result };
      }
      const prepSections = normalizePrepSections(parsed, "");
      const updated = { ...app, prepSections, prepNotes: "" };
      saveApp(updated);
      onResult(prepSections, updated);
    }, onResult);
  }

  const activeApps = data.applications.filter(a => !["Rejected", "Withdrawn"].includes(a.stage));
  const archivedApps = data.applications.filter(a => ["Rejected", "Withdrawn"].includes(a.stage));
  const profileComplete = !!(data.baseResume && data.profile.name && data.profile.targetRoles);
  const hasApiKey = !!apiKey;
  const todayDone = Object.values(completedBlocks).filter(Boolean).length;

  // Auth gate — session=null means still checking, session=false means not logged in
  if (session === null) {
    return <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>Loading…</div>;
  }
  if (session === false) {
    return <LoginScreen />;
  }

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Error Toast */}
      {errorToast && (
        <div style={s.errorToast}>
          <span>{errorToast}</span>
          <button style={s.toastClose} onClick={() => setErrorToast("")}>✕</button>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal current={apiKey} onSave={saveApiKey} onClose={() => setShowApiKeyModal(false)} />
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.headerTitle}>Job Search HQ</div>
          <div style={s.headerSub}>{activeApps.length} active · {data.contacts.length} contacts · {todayDone} done today</div>
        </div>
        <div style={s.headerActions}>
          {!hasApiKey && (
            <button style={s.btnWarn} onClick={() => setShowApiKeyModal(true)}>⚠️ Add API Key</button>
          )}
          {!profileComplete && (
            <button style={s.btnWarn} onClick={() => setProfileModal(true)}>⚠️ Setup Profile</button>
          )}
          {profileComplete && (
            <button style={s.btnSecondary} onClick={() => setProfileModal(true)}>👤 Profile</button>
          )}
          {hasApiKey && (
            <button style={s.btnSecondary} onClick={() => setShowApiKeyModal(true)}>🔑 API Key</button>
          )}
          {tab === "pipeline" && <button style={s.btnPrimary} onClick={() => setAppModal({ mode: "new", app: blankApp() })}>+ Application</button>}
          {tab === "contacts" && <button style={s.btnPrimary} onClick={() => setContactModal({ mode: "new", contact: blankContact() })}>+ Contact</button>}
        </div>
      </div>

      {/* Cross-app nav */}
      <AppNav currentApp="job-search" links={APP_NAV_LINKS} />

      {/* Nav Tabs */}
      <div style={s.tabs}>
        {[["focus","🎯 Daily Focus"],["pipeline","📋 Pipeline"],["contacts","👥 Contacts"],["ai","✨ AI Tools"],["resources","📚 Resources"]].map(([key, label]) => (
          <button key={key} style={{ ...s.tabBtn, ...(tab === key ? s.tabBtnActive : {}) }} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "focus" && (
        <FocusTab
          expandedBlock={expandedBlock} setExpandedBlock={setExpandedBlock}
          completedBlocks={completedBlocks} setCompletedBlocks={setCompletedBlocks}
          todayDone={todayDone}
          applications={data.applications} contacts={data.contacts}
          dailyActions={data.dailyActions || []}
          addDailyAction={addDailyAction} removeDailyAction={removeDailyAction}
          setAppModal={setAppModal} setPrepModal={setPrepModal}
          setContactModal={setContactModal} setTab={setTab} showError={showError}
        />
      )}
      {tab === "pipeline" && (
        <PipelineTab
          activeApps={activeApps} archivedApps={archivedApps}
          contacts={data.contacts} saveApp={saveApp}
          setAppModal={setAppModal} setPrepModal={setPrepModal}
          setKitApp={setKitApp} setKitResumeResult={setKitResumeResult} setKitCoverResult={setKitCoverResult}
          setTab={setTab} setResumeTab={setResumeTab} apiKey={apiKey}
        />
      )}
      {tab === "contacts" && (
        <ContactsTab
          contacts={data.contacts} applications={data.applications}
          setContactModal={setContactModal} deleteContact={deleteContact}
          saveContact={saveContact} setTab={setTab}
          setAppModal={setAppModal}
          showError={showError}
        />
      )}
      {tab === "ai" && (
        <AITab
          data={data} apiKey={apiKey} hasApiKey={hasApiKey} profileComplete={profileComplete}
          kitApp={kitApp} setKitApp={setKitApp}
          resumeTab={resumeTab} setResumeTab={setResumeTab}
          setTab={setTab} saveApp={saveApp} saveStarStories={saveStarStories}
          showError={showError} setShowApiKeyModal={setShowApiKeyModal} setProfileModal={setProfileModal}
        />
      )}
      {tab === "resources" && <ResourcesTab />}

      {/* Modals */}
      {appModal && (
        <AppModal
          modal={appModal} contacts={data.contacts}
          onSave={app => { saveApp(app); setAppModal(null); }}
          onDelete={id => { deleteApp(id); setAppModal(null); }}
          onClose={() => setAppModal(null)}
        />
      )}
      {contactModal && (
        <ContactModal
          modal={contactModal} apps={data.applications}
          onSave={c => { saveContact(c); setContactModal(null); }}
          onClose={() => setContactModal(null)}
        />
      )}
      {profileModal && (
        <ProfileModal
          profile={data.profile} baseResume={data.baseResume}
          onSave={(profile, resume) => { saveProfile(profile); setData(d => ({ ...d, baseResume: resume })); setProfileModal(false); }}
          onClose={() => setProfileModal(false)}
        />
      )}
      {prepModal && (
        <PrepModal
          app={prepModal.app}
          onRun={runInterviewPrep}
          onSave={saveApp}
          onClose={() => setPrepModal(null)}
        />
      )}
    </div>
  );
}
