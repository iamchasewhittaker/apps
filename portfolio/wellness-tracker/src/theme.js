// ─── UPDATE after deploying job search app to Vercel ────────────────────────
export const JOB_TRACKER_URL = "https://job-search-hq.vercel.app"; // ← replace with real URL
// ────────────────────────────────────────────────────────────────────────────
export const T = {
  bg: "#0f1117",
  surface: "#161b27",
  border: "#1f2937",
  text: "#f3f4f6",
  muted: "#6b7280",
  faint: "#161b27",
  accent: "#3d9970",
  accentLight: "#0d2b1e",
  warn: "#e07040",
  warnLight: "#2b1a0f",
  yellow: "#e0b030",
  yellowLight: "#2b2210",
  blue: "#4a7fc0",
  blueLight: "#0f1e30",
  red: "#e05050",
  redLight: "#2b0f0f",
};

// ── STORAGE ────────────────────────────────────────────────────────────────
export const STORE = "chase_wellness_v1";
export const DRAFT_STORE = "chase_wellness_draft_v1";
export const loadDraft = () => { try { return JSON.parse(localStorage.getItem(DRAFT_STORE)) || {}; } catch { return {}; } };
export const saveDraft = (data) => { try { localStorage.setItem(DRAFT_STORE, JSON.stringify(data)); } catch {} };
export const clearDraft = () => { try { localStorage.removeItem(DRAFT_STORE); } catch {} };
export const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
export const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify({ ...data, _syncAt: Date.now() })); } catch {} };

export const MED_STORE = "chase_wellness_meds_v1";
export const DEFAULT_MEDS = ["Sertraline", "Adderall", "Wellbutrin", "Buspar", "Trazodone"];
export const loadMeds = () => { try { return JSON.parse(localStorage.getItem(MED_STORE)) || DEFAULT_MEDS; } catch { return DEFAULT_MEDS; } };
export const saveMeds = (m) => { try { localStorage.setItem(MED_STORE, JSON.stringify(m)); } catch {} };
