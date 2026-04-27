// APP_META: { "app": "jobsearch", "version": "8.9" }
import React, { useState, useEffect, useRef } from "react";
import {
  STORAGE_KEY,
  defaultData, blankApp, blankContact, normalizeApplication, normalizeStarStories, normalizeContact,
  normalizeWins, blankWin, normalizeInboxItems, matchAppFromInboxItem,
  s, css, today, generateId,
} from "./constants";
import { push, pull, auth, APP_KEY, emailRedirectTo } from "./sync";
import AppModal from "./components/AppModal";
import ContactModal from "./components/ContactModal";
import ProfileModal from "./components/ProfileModal";
import PrepModal from "./components/PrepModal";
import DebriefModal from "./components/DebriefModal";
import OfferModal from "./components/OfferModal";
import ApplyWizardModal from "./components/ApplyWizardModal";
import FocusTab from "./tabs/FocusTab";
import PipelineTab from "./tabs/PipelineTab";
import ContactsTab from "./tabs/ContactsTab";
import AITab from "./tabs/AITab";
import ResourcesTab from "./tabs/ResourcesTab";
import { AppNav, resolveAppUrl } from "./shared/ui";

const APP_NAV_LINKS = [
  { key: "wellness", label: "Wellness", url: resolveAppUrl("/wellness", "https://wellness-tracker-kappa.vercel.app") },
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

// ── AUTH SCREENS ──────────────────────────────────────────────────────────

const authInputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #374151",
  background: "#0f1117", color: "#f3f4f6", fontSize: 16, fontFamily: "inherit", marginBottom: 16,
  outline: "none", boxSizing: "border-box",
};

const authBtnStyle = {
  width: "100%", padding: "12px", borderRadius: 8, border: "none",
  background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 700,
  fontFamily: "inherit", cursor: "pointer",
};

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { error: authErr } = await auth.signInWithPassword({ email: email.trim(), password });
      if (authErr) throw authErr;
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) { setError("Enter your email above first."); return; }
    setLoading(true);
    setError("");
    try {
      const { error: authErr } = await auth.resetPasswordForEmail(email.trim(), { redirectTo: emailRedirectTo });
      if (authErr) throw authErr;
      setResetSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 360, width: "100%", background: "#161b27", borderRadius: 16, padding: 32, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🎯</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#f3f4f6", textAlign: "center", marginBottom: 4 }}>Job Search HQ</div>
        <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 28 }}>Sign in to sync your data across devices</div>
        {resetSent ? (
          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, textAlign: "center" }}>
            Password reset email sent to <strong style={{ color: "#f3f4f6" }}>{email}</strong>.
            Check your inbox and click the link to set a new password.
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={authInputStyle}
            />
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={authInputStyle}
            />
            {error && <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={loading || !email.trim() || !password.trim()} style={{
              ...authBtnStyle, opacity: loading || !email.trim() || !password.trim() ? 0.6 : 1,
              cursor: loading ? "wait" : "pointer",
            }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button type="button" onClick={handleReset} disabled={loading} style={{
                background: "none", border: "none", color: "#3b82f6", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12, padding: 0,
              }}>
                Forgot password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Shown after user clicks a password-reset link (PASSWORD_RECOVERY event)
function SetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSet = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError("Minimum 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError("");
    try {
      const { error: authErr } = await auth.updateUser({ password });
      if (authErr) throw authErr;
      onDone();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 360, width: "100%", background: "#161b27", borderRadius: 16, padding: 32, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#f3f4f6", textAlign: "center", marginBottom: 4 }}>Set new password</div>
        <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 28 }}>Choose a password for your account</div>
        <form onSubmit={handleSet}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>New password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={authInputStyle}
          />
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            style={authInputStyle}
          />
          {error && <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>{error}</div>}
          <button type="submit" disabled={loading || !password || !confirm} style={{
            ...authBtnStyle, opacity: loading || !password || !confirm ? 0.6 : 1,
            cursor: loading ? "wait" : "pointer",
          }}>
            {loading ? "Saving…" : "Set password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JobSearchTracker() {
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState("focus");
  const hasLoaded = useRef(false);
  // ── Auth session ─────────────────────────────────────────────────────────
  // null = not yet checked, false = no session, object = logged in
  const [session, setSession] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);
  useEffect(() => {
    if (!auth) {
      logAuth("local_mode_no_auth");
      setSession(true);
      return;
    } // localStorage-only mode (no .env) — skip auth gate
    const hasCode = window.location.search.includes('code=') || window.location.hash.includes('access_token=');
    const { data: { subscription } } = auth.onAuthStateChange((event, s) => {
      logAuth("state_change", { event, hasSession: !!s });
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setSession(false);
      } else {
        setRecoveryMode(false);
        setSession(s || false);
      }
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
  const [debriefModal, setDebriefModal] = useState(null);
  const [offerModal, setOfferModal] = useState(null);
  const [applyWizard, setApplyWizard] = useState(null);

  // Shared state that multiple tabs read or set
  const [draftContact, setDraftContact] = useState(null);
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
    next.contacts = (next.contacts || []).map(normalizeContact);
    next.starStories = normalizeStarStories(next.starStories);
    next.wins = normalizeWins(next.wins);
    next.inbox = normalizeInboxItems(next.inbox);
    setData(next);
  }

  useEffect(() => {
    let stored = defaultData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey) {
          delete parsed.apiKey;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        stored = parsed;
        hydrateState(parsed);
      }
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

    if (params.get("shareTarget") === "1") {
      importUrlConsumed.current = true;
      const sharedUrl = params.get("url") || "";
      const sharedTitle = params.get("title") || "";
      if (sharedUrl) {
        setAppModal({ mode: "new", app: { ...blankApp(), title: sharedTitle, url: sharedUrl, stage: "Interested" } });
        setTab("pipeline");
      }
      ["shareTarget", "url", "title", "text"].forEach(k => params.delete(k));
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

  const STAGE_RANK = { "Interested": 0, "Applied": 1, "Phone Screen": 2, "Interview": 3, "Final Round": 4, "Offer": 5 };

  function addWin(partial) {
    setData(d => ({ ...d, wins: [...(d.wins || []), { ...blankWin(), ...partial }] }));
  }
  function removeWin(id) {
    setData(d => ({ ...d, wins: (d.wins || []).filter(w => w.id !== id) }));
  }

  function saveApp(app) {
    setData(d => {
      const prev = d.applications.find(a => a.id === app.id);
      const exists = !!prev;
      const newWins = [];
      const prevRank = prev ? (STAGE_RANK[prev.stage] ?? -1) : -1;
      const nextRank = STAGE_RANK[app.stage] ?? -1;
      if (exists && nextRank > prevRank && nextRank >= 2) {
        newWins.push({
          ...blankWin(),
          type: "progression",
          source: `app:${app.id}`,
          title: `${app.company} → ${app.stage}`,
          note: prev.stage ? `Advanced from ${prev.stage}` : "",
          autoLogged: true,
        });
      }
      const prevLogLen = (prev?.interviewLog || []).length;
      const nextLogLen = (app.interviewLog || []).length;
      if (exists && nextLogLen > prevLogLen) {
        const latest = app.interviewLog[nextLogLen - 1];
        newWins.push({
          ...blankWin(),
          type: "response",
          source: `app:${app.id}`,
          title: `${app.company} — ${latest.roundType || "interview"} debrief logged`,
          note: latest.impression || "",
          autoLogged: true,
        });
      }
      return {
        ...d,
        applications: exists ? d.applications.map(a => a.id === app.id ? app : a) : [...d.applications, app],
        wins: newWins.length ? [...(d.wins || []), ...newWins] : (d.wins || []),
      };
    });
  }
  function deleteApp(id) { setData(d => ({ ...d, applications: d.applications.filter(a => a.id !== id) })); }
  function saveContact(c) {
    setData(d => {
      const prev = d.contacts.find(x => x.id === c.id);
      const exists = !!prev;
      const newWins = [];
      if (exists && prev.outreachStatus !== "replied" && c.outreachStatus === "replied") {
        newWins.push({
          ...blankWin(),
          type: "response",
          source: `contact:${c.id}`,
          title: `${c.name} replied`,
          note: c.company ? `${c.role || "Contact"} at ${c.company}` : "",
          autoLogged: true,
        });
      }
      return {
        ...d,
        contacts: exists ? d.contacts.map(x => x.id === c.id ? c : x) : [...d.contacts, c],
        wins: newWins.length ? [...(d.wins || []), ...newWins] : (d.wins || []),
      };
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

  // ── INBOX (v8.18) ──────────────────────────────────────────────────────────
  function mergeInboxItems(newItems = []) {
    if (!newItems.length) return;
    setData(d => {
      const known = new Set((d.inbox || []).map(i => i.gmailMessageId).filter(Boolean));
      const additions = newItems.filter(i => i.gmailMessageId && !known.has(i.gmailMessageId));
      if (!additions.length) return d;
      return { ...d, inbox: [...additions, ...(d.inbox || [])] };
    });
  }
  function patchInboxItem(id, patch) {
    setData(d => ({
      ...d,
      inbox: (d.inbox || []).map(i => i.id === id ? { ...i, ...patch } : i),
    }));
  }
  function dismissInboxItem(id) {
    patchInboxItem(id, { status: "dismissed", actionedAt: new Date().toISOString() });
  }
  function snoozeInboxItem(id, hours = 24) {
    const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    patchInboxItem(id, { status: "snoozed", snoozeUntil: until });
  }
  function markInboxActioned(id, actionedAs) {
    patchInboxItem(id, { status: "actioned", actionedAt: new Date().toISOString(), actionedAs: actionedAs || null });
  }

  function inboxOpenContact(item) {
    const parsed = item.classification?.parsed || {};
    const prefill = {
      ...blankContact(),
      name: parsed.name || item.from?.name || "",
      email: parsed.email || item.from?.email || "",
      company: parsed.company || "",
      role: parsed.role || (item.classification?.kind === "recruiter" ? "Recruiter" : ""),
      linkedin: parsed.linkedin || "",
      type: item.classification?.kind === "linkedin" ? "other" : "recruiter",
      outreachStatus: "replied",
      source: "gmail",
      lastContact: today(),
      notes: item.subject ? `From email: ${item.subject}` : "",
    };
    setContactModal({
      mode: "new",
      contact: prefill,
      onAfterSave: (saved) => {
        markInboxActioned(item.id, { kind: "contact", recordId: saved.id });
        addWin({
          ...blankWin(),
          type: "response",
          source: `contact:${saved.id}`,
          title: `${saved.name || "Recruiter"}${saved.company ? ` (${saved.company})` : ""} reached out`,
          note: item.subject || "",
          autoLogged: true,
        });
      },
    });
  }

  function inboxOpenContactAndApp(item) {
    const parsed = item.classification?.parsed || {};
    const company = parsed.company || "";
    const contactPrefill = {
      ...blankContact(),
      name: parsed.name || item.from?.name || "",
      email: parsed.email || item.from?.email || "",
      company,
      role: parsed.role || "Recruiter",
      linkedin: parsed.linkedin || "",
      type: "recruiter",
      outreachStatus: "replied",
      source: "gmail",
      lastContact: today(),
      notes: item.subject ? `From email: ${item.subject}` : "",
    };
    setContactModal({
      mode: "new",
      contact: contactPrefill,
      onAfterSave: (savedContact) => {
        const appPrefill = {
          ...blankApp(),
          company: savedContact.company || company,
          title: parsed.jobTitle || "",
          url: parsed.jobUrl || "",
          stage: "Interested",
        };
        setAppModal({
          mode: "new",
          app: appPrefill,
          onAfterSave: (savedApp) => {
            markInboxActioned(item.id, { kind: "contact_app", recordId: savedApp.id });
            addWin({
              ...blankWin(),
              type: "response",
              source: `app:${savedApp.id}`,
              title: `${savedContact.name || "Recruiter"} reached out${savedApp.company ? ` — ${savedApp.company}` : ""}`,
              note: parsed.jobTitle ? `Role: ${parsed.jobTitle}` : (item.subject || ""),
              autoLogged: true,
            });
          },
        });
      },
    });
  }

  function inboxBumpStage(item, app, newStage) {
    if (!app || !newStage) return;
    saveApp({ ...app, stage: newStage });
    markInboxActioned(item.id, { kind: "stage_bump", recordId: app.id });
  }

  function inboxOpenAppEdit(item, app) {
    if (!app) return;
    setAppModal({
      mode: "edit",
      app: { ...app },
      onAfterSave: (savedApp) => {
        markInboxActioned(item.id, { kind: "stage_bump", recordId: savedApp.id });
      },
    });
  }

  function inboxSetInterview(item, app) {
    const parsed = item.classification?.parsed || {};
    const schedulingUrl = parsed.schedulingUrl || "";
    if (!app) {
      // No matching application — open a new app pre-filled from the invite
      setAppModal({
        mode: "new",
        app: {
          ...blankApp(),
          company: parsed.company || "",
          title: parsed.jobTitle || "",
          stage: "Phone Screen",
          nextStep: schedulingUrl ? `Pick a time: ${schedulingUrl}` : (item.subject || "Schedule interview"),
          nextStepType: "interview",
          nextStepDate: today(),
        },
        onAfterSave: (savedApp) => {
          markInboxActioned(item.id, { kind: "interview", recordId: savedApp.id });
          addWin({
            ...blankWin(),
            type: "response",
            source: `app:${savedApp.id}`,
            title: `Interview scheduled${savedApp.company ? ` — ${savedApp.company}` : ""}`,
            note: schedulingUrl || item.subject || "",
            autoLogged: true,
          });
          setPrepModal({ app: savedApp });
        },
      });
      return;
    }
    const updated = {
      ...app,
      stage: app.stage === "Interested" || app.stage === "Applied" ? "Phone Screen" : app.stage,
      nextStep: schedulingUrl ? `Pick a time: ${schedulingUrl}` : `Schedule: ${item.subject || "Interview"}`,
      nextStepType: "interview",
      nextStepDate: today(),
    };
    saveApp(updated);
    markInboxActioned(item.id, { kind: "interview", recordId: app.id });
    addWin({
      ...blankWin(),
      type: "response",
      source: `app:${app.id}`,
      title: `Interview scheduled${app.company ? ` — ${app.company}` : ""}`,
      note: schedulingUrl || item.subject || "",
      autoLogged: true,
    });
    setPrepModal({ app: updated });
  }

  const inboxHandlers = {
    mergeInboxItems,
    dismissInboxItem,
    snoozeInboxItem,
    inboxOpenContact,
    inboxOpenContactAndApp,
    inboxBumpStage,
    inboxOpenAppEdit,
    inboxSetInterview,
    matchAppFromInboxItem,
  };

  const activeApps = data.applications.filter(a => !["Rejected", "Withdrawn"].includes(a.stage));
  const archivedApps = data.applications.filter(a => ["Rejected", "Withdrawn"].includes(a.stage));
  const profileComplete = !!(data.baseResume && data.profile.name && data.profile.targetRoles);
  const todayDone = Object.values(completedBlocks).filter(Boolean).length;

  // Auth gate — session=null means still checking, session=false means not logged in
  if (session === null) {
    return <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>Loading…</div>;
  }
  if (recoveryMode) {
    return <SetPasswordScreen onDone={() => { setRecoveryMode(false); auth.getSession().then(({ data: d }) => setSession(d.session || false)); }} />;
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

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.headerTitle}>Job Search HQ</div>
          <div style={s.headerSub}>{activeApps.length} active · {data.contacts.length} contacts · {todayDone} done today</div>
        </div>
        <div style={s.headerActions}>
          {!profileComplete && (
            <button style={s.btnWarn} onClick={() => setProfileModal(true)}>⚠️ Setup Profile</button>
          )}
          {profileComplete && (
            <button style={s.btnSecondary} onClick={() => setProfileModal(true)}>👤 Profile</button>
          )}
          {tab === "pipeline" && <button style={s.btnPrimary} onClick={() => setAppModal({ mode: "new", app: blankApp() })}>+ Application</button>}
          {tab === "contacts" && <button style={s.btnPrimary} onClick={() => setContactModal({ mode: "new", contact: blankContact() })}>+ Contact</button>}
        </div>
      </div>

      {/* Cross-app nav */}
      <AppNav currentApp="job-search" links={APP_NAV_LINKS} />

      {/* Nav Tabs */}
      <div style={s.tabs}>
        {[["focus","🎯 Daily Focus"],["pipeline","📋 Pipeline"],["contacts","👥 Contacts"],["ai","✨ Apply Tools"],["resources","📚 Resources"]].map(([key, label]) => (
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
          profile={data.profile} saveProfile={saveProfile}
          wins={data.wins || []} addWin={addWin} removeWin={removeWin}
          setKitApp={setKitApp} setResumeTab={setResumeTab} saveApp={saveApp}
          setApplyWizard={setApplyWizard}
          inbox={data.inbox || []} inboxHandlers={inboxHandlers}
        />
      )}
      {tab === "pipeline" && (
        <PipelineTab
          activeApps={activeApps} archivedApps={archivedApps}
          contacts={data.contacts} saveApp={saveApp}
          setAppModal={setAppModal} setPrepModal={setPrepModal} setDebriefModal={setDebriefModal}
          setOfferModal={setOfferModal}
          setKitApp={setKitApp} setKitResumeResult={setKitResumeResult} setKitCoverResult={setKitCoverResult}
          setTab={setTab} setResumeTab={setResumeTab}
        />
      )}
      {tab === "contacts" && (
        <ContactsTab
          contacts={data.contacts} applications={data.applications}
          setContactModal={setContactModal} deleteContact={deleteContact}
          saveContact={saveContact} setTab={setTab}
          setAppModal={setAppModal}
          showError={showError}
          onDraftMessage={(c) => { setDraftContact(c); setTab("ai"); }}
        />
      )}
      {tab === "ai" && (
        <AITab
          data={data} profileComplete={profileComplete}
          kitApp={kitApp} setKitApp={setKitApp}
          resumeTab={resumeTab} setResumeTab={setResumeTab}
          draftContact={draftContact} clearDraftContact={() => setDraftContact(null)}
          saveStarStories={saveStarStories} setTab={setTab}
          setAppModal={setAppModal} setContactModal={setContactModal}
          showError={showError} setProfileModal={setProfileModal}
        />
      )}
      {tab === "resources" && <ResourcesTab />}

      {/* Modals */}
      {appModal && (
        <AppModal
          modal={appModal} contacts={data.contacts}
          onSave={app => {
            saveApp(app);
            const cb = appModal.onAfterSave;
            setAppModal(null);
            if (typeof cb === "function") cb(app);
          }}
          onDelete={id => { deleteApp(id); setAppModal(null); }}
          onClose={() => setAppModal(null)}
        />
      )}
      {contactModal && (
        <ContactModal
          modal={contactModal} apps={data.applications}
          onSave={c => {
            saveContact(c);
            const cb = contactModal.onAfterSave;
            setContactModal(null);
            if (typeof cb === "function") cb(c);
          }}
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
          data={data}
          onSave={saveApp}
          onClose={() => setPrepModal(null)}
          showError={showError}
        />
      )}
      {debriefModal && (
        <DebriefModal
          app={debriefModal.app}
          onSave={app => { saveApp(app); setDebriefModal({ app }); }}
          onClose={() => setDebriefModal(null)}
        />
      )}
      {offerModal && (
        <OfferModal
          app={offerModal.app}
          onSave={app => { saveApp(app); setOfferModal({ app }); }}
          onClose={() => setOfferModal(null)}
        />
      )}
      {applyWizard && (
        <ApplyWizardModal
          app={applyWizard.app}
          data={data}
          applications={data.applications}
          saveApp={saveApp}
          addDailyAction={addDailyAction}
          showError={showError}
          onClose={() => setApplyWizard(null)}
        />
      )}
    </div>
  );
}
