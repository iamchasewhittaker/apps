export const T = {
  bg: "#0f1117",
  surface: "#161b27",
  surfaceHigh: "#1c2333",
  border: "#1f2937",
  text: "#f3f4f6",
  muted: "#6b7280",
  faint: "#161b27",
  accent: "#4f92f2",
  accentLight: "#0f1e30",
  green: "#3db77a",
  greenLight: "#0d2b1e",
  red: "#e05050",
  redLight: "#2b0f0f",
  yellow: "#e8bb32",
  yellowLight: "#2b2210",
  gold: "#c8a84b",
  warn: "#e07040",
  warnLight: "#2b1a0f",
};

// ── STORAGE KEYS ──────────────────────────────────────────────────────────
const KEYS = {
  checkin: "chase_hub_checkin_v1",
  triage: "chase_hub_triage_v1",
  time: "chase_hub_time_v1",
  budget: "chase_hub_budget_v1",
  growth: "chase_hub_growth_v1",
};

export const loadBlob = (app) => {
  try { return JSON.parse(localStorage.getItem(KEYS[app])) || null; } catch { return null; }
};
export const saveBlob = (app, data) => {
  try { localStorage.setItem(KEYS[app], JSON.stringify({ ...data, _syncAt: Date.now() })); } catch {}
};

// ── DATE HELPERS ──────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10);
export const yesterday = () => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// ── DEFAULT BLOBS ─────────────────────────────────────────────────────────
export const DEFAULT_CHECKIN = { entries: [], pulseChecks: [], savedMorning: null, savedEvening: null, syncAt: 0 };

export const DEFAULT_TRIAGE = { capacity: 0, capacityDate: "", tasks: [], ideas: [], wins: [] };

export const DEFAULT_TIME = { sessions: [], activeTimer: null, scriptureDays: [] };

export const DEFAULT_BUDGET = {
  baseline: { id: "baseline", label: "Baseline", monthlyIncomeCents: 500000, fixedNeedsCents: 280000, flexibleNeedsEstimateCents: 90000, wantsBudgetCents: 40000, wantsSpentCents: 0 },
  stretch: { id: "stretch", label: "Stretch", monthlyIncomeCents: 500000, fixedNeedsCents: 260000, flexibleNeedsEstimateCents: 85000, wantsBudgetCents: 55000, wantsSpentCents: 0 },
};

export const DEFAULT_GROWTH = { sessions: [] };

// ── STREAK HELPER ─────────────────────────────────────────────────────────
export const computeStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  const set = new Set(completedDates);
  const todayStr = today();
  let anchor = todayStr;
  if (!set.has(todayStr)) {
    const y = yesterday();
    if (!set.has(y)) return 0;
    anchor = y;
  }
  let count = 0;
  let d = anchor;
  while (set.has(d)) {
    count++;
    const dt = new Date(d + "T00:00:00");
    dt.setDate(dt.getDate() - 1);
    d = dt.toISOString().slice(0, 10);
  }
  return count;
};

// ── FORMAT HELPERS ────────────────────────────────────────────────────────
export const fmtCents = (cents) => {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const fmtDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
