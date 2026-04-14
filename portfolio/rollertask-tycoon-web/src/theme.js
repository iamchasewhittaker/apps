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

// ── STORAGE ───────────────────────────────────────────────────────────────
const STORE_KEY = "chase_hub_rollertask_v1";

export const loadBlob = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch { return null; }
};
export const saveBlob = (data) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...data, _syncAt: Date.now() })); } catch {}
};

// ── DATE HELPERS ──────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10);

// ── DEFAULT BLOB ─────────────────────────────────────────────────────────
export const DEFAULT_ROLLERTASK = { schemaVersion: 2, cash: 0, tasks: [], ledger: [] };
