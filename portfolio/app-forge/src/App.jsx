import { useState, useEffect, useRef } from "react";

// ── GLOBAL RESET ───────────────────────────────────────────────
// Prevents white border around app edges on all browsers/PWA
const _style = document.createElement("style");
_style.textContent = "html,body{margin:0;padding:0;background:#0d0d0f;}*{box-sizing:border-box;}";
document.head.appendChild(_style);

// ── STORAGE ────────────────────────────────────────────────────
const STORE = "chase_forge_v1";
const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
const save = (d) => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch {} };

const defaultData = {
  lessons: [],
  ideas: [],
  auditHistory: [],
  appSnapshots: {},
  settings: { beginnerMode: true, lastAuditedApp: null },
};

// ── APP PROFILES ───────────────────────────────────────────────
const APPS = {
  wellness: {
    name: "Wellness Tracker",
    color: "#1D9E75",
    bg: "#1D9E7515",
    border: "#1D9E7535",
    storageKey: "chase_wellness_v1",
    markers: ["chase_wellness_v1", "TrackerTab", "TasksTab", "BudgetTool", "HistoryView", "chase_wellness"],
  },
  growth: {
    name: "Growth Tracker",
    color: "#378ADD",
    bg: "#378ADD15",
    border: "#378ADD35",
    storageKey: "chase_growth_v1",
    markers: ["chase_growth_v1", "getStreak", "hadToday", "chase_growth", "cfm", "bom", "gmat"],
  },
  jobsearch: {
    name: "Job Search HQ",
    color: "#BA7517",
    bg: "#BA751715",
    border: "#BA751735",
    storageKey: "chase_job_search_v1",
    markers: ["chase_job_search_v1", "callClaude", "CHASE_CONTEXT", "profileContext", "chase_job_search"],
  },
};

// ── APP SNAPSHOT DEFAULTS ──────────────────────────────────────
// Pre-filled starting state for each app. User overwrites these each update.
const APP_SNAPSHOT_DEFAULTS = {
  wellness: {
    version: "v15.9",
    lastUpdated: "2026-03-24",
    summary: "Supabase sync live: magic-link auth, push/pull wired. Shared project with Job Search (shared-supabase-project). Configurable meds list, backup restore UI.",
    liveUrl: "https://wellness-tracker-kappa.vercel.app",
    storageKey: "chase_wellness_v1",
    localFolder: "~/Documents/wellness-tracker",
    notes: "Auth: magic-link only. Supabase project: shared-supabase-project (shared with Job Search).",
  },
  growth: {
    version: "v6",
    lastUpdated: "2026-03-23",
    summary: "Retired — all features and data merged into Wellness Tracker Growth tab.",
    liveUrl: "https://growth-tracker-rouge.vercel.app",
    storageKey: "chase_growth_v1",
    localFolder: "~/Documents/growth-tracker",
    notes: "🗄️ Retired. Data lives in chase_wellness_v1.growthLogs.",
  },
  jobsearch: {
    version: "v8.2",
    lastUpdated: "2026-03-24",
    summary: "Supabase sync live (shared project with Wellness). Fixed auth bug: .env pointed to wrong project — magic links now redirect correctly to job-search-hq.vercel.app.",
    liveUrl: "https://job-search-hq.vercel.app",
    storageKey: "chase_job_search_v1",
    localFolder: "~/Documents/job-search-hq",
    notes: "Auth: magic-link only, shared Supabase project (shared-supabase-project). Anthropic key stored separately under chase_anthropic_key.",
  },
  appforge: {
    version: "v8.1",
    lastUpdated: "2026-03-24",
    summary: "Updated all app snapshots to current versions. Created CLAUDE.md. Wellness v15.9 (Supabase live), Job Search v8.2 (auth fix + Supabase live), Growth retired.",
    liveUrl: "https://app-forge-fawn.vercel.app",
    storageKey: "chase_forge_v1",
    localFolder: "~/Documents/app-forge",
    notes: "",
  },
};

const LESSON_TYPES = ["Bug fix", "Pattern learned", "Regression", "Performance", "Architecture", "Deployment", "Safari/PWA", "Other"];
const IDEA_PRIORITY = ["High", "Medium", "Low"];
const IDEA_STATUS = ["Idea", "Planned", "In progress", "Shipped", "Dropped"];
const PRIORITY_COLOR = { High: "#D85A30", Medium: "#BA7517", Low: "#1D9E75" };
const STATUS_COLOR = { Idea: "#5a5870", Planned: "#378ADD", "In progress": "#BA7517", Shipped: "#1D9E75", Dropped: "#3a3a48" };

// ── AUDIT ENGINE ───────────────────────────────────────────────
function detectApp(code) {
  // 1. Try APP_META comment first (authoritative)
  const metaMatch = code.match(/\/\/\s*APP_META:\s*(\{[^}]+\})/);
  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      if (meta.app && APPS[meta.app]) return meta.app;
    } catch {}
  }

  // 2. Fall back to marker scoring for backwards compatibility
  let best = null, bestScore = 0;
  for (const [key, app] of Object.entries(APPS)) {
    const score = app.markers.filter(m => code.includes(m)).length;
    if (score > bestScore) { bestScore = score; best = key; }
  }
  return bestScore >= 2 ? best : null;
}

function runAudit(code, appKey) {
  const app = APPS[appKey];
  const checks = [];
  const add = (id, label, pass, expert, beginner, fix) =>
    checks.push({ id, label, pass, expert, beginner, fix });

  const keyPresent = code.includes(`"${app.storageKey}"`) || code.includes(`'${app.storageKey}'`);
  add("storage_key", "localStorage key correct", keyPresent,
    `Must contain "${app.storageKey}" — changing this permanently destroys all saved data.`,
    `Your app saves data using a special name tag. If this tag ever changes, all your saved data disappears forever.`,
    `Make sure your storage key is exactly: "${app.storageKey}"`);

  const hasLoadedPresent = code.includes("hasLoaded") && code.includes("useRef");
  add("has_loaded", "hasLoaded ref present", hasLoadedPresent,
    `hasLoaded ref prevents the save useEffect from overwriting localStorage with empty state on first render.`,
    `This is a safety switch. Without it, the app might accidentally erase your data the moment it opens.`,
    `Add: const hasLoaded = useRef(false); and set hasLoaded.current = true; after loading data.`);

  const opens = (code.match(/\{/g) || []).length;
  const closes = (code.match(/\}/g) || []).length;
  add("brace_balance", `Brace balance (${opens} { vs ${closes} })`, opens === closes,
    `Opening { count must equal closing } count. Imbalanced braces cause silent JS failures.`,
    `Every opening curly brace needs a matching closing brace. If they don't match, your app breaks silently.`,
    `Difference of ${Math.abs(opens - closes)}. Find the missing or extra brace before deploying.`);

  const bareConfirm = /(?<![.\w])confirm\s*\(/.test(code);
  add("window_confirm", "Uses window.confirm() not bare confirm()", !bareConfirm,
    `ESLint blocks bare confirm() calls in production builds — the deploy will fail.`,
    `Always write window.confirm() with "window." at the front. The short version breaks your app on deploy.`,
    `Find all confirm( and replace with window.confirm(`);

  add("no_web_vitals", "No reportWebVitals import", !code.includes("reportWebVitals"),
    `reportWebVitals.js was deleted. Importing it will break the build.`,
    `A default file was removed from your project. If your code tries to load it, the app crashes on deploy.`,
    `Remove any line containing reportWebVitals`);

  add("no_logo_svg", "No logo.svg import", !code.includes("logo.svg"),
    `logo.svg was deleted. Any import of it will fail the build.`,
    `A default image was removed. If your code tries to show it, the app crashes on deploy.`,
    `Remove any line containing logo.svg`);

  const saveEffects = (code.match(/useEffect[\s\S]*?localStorage\.setItem/g) || []).length;
  add("unified_save", "Single unified save useEffect", saveEffects <= 1,
    `All persistent state must save through one useEffect to avoid race conditions and partial saves.`,
    `Your app should have exactly one place where it saves data. Multiple save spots cause conflicts.`,
    `Merge all localStorage.setItem calls into a single useEffect watching your main data state.`);

  add("vercel_awareness", "vercel.json reminder (manual check)", true,
    `vercel.json can't be verified from App.jsx — it's a separate file. Confirm it exists in your repo root.`,
    `There's a settings file called vercel.json that always shows green here — but make sure it actually exists in your project folder.`,
    `Confirm vercel.json exists in your project root.`);

  if (appKey === "jobsearch") {
    const correctModel = code.includes("claude-sonnet-4-20250514") || code.includes("claude-sonnet-4-6");
    add("model_string", "Correct Claude model string", correctModel,
      `Model must be claude-sonnet-4-20250514. Wrong model strings cause AI calls to fail silently.`,
      `Your app talks to an AI by name. If the name is wrong, AI features stop working with no obvious error.`,
      `Check the model: field in your callClaude function.`);
  }
  if (appKey === "growth") {
    add("streak_functions", "Core streak functions present",
      code.includes("getStreak") && code.includes("hadToday"),
      `getStreak() and hadToday() are core to the Growth Tracker. Removing them breaks all streak display.`,
      `Your Growth Tracker uses special functions to calculate streaks. If deleted, all streak data disappears.`,
      `Make sure getStreak and hadToday functions exist in your code.`);
  }
  if (appKey === "wellness") {
    add("checkin_sections", "Check-in section keys intact",
      code.includes("morning_start") && code.includes("end_of_day"),
      `morning_start and end_of_day are section keys tied to historical data. Renaming breaks history.`,
      `Your Wellness app stores check-ins using specific labels. Changing them makes all history unreadable.`,
      `Make sure morning_start and end_of_day still exist as section identifiers.`);
  }

  const passed = checks.filter(c => c.pass).length;
  return { checks, score: Math.round((passed / checks.length) * 100), passed, total: checks.length, app, appKey };
}

// ── CONTENT DATA ───────────────────────────────────────────────
const GLOSSARY = [
  { term: "localStorage", expert: "A browser API that persists key-value string data across sessions with ~5MB limit per origin.", beginner: "A way your app saves data directly on your phone — like a tiny personal database. No internet needed. Stays even when you close the app.", link: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
  { term: "useRef", expert: "A React hook returning a mutable ref object. Changes don't trigger re-renders — ideal for side-effect state like hasLoaded.", beginner: "A way to remember something in your app without causing the screen to refresh. The hasLoaded flag uses this — a silent background tracker.", link: "https://react.dev/reference/react/useRef" },
  { term: "useEffect", expert: "A React hook that runs side effects after render. The dependency array controls when it fires.", beginner: "Code that runs automatically when something changes. Like a trigger — 'when X happens, do Y'. Used for loading and saving data.", link: "https://react.dev/reference/react/useEffect" },
  { term: "Brace balance", expert: "In JS/JSX, every { must have a matching }. Imbalanced braces cause parse errors that can fail silently.", beginner: "Every opening curly brace { needs a closing curly brace }. If they don't match, your app breaks — often with a confusing error.", link: null },
  { term: "PWA", expert: "Progressive Web App — installable on mobile via manifest.json, gaining native-like behavior.", beginner: "A website that acts like an app on your iPhone. Add it to your Home Screen from Safari and it opens full-screen.", link: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" },
  { term: "vercel.json", expert: "Vercel config file. The headers block sets server-level HTTP cache-control, overriding Safari's aggressive PWA cache.", beginner: "A settings file that tells your app to always load fresh. Without it your iPhone might show an old version for days after you update.", link: "https://vercel.com/docs/project-configuration" },
  { term: "hasLoaded ref", expert: "A useRef flag set to true after the initial localStorage load. Guards the save useEffect from firing before data is ready.", beginner: "A safety switch: 'don't save data until you've loaded it first'. Without it your app could overwrite your saved data on startup.", link: null },
  { term: "window.confirm()", expert: "The browser's native confirmation dialog. ESLint's no-restricted-globals rule blocks bare confirm() in production builds.", beginner: "A popup that asks 'are you sure?'. Always write window.confirm() — the short version confirm() breaks your app when deployed.", link: null },
  { term: "Git tag", expert: "An immutable pointer to a specific commit. Used here for version tracking deploy milestones.", beginner: "A permanent label on a save point in your code history. If something breaks, you can jump back to any tagged version.", link: "https://git-scm.com/book/en/v2/Git-Basics-Tagging" },
  { term: "Vercel deploy", expert: "Vercel auto-deploys on every git push to main. Build logs visible in the Vercel dashboard.", beginner: "Every time you push code to GitHub, Vercel automatically builds and publishes your app in about 60 seconds.", link: "https://vercel.com/docs/deployments/overview" },
];

const FRAMEWORK_RULES = [
  { rule: "Delete src/App.js immediately after create-react-app", why: "create-react-app creates App.js by default. If App.jsx exists alongside it, the build fails with a logo.svg error. Always delete App.js right after scaffolding." },
  { rule: "Never change the localStorage key after first deploy", why: "Permanently deletes all user data — no recovery. The key is the address where data lives." },
  { rule: "Never remove the hasLoaded ref", why: "It prevents the save effect from running before data loads. Removing it causes your app to overwrite saved data with empty state on startup." },
  { rule: "Always use a single unified save useEffect", why: "Multiple save effects can race each other and cause partial or conflicting saves. One effect = one source of truth." },
  { rule: "Always use window.confirm() not confirm()", why: "ESLint blocks bare confirm() in production. Builds fine locally but breaks on Vercel deploy." },
  { rule: "Never delete vercel.json", why: "Safari's PWA cache is aggressive. vercel.json sets server-level headers that force fresh loads. Without it users see stale versions." },
  { rule: "Verify brace balance before every deploy", why: "Imbalanced braces cause JS parse errors. They often don't show an obvious error — the app just silently fails." },
  { rule: "Always run bash pre-deploy.sh before pushing", why: "Catches all framework violations locally before Vercel does. If it's not all green, don't push." },
  { rule: "Update CHANGELOG.md on every deploy", why: "Version history is how you track what changed, when, and why. Future you will thank current you." },
  { rule: "Never rewrite sections that aren't changing", why: "Every unnecessary rewrite is a regression risk. Surgical edits only." },
  { rule: "All apps use dark mode", why: "Consistency across all apps. Easier on the eyes, especially on iPhone at night." },
  { rule: "Single file: everything in src/App.jsx", why: "One file = easy to edit, easy to version, easy to hand to Claude. No import chains to break." },
];

// ── DESIGN TOKENS ──────────────────────────────────────────────
const C = {
  bg: "#0f1117",
  surface: "#161b27",
  border: "#1f2937",
  borderLight: "#374151",
  text: "#f3f4f6",
  muted: "#6b7280",
  dim: "#374151",
  purple: "#9F8AE8",
  teal: "#1D9E75",
  amber: "#BA7517",
  coral: "#D85A30",
  blue: "#378ADD",
};

const TABS = [
  { id: "audit", label: "Audit", color: C.purple },
  { id: "lessons", label: "Lessons", color: C.teal },
  { id: "learn", label: "Learn", color: C.amber },
  { id: "ideas", label: "Ideas", color: C.coral },
  { id: "apps", label: "Apps", color: C.blue },
];

// ── SHARED UI ──────────────────────────────────────────────────
const Dot = ({ color }) => (
  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 4 }} />
);

const Tag = ({ label, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: color + "20", color, letterSpacing: "0.04em" }}>
    {label}
  </span>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 10, ...style }}>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
    {children}
  </div>
);

const Btn = ({ children, color = C.purple, ghost = false, small = false, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: small ? "5px 10px" : "9px 16px",
    borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    background: ghost ? "transparent" : color,
    color: ghost ? color : "#fff",
    border: ghost ? `1px solid ${color}` : "none",
    outline: "none", transition: "opacity 0.15s",
  }}>
    {children}
  </button>
);

const TextInput = ({ value, onChange, placeholder, inputRef }) => (
  <input ref={inputRef} value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", background: "#0a0a0e", border: `1px solid ${C.borderLight}`,
    borderRadius: 8, color: C.text, fontSize: 14, padding: "9px 12px",
    outline: "none", boxSizing: "border-box",
  }} />
);

const TextArea = ({ value, onChange, placeholder, minHeight = 80, mono = false }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", background: "#0a0a0e", border: `1px solid ${C.borderLight}`,
    borderRadius: 8, color: C.text, fontSize: 13,
    fontFamily: mono ? "'DM Mono', 'Fira Mono', monospace" : "inherit",
    padding: "10px 12px", resize: "vertical", outline: "none",
    boxSizing: "border-box", lineHeight: 1.5, minHeight,
  }} />
);

const Sel = ({ value, onChange, children, style }) => (
  <select value={value} onChange={onChange} style={{
    background: "#0a0a0e", border: `1px solid ${C.borderLight}`,
    borderRadius: 8, color: C.text, fontSize: 13, padding: "7px 10px", outline: "none", ...style,
  }}>
    {children}
  </select>
);

const FilterBar = ({ options, active, onSelect, color }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}>
    {options.map(f => (
      <button key={f.value} onClick={() => onSelect(f.value)} style={{
        flexShrink: 0, padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
        cursor: "pointer", outline: "none",
        background: active === f.value ? color + "20" : "transparent",
        color: active === f.value ? color : C.dim,
        border: `1px solid ${active === f.value ? color : C.dim}`,
      }}>
        {f.label}
      </button>
    ))}
  </div>
);

// ── CHECK ROW ──────────────────────────────────────────────────
function CheckRow({ check, beginnerMode, expanded, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }} onClick={onToggle}>
        <Dot color={check.pass ? C.teal : C.coral} />
        <div style={{ flex: 1, fontSize: 13, color: check.pass ? "#a0c8a0" : "#e8a090", fontWeight: 500, lineHeight: 1.4 }}>
          {check.label}
        </div>
        <span style={{ fontSize: 11, color: C.dim, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 10, marginLeft: 18 }}>
          <div style={{ fontSize: 13, color: "#c8c6c0", lineHeight: 1.6, marginBottom: check.pass ? 0 : 8 }}>
            {beginnerMode ? check.beginner : check.expert}
          </div>
          {!check.pass && (
            <div style={{ background: "#140e08", border: `1px solid #3a2010`, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: 11, color: C.amber, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>How to fix</div>
              <div style={{ fontSize: 12, color: "#c8a070", lineHeight: 1.6 }}>{check.fix}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AUDIT TAB ──────────────────────────────────────────────────
function AuditTab({ data, setData }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [detectedApp, setDetectedApp] = useState(null);
  const [running, setRunning] = useState(false);
  const [expandedCheck, setExpandedCheck] = useState(null);
  const resultsRef = useRef(null);
  const beginnerMode = data.settings?.beginnerMode ?? true;

  useEffect(() => {
    if (code.length > 200) {
      setDetectedApp(detectApp(code));
    } else {
      setDetectedApp(null);
      setResult(null);
    }
  }, [code]);

  const runCheck = () => {
    if (!detectedApp) return;
    setRunning(true);
    setTimeout(() => {
      const r = runAudit(code, detectedApp);
      setResult(r);
      const firstFail = r.checks.find(c => !c.pass);
      setExpandedCheck(firstFail ? firstFail.id : null);
      setData(d => ({
        ...d,
        auditHistory: [{ id: Date.now(), date: new Date().toLocaleDateString(), appKey: detectedApp, appName: APPS[detectedApp].name, score: r.score, passed: r.passed, total: r.total, failedChecks: r.checks.filter(c => !c.pass).map(c => c.label) }, ...(d.auditHistory || [])].slice(0, 50),
        settings: { ...d.settings, lastAuditedApp: detectedApp },
      }));
      setRunning(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 400);
  };

  const scoreColor = s => s >= 90 ? C.teal : s >= 70 ? C.amber : C.coral;
  const failed = result?.checks.filter(c => !c.pass) || [];
  const passed = result?.checks.filter(c => c.pass) || [];

  return (
    <div>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{beginnerMode ? "Beginner mode" : "Expert mode"}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{beginnerMode ? "Plain English explanations" : "Technical detail + exact fixes"}</div>
        </div>
        <Btn color={C.purple} ghost small onClick={() => setData(d => ({ ...d, settings: { ...d.settings, beginnerMode: !beginnerMode } }))}>
          Switch to {beginnerMode ? "expert" : "beginner"}
        </Btn>
      </Card>

      <Card>
        <SectionLabel>Paste your App.jsx</SectionLabel>
        <TextArea value={code} onChange={e => setCode(e.target.value)} placeholder="Paste the full contents of your App.jsx here..." minHeight={120} mono />
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {code.length > 200 ? (
            detectedApp ? (
              <>
                <Tag label={`Detected: ${APPS[detectedApp].name}`} color={APPS[detectedApp].color} />
                <Btn color={C.purple} onClick={runCheck} disabled={running}>{running ? "Running…" : "Run audit"}</Btn>
              </>
            ) : (
              <Tag label="App not recognized — paste more code" color={C.coral} />
            )
          ) : (
            <div style={{ fontSize: 12, color: C.dim }}>Open App.jsx → Cmd+A → Cmd+C → paste here</div>
          )}
        </div>
      </Card>

      {result && (
        <div ref={resultsRef}>
          <Card style={{ background: APPS[result.appKey].bg, border: `1px solid ${APPS[result.appKey].border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{result.app.name}</div>
                <div style={{ fontSize: 52, fontWeight: 700, color: scoreColor(result.score), lineHeight: 1 }}>
                  {result.score}<span style={{ fontSize: 18, color: C.muted, fontWeight: 400 }}>/100</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{result.passed} of {result.total} checks passed</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {result.score === 100
                  ? <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Safe to deploy</div>
                  : <div style={{ fontSize: 13, color: C.coral, fontWeight: 600 }}>{failed.length} issue{failed.length !== 1 ? "s" : ""} to fix</div>
                }
              </div>
            </div>
          </Card>

          {failed.length > 0 && (
            <Card style={{ borderColor: "#3a1810" }}>
              <SectionLabel>Fix before deploying</SectionLabel>
              {failed.map(c => <CheckRow key={c.id} check={c} beginnerMode={beginnerMode} expanded={expandedCheck === c.id} onToggle={() => setExpandedCheck(expandedCheck === c.id ? null : c.id)} />)}
            </Card>
          )}

          <Card>
            <SectionLabel>Passing checks</SectionLabel>
            {passed.map(c => <CheckRow key={c.id} check={c} beginnerMode={beginnerMode} expanded={expandedCheck === c.id} onToggle={() => setExpandedCheck(expandedCheck === c.id ? null : c.id)} />)}
          </Card>

          <Card style={{ background: "#0a0a12" }}>
            <SectionLabel>Next step</SectionLabel>
            {result.score === 100 ? (
              <div style={{ fontSize: 13, color: C.teal, lineHeight: 1.6 }}>
                All checks passed. Run <code style={{ background: "#1a1a28", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>bash pre-deploy.sh</code> then push.
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 8 }}>
                  Fix {failed.length} issue{failed.length !== 1 ? "s" : ""} above before deploying. Tap the first red item for the fix.
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>{failed.map(c => c.label).join(" · ")}</div>
              </div>
            )}
          </Card>

          {/* Auto-suggest lessons from failed checks */}
          {failed.length > 0 && (
            <AuditLessonSuggest failed={failed} appKey={result.appKey} data={data} setData={setData} beginnerMode={beginnerMode} />
          )}
        </div>
      )}

      {(data.auditHistory || []).length > 0 && (
        <Card>
          <SectionLabel>Recent audits</SectionLabel>
          {(data.auditHistory || []).slice(0, 8).map(h => (
            <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Dot color={APPS[h.appKey]?.color || C.muted} />
                <div>
                  <div style={{ fontSize: 13, color: C.text }}>{h.appName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{h.date} · {h.passed}/{h.total} checks</div>
                </div>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: h.score >= 90 ? C.teal : h.score >= 70 ? C.amber : C.coral }}>{h.score}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── LESSONS TAB ────────────────────────────────────────────────
function LessonsTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", app: "all", type: LESSON_TYPES[0], pinned: false });
  const [filter, setFilter] = useState("all");
  const titleRef = useRef(null);

  const openForm = () => {
    setForm(f => ({ ...f, app: data.settings?.lastAuditedApp || "all" }));
    setShowForm(true);
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  const addLesson = () => {
    if (!form.title.trim()) return;
    setData(d => ({ ...d, lessons: [{ ...form, id: Date.now(), date: new Date().toLocaleDateString() }, ...(d.lessons || [])] }));
    setForm({ title: "", body: "", app: data.settings?.lastAuditedApp || "all", type: LESSON_TYPES[0], pinned: false });
    setShowForm(false);
  };

  const deleteLesson = (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    setData(d => ({ ...d, lessons: (d.lessons || []).filter(l => l.id !== id) }));
  };

  const togglePin = (id) =>
    setData(d => ({ ...d, lessons: (d.lessons || []).map(l => l.id === id ? { ...l, pinned: !l.pinned } : l) }));

  const lessons = data.lessons || [];
  const filterOptions = [{ value: "all", label: "All" }, ...Object.entries(APPS).map(([k, v]) => ({ value: k, label: v.name })), ...LESSON_TYPES.map(t => ({ value: t, label: t }))];
  const filtered = filter === "all" ? lessons : lessons.filter(l => l.app === filter || l.type === filter);
  const pinned = filtered.filter(l => l.pinned);
  const unpinned = filtered.filter(l => !l.pinned);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.muted }}>{lessons.length} lesson{lessons.length !== 1 ? "s" : ""} logged</div>
        <Btn color={C.teal} onClick={openForm}>+ Log lesson</Btn>
      </div>

      {showForm && (
        <Card>
          <SectionLabel>New lesson</SectionLabel>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>What did you learn?</div>
            <TextInput inputRef={titleRef} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Short title..." />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Details (optional)</div>
            <TextArea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="What happened? What broke? How did you fix it?" />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>App</div>
              <Sel value={form.app} onChange={e => setForm(f => ({ ...f, app: e.target.value }))}>
                <option value="all">All apps</option>
                {Object.entries(APPS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </Sel>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Type</div>
              <Sel value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {LESSON_TYPES.map(t => <option key={t}>{t}</option>)}
              </Sel>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn color={C.teal} onClick={addLesson}>Save lesson</Btn>
            <Btn color={C.muted} ghost onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <FilterBar options={filterOptions} active={filter} onSelect={setFilter} color={C.teal} />

      {pinned.length > 0 && <><SectionLabel>Pinned</SectionLabel>{pinned.map(l => <LessonCard key={l.id} lesson={l} onDelete={deleteLesson} onPin={togglePin} />)}</>}
      {unpinned.length > 0
        ? unpinned.map(l => <LessonCard key={l.id} lesson={l} onDelete={deleteLesson} onPin={togglePin} />)
        : lessons.length === 0 ? <div style={{ textAlign: "center", color: C.dim, fontSize: 13, marginTop: 48 }}>No lessons yet. Run an audit, break something, learn something.</div> : null
      }
    </div>
  );
}

function LessonCard({ lesson, onDelete, onPin }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <Dot color={lesson.pinned ? C.amber : C.dim} />
            <div style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{lesson.title}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 16 }}>
            {lesson.app !== "all" && <Tag label={APPS[lesson.app]?.name || lesson.app} color={APPS[lesson.app]?.color || C.muted} />}
            <Tag label={lesson.type} color={C.muted} />
            <span style={{ fontSize: 11, color: C.dim }}>{lesson.date}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <button onClick={() => onPin(lesson.id)} style={{ background: "transparent", border: `1px solid ${lesson.pinned ? C.amber : C.dim}`, color: lesson.pinned ? C.amber : C.dim, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, outline: "none" }}>
            {lesson.pinned ? "Unpin" : "Pin"}
          </button>
          <button onClick={() => onDelete(lesson.id)} style={{ background: "transparent", border: `1px solid ${C.dim}`, color: C.dim, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, outline: "none" }}>
            Del
          </button>
        </div>
      </div>
      {expanded && lesson.body && (
        <div style={{ marginTop: 10, marginLeft: 16, fontSize: 13, color: C.muted, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          {lesson.body}
        </div>
      )}
    </Card>
  );
}

// ── LEARN TAB ──────────────────────────────────────────────────
function LearnTab({ data, setData }) {
  const [section, setSection] = useState("rules");
  const [expandedItem, setExpandedItem] = useState(null);
  const beginnerMode = data.settings?.beginnerMode ?? true;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <FilterBar
          options={[{ value: "rules", label: "Framework rules" }, { value: "glossary", label: "Glossary" }]}
          active={section} onSelect={s => { setSection(s); setExpandedItem(null); }} color={C.amber}
        />
        <Btn color={C.amber} ghost small onClick={() => setData(d => ({ ...d, settings: { ...d.settings, beginnerMode: !beginnerMode } }))}>
          {beginnerMode ? "Beginner" : "Expert"}
        </Btn>
      </div>

      <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
        {section === "rules" ? "These rules apply to all your apps. Breaking any causes bugs or data loss." : `Tap any term for ${beginnerMode ? "a plain English explanation" : "the technical definition"}.`}
      </div>

      {section === "rules" && FRAMEWORK_RULES.map((r, i) => (
        <Card key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }} onClick={() => setExpandedItem(expandedItem === i ? null : i)}>
            <div style={{ display: "flex", gap: 10, flex: 1 }}>
              <Dot color={C.teal} />
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{r.rule}</div>
            </div>
            <span style={{ fontSize: 11, color: C.dim, marginLeft: 8, flexShrink: 0 }}>{expandedItem === i ? "▲" : "▼"}</span>
          </div>
          {expandedItem === i && (
            <div style={{ marginTop: 10, marginLeft: 18, fontSize: 13, color: C.muted, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>{r.why}</div>
          )}
        </Card>
      ))}

      {section === "glossary" && GLOSSARY.map((g, i) => (
        <Card key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedItem(expandedItem === `g${i}` ? null : `g${i}`)}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Dot color={C.purple} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.purple, fontFamily: "'DM Mono', 'Fira Mono', monospace" }}>{g.term}</span>
            </div>
            <span style={{ fontSize: 11, color: C.dim }}>{expandedItem === `g${i}` ? "▲" : "▼"}</span>
          </div>
          {expandedItem === `g${i}` && (
            <div style={{ marginTop: 10, marginLeft: 18, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              <div style={{ fontSize: 13, color: "#c8c6c0", lineHeight: 1.6, marginBottom: g.link ? 10 : 0 }}>
                {beginnerMode ? g.beginner : g.expert}
              </div>
              {g.link && <a href={g.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.purple, textDecoration: "none" }}>Learn more →</a>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ── IDEAS TAB ──────────────────────────────────────────────────
function IdeasTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", app: "all", priority: "Medium", status: "Idea" });
  const [filter, setFilter] = useState("all");
  const titleRef = useRef(null);

  const openForm = () => {
    setForm(f => ({ ...f, app: data.settings?.lastAuditedApp || "all" }));
    setShowForm(true);
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  const addIdea = () => {
    if (!form.title.trim()) return;
    setData(d => ({ ...d, ideas: [{ ...form, id: Date.now(), date: new Date().toLocaleDateString() }, ...(d.ideas || [])] }));
    setForm({ title: "", body: "", app: data.settings?.lastAuditedApp || "all", priority: "Medium", status: "Idea" });
    setShowForm(false);
  };

  const updateIdea = (id, updates) =>
    setData(d => ({ ...d, ideas: (d.ideas || []).map(i => i.id === id ? { ...i, ...updates } : i) }));

  const deleteIdea = (id) => {
    if (!window.confirm("Delete this idea?")) return;
    setData(d => ({ ...d, ideas: (d.ideas || []).filter(i => i.id !== id) }));
  };

  const shipIdea = (idea) => {
    setData(d => ({
      ...d,
      ideas: (d.ideas || []).map(i => i.id === idea.id ? { ...i, status: "Shipped" } : i),
      lessons: [{ id: Date.now(), date: new Date().toLocaleDateString(), title: `Shipped: ${idea.title}`, body: idea.body || "", app: idea.app, type: "Pattern learned", pinned: false }, ...(d.lessons || [])],
    }));
  };

  const ideas = data.ideas || [];
  const filterOptions = [{ value: "all", label: "All" }, ...Object.entries(APPS).map(([k, v]) => ({ value: k, label: v.name })), ...IDEA_STATUS.map(s => ({ value: s, label: s }))];
  const filtered = filter === "all" ? ideas : ideas.filter(i => i.app === filter || i.status === filter || i.priority === filter);
  const active = filtered.filter(i => i.status !== "Shipped" && i.status !== "Dropped");
  const done = filtered.filter(i => i.status === "Shipped" || i.status === "Dropped");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.muted }}>{active.length} active idea{active.length !== 1 ? "s" : ""}</div>
        <Btn color={C.coral} onClick={openForm}>+ Add idea</Btn>
      </div>

      {showForm && (
        <Card>
          <SectionLabel>New idea</SectionLabel>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>What do you want to build or improve?</div>
            <TextInput inputRef={titleRef} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Idea title..." />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Details (optional)</div>
            <TextArea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="More context..." minHeight={60} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>App</div>
              <Sel value={form.app} onChange={e => setForm(f => ({ ...f, app: e.target.value }))}>
                <option value="all">Framework-wide</option>
                {Object.entries(APPS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </Sel>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>Priority</div>
              <Sel value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                {IDEA_PRIORITY.map(p => <option key={p}>{p}</option>)}
              </Sel>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn color={C.coral} onClick={addIdea}>Save idea</Btn>
            <Btn color={C.muted} ghost onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <FilterBar options={filterOptions} active={filter} onSelect={setFilter} color={C.coral} />

      {active.length === 0 && ideas.length === 0 && (
        <div style={{ textAlign: "center", color: C.dim, fontSize: 13, marginTop: 48 }}>No ideas yet. Every future improvement starts here.</div>
      )}

      {active.map(idea => <IdeaCard key={idea.id} idea={idea} onUpdate={updateIdea} onDelete={deleteIdea} onShip={shipIdea} />)}

      {done.length > 0 && (
        <>
          <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
          <SectionLabel>Shipped / dropped</SectionLabel>
          {done.map(idea => <IdeaCard key={idea.id} idea={idea} onUpdate={updateIdea} onDelete={deleteIdea} onShip={shipIdea} />)}
        </>
      )}
    </div>
  );
}

function IdeaCard({ idea, onUpdate, onDelete, onShip }) {
  const isDone = idea.status === "Shipped" || idea.status === "Dropped";
  return (
    <Card style={{ marginBottom: 8, opacity: isDone ? 0.55 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <Dot color={PRIORITY_COLOR[idea.priority] || C.muted} />
            <div style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{idea.title}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 16 }}>
            {idea.app !== "all" && <Tag label={APPS[idea.app]?.name || idea.app} color={APPS[idea.app]?.color || C.muted} />}
            <Tag label={idea.priority} color={PRIORITY_COLOR[idea.priority] || C.muted} />
            <Tag label={idea.status} color={STATUS_COLOR[idea.status] || C.muted} />
            <span style={{ fontSize: 11, color: C.dim }}>{idea.date}</span>
          </div>
          {idea.body && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginTop: 8, marginLeft: 16 }}>{idea.body}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
          <Sel value={idea.status} onChange={e => onUpdate(idea.id, { status: e.target.value })} style={{ fontSize: 11, padding: "4px 6px" }}>
            {IDEA_STATUS.map(s => <option key={s}>{s}</option>)}
          </Sel>
          {idea.status === "In progress" && (
            <button onClick={() => onShip(idea)} style={{ background: C.teal + "20", border: `1px solid ${C.teal}`, color: C.teal, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, fontWeight: 600, outline: "none" }}>
              Ship →
            </button>
          )}
          <button onClick={() => onDelete(idea.id)} style={{ background: "transparent", border: `1px solid ${C.dim}`, color: C.dim, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, outline: "none" }}>
            Del
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── AUDIT LESSON SUGGEST ───────────────────────────────────────
function AuditLessonSuggest({ failed, appKey, data, setData, beginnerMode }) {
  const [suggestions, setSuggestions] = useState(
    failed.map(c => ({
      id: c.id,
      title: `${c.label} — ${APPS[appKey]?.name}`,
      body: beginnerMode ? c.beginner : c.expert,
      app: appKey,
      type: "Bug fix",
      selected: true,
    }))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id) => setSuggestions(s => s.map(x => x.id === id ? { ...x, selected: !x.selected } : x));

  const saveAll = () => {
    const toSave = suggestions.filter(s => s.selected).map(s => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleDateString(),
      title: s.title, body: s.body,
      app: s.app, type: s.type, pinned: false,
    }));
    if (toSave.length === 0) return;
    setData(d => ({ ...d, lessons: [...toSave, ...(d.lessons || [])] }));
    setSaved(true);
  };

  if (saved) {
    return (
      <Card style={{ borderColor: C.teal + "40", background: C.teal + "08" }}>
        <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>
          {suggestions.filter(s => s.selected).length} lesson{suggestions.filter(s => s.selected).length !== 1 ? "s" : ""} saved to Lessons tab
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ borderColor: C.purple + "40" }}>
      <SectionLabel>Auto-suggested lessons</SectionLabel>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
        Based on what failed — tap to deselect any you don't want to save.
      </div>
      {suggestions.map(s => (
        <div key={s.id} onClick={() => toggle(s.id)} style={{
          display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0",
          borderBottom: `1px solid ${C.border}`, cursor: "pointer",
          opacity: s.selected ? 1 : 0.4,
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2,
            background: s.selected ? C.purple : "transparent",
            border: `1.5px solid ${s.selected ? C.purple : C.dim}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {s.selected && <div style={{ width: 8, height: 8, borderRadius: 2, background: "#fff" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>{s.title}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Tag label={APPS[s.app]?.name || s.app} color={APPS[s.app]?.color || C.muted} />
              <Tag label={s.type} color={C.muted} />
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12 }}>
        <Btn color={C.purple} onClick={saveAll}>
          Save {suggestions.filter(s => s.selected).length} lesson{suggestions.filter(s => s.selected).length !== 1 ? "s" : ""} →
        </Btn>
      </div>
    </Card>
  );
}

// ── APPS TAB ───────────────────────────────────────────────────
// Shows a card per app with version, changelog summary, and key facts.
// Update it every time you ship a new version of any app.

const ALL_APP_KEYS = ["wellness", "growth", "jobsearch", "appforge"];
const APP_KEY_LABELS = {
  wellness: { ...APPS.wellness, key: "wellness" },
  growth: { ...APPS.growth, key: "growth" },
  jobsearch: { ...APPS.jobsearch, key: "jobsearch" },
  appforge: { name: "App Forge", color: C.purple, key: "appforge" },
};

function AppCard({ appKey, snapshot, onSave }) {
  const meta = APP_KEY_LABELS[appKey];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...snapshot });

  const startEdit = () => { setForm({ ...snapshot }); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = () => { onSave(appKey, form); setEditing(false); };
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <Card style={{ marginBottom: 12 }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{meta.name}</div>
          {snapshot.version && (
            <span style={{ fontSize: 12, fontWeight: 600, background: meta.color + "20", color: meta.color, borderRadius: 4, padding: "2px 8px" }}>
              {snapshot.version}
            </span>
          )}
        </div>
        {!editing && (
          <button onClick={startEdit} style={{ background: "transparent", border: `1px solid ${C.dim}`, color: C.dim, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, outline: "none" }}>
            Update
          </button>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <div>
          {snapshot.lastUpdated && (
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Last updated: {snapshot.lastUpdated}</div>
          )}
          {snapshot.summary ? (
            <div style={{ fontSize: 13, color: "#c8c6c0", lineHeight: 1.6, marginBottom: 10 }}>{snapshot.summary}</div>
          ) : (
            <div style={{ fontSize: 13, color: C.dim, fontStyle: "italic", marginBottom: 10 }}>No changelog entry yet — tap Update after your next deploy.</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {snapshot.liveUrl && (
              <div style={{ fontSize: 12, color: C.muted }}>
                🔗 <a href={snapshot.liveUrl} target="_blank" rel="noreferrer" style={{ color: meta.color, textDecoration: "none" }}>{snapshot.liveUrl}</a>
              </div>
            )}
            {snapshot.storageKey && (
              <div style={{ fontSize: 12, color: C.muted }}>
                🗝 <code style={{ background: "#1a1a28", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8c6c0" }}>{snapshot.storageKey}</code>
              </div>
            )}
            {snapshot.localFolder && (
              <div style={{ fontSize: 12, color: C.muted }}>
                📁 <code style={{ background: "#1a1a28", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8c6c0" }}>{snapshot.localFolder}</code>
              </div>
            )}
            {snapshot.notes && (
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>📝 {snapshot.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 80px", minWidth: 80 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Version</div>
              <TextInput value={form.version} onChange={e => set("version", e.target.value)} placeholder="v12" />
            </div>
            <div style={{ flex: "2 1 140px", minWidth: 140 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Date</div>
              <TextInput value={form.lastUpdated} onChange={e => set("lastUpdated", e.target.value)} placeholder="2026-03-21" />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>What changed (one or two lines)</div>
            <TextArea value={form.summary} onChange={e => set("summary", e.target.value)} placeholder="Describe what you shipped..." minHeight={60} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Notes (optional)</div>
            <TextInput value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Anything else to remember..." />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn color={meta.color} onClick={save}>Save</Btn>
            <Btn color={C.muted} ghost onClick={cancel}>Cancel</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

function AppsTab({ data, setData }) {
  // Merge saved snapshots with defaults so new fields always appear
  const snapshots = {};
  for (const key of ALL_APP_KEYS) {
    snapshots[key] = { ...APP_SNAPSHOT_DEFAULTS[key], ...(data.appSnapshots?.[key] || {}) };
  }

  const saveSnapshot = (appKey, updated) => {
    setData(d => ({
      ...d,
      appSnapshots: { ...(d.appSnapshots || {}), [appKey]: updated },
    }));
  };

  return (
    <div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
        One card per app. After every deploy, tap <strong style={{ color: C.text }}>Update</strong> on that app's card and fill in the version + what changed.
      </div>
      {ALL_APP_KEYS.map(key => (
        <AppCard key={key} appKey={key} snapshot={snapshots[key]} onSave={saveSnapshot} />
      ))}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────
export default function App() {
  const hasLoaded = useRef(false);
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState("audit");

  useEffect(() => {
    const stored = load();
    setData({ ...defaultData, ...stored, appSnapshots: { ...(stored.appSnapshots || {}) }, settings: { ...defaultData.settings, ...(stored.settings || {}) } });
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    save(data);
  }, [data]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: 15, WebkitFontSmoothing: "antialiased" }}>
      <div style={{ padding: "18px 16px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 14 }}>App Forge</div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: "0 0 auto", padding: "9px 16px", fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? t.color : C.muted,
              background: "none", border: "none",
              borderBottom: tab === t.id ? `2px solid ${t.color}` : "2px solid transparent",
              cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s", outline: "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 16px", maxWidth: 560, margin: "0 auto" }}>
        {tab === "audit" && <AuditTab data={data} setData={setData} />}
        {tab === "lessons" && <LessonsTab data={data} setData={setData} />}
        {tab === "learn" && <LearnTab data={data} setData={setData} />}
        {tab === "ideas" && <IdeasTab data={data} setData={setData} />}
        {tab === "apps" && <AppsTab data={data} setData={setData} />}
      </div>
    </div>
  );
}
