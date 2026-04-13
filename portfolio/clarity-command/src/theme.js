export const T = {
  bg: "#0a0d14",
  surface: "#111520",
  surfaceHigh: "#181e2e",
  border: "#1e2638",
  text: "#f3f4f6",
  muted: "#6b7280",
  faint: "#111520",
  // Clarity Command accent — deeper blue/gold instead of green; this app means business
  accent: "#c8a84b",        // gold — covenant, purpose
  accentLight: "#221d0e",
  blue: "#4a7fc0",
  blueLight: "#0f1e30",
  green: "#3d9970",
  greenLight: "#0d2b1e",
  red: "#e05050",
  redLight: "#2b0f0f",
  yellow: "#e0b030",
  yellowLight: "#2b2210",
  warn: "#e07040",
  warnLight: "#2b1a0f",
};

// ── STORAGE ────────────────────────────────────────────────────────────────
export const STORE = "chase_command_v1";
export const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
export const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify({ ...data, _syncAt: Date.now() })); } catch {} };

// ── DATE HELPERS ───────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10); // "2026-04-13"
export const daysBetween = (dateStrA, dateStrB) => {
  const a = new Date(dateStrA);
  const b = new Date(dateStrB);
  return Math.floor(Math.abs(b - a) / 86400000);
};

// Days since a given ISO date string (e.g. layoff date)
export const daysSince = (isoDate) => {
  if (!isoDate) return null;
  return daysBetween(isoDate, today());
};

// Returns true if date string is today
export const isToday = (dateStr) => dateStr === today();

// ── STREAK HELPERS ─────────────────────────────────────────────────────────
// Given an array of daily log objects { date, met }, compute current streak
// (consecutive days ending today or yesterday where met === true)
export const computeStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const todayStr = today();
  let streak = 0;
  let expected = todayStr;
  // allow yesterday as starting point if today not yet logged
  if (sorted[0].date !== todayStr) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (sorted[0].date !== yesterday) return 0;
    expected = yesterday;
  }
  for (const log of sorted) {
    if (log.date !== expected) break;
    if (!log.met) break;
    streak++;
    const d = new Date(expected);
    d.setDate(d.getDate() - 1);
    expected = d.toISOString().slice(0, 10);
  }
  return streak;
};

// ── DEFAULT STATE ──────────────────────────────────────────────────────────
export const DEFAULT_STATE = {
  // Settings
  layoffDate: "",              // ISO date string e.g. "2025-01-01"
  scriptures: [],              // custom additions; base bank is in data/scriptures.js
  reminders: [],               // wife's words; base bank is in data/reminders.js
  targets: {
    jobActions: 5,
    productiveHours: 6,
    budgetCheckin: 1,
    scriptureMinutes: 15,
  },
  // Daily logs — array of { date, areas: { jobs, time, budget, wellness, scripture, prayer }, notes, excuses, top3Tomorrow, jobActions: [] }
  dailyLogs: [],
  _syncAt: null,
};
