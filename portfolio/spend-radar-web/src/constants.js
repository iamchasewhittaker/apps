// Spend Radar — web dashboard constants
// Reads published CSV from the Spend Radar Google Sheet.
// Paste the two "Publish to web" CSV URLs below after running
//   File > Share > Publish to web > CSV (for Subscriptions tab and Receipts tab)

export const CSV_URLS = {
  // REPLACE after deploy — paste the two CSV URLs from the Sheet's "Publish to web" dialog.
  // Format: https://docs.google.com/spreadsheets/d/e/<LONG_ID>/pub?gid=<TAB_ID>&single=true&output=csv
  subscriptions: "",
  receipts: "",
};

export const STORAGE_KEY = "chase_spend_radar_web_v1";

// --- palette (mirrors docs/BRANDING.md) ---
export const C = {
  bg: "#0b1220",
  surface: "#111827",
  surfaceAlt: "#0f172a",
  border: "#1f2937",
  text: "#e5e7eb",
  muted: "#9ca3af",
  accent: "#14b8a6",
  accent2: "#06b6d4",
  active: "#34d399",
  lapsed: "#fbbf24",
  cancel: "#f87171",
};

// --- category tint ---
export const CATEGORY_TINT = {
  Streaming:  "#a855f7",
  "AI Tools": "#06b6d4",
  Software:   "#3b82f6",
  Utilities:  "#f59e0b",
  Retail:     "#ec4899",
  Food:       "#f97316",
  Transport:  "#14b8a6",
  Finance:    "#10b981",
  Insurance:  "#8b5cf6",
  Other:      "#6b7280",
};

// --- style tokens ---
export const s = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: { maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px" },
  headerBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, flexWrap: "wrap", marginBottom: 24,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: { width: 28, height: 28 },
  brandName: { fontWeight: 800, fontSize: 18, letterSpacing: -0.3 },
  metricRow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12, marginBottom: 24,
  },
  metric: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "14px 16px",
  },
  metricLabel: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  metricValue: { fontWeight: 700, fontSize: 22, marginTop: 6 },
  sectionTitle: {
    fontSize: 13, textTransform: "uppercase", letterSpacing: 0.8,
    color: C.muted, margin: "32px 0 12px",
  },
  categoryBand: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    margin: "20px 0 10px", gap: 8,
  },
  categoryLabel: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600 },
  categoryDot: { width: 8, height: 8, borderRadius: "50%" },
  cardGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 14,
    display: "flex", flexDirection: "column", gap: 6,
  },
  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 8,
  },
  merchant: { fontWeight: 700, fontSize: 15 },
  item: { fontSize: 12, color: C.muted, minHeight: 16 },
  cardRow: {
    display: "flex", justifyContent: "space-between", fontSize: 13,
    marginTop: 4,
  },
  amount: { fontWeight: 700, fontSize: 18, color: C.text },
  chip: (bg) => ({
    fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5,
    padding: "2px 8px", borderRadius: 6,
    background: bg + "22", color: bg, border: `1px solid ${bg}55`,
    fontWeight: 600,
  }),
  button: {
    background: C.accent, color: "#042f2e",
    border: "none", padding: "8px 14px", borderRadius: 8,
    fontWeight: 700, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit",
  },
  buttonGhost: {
    background: "transparent", color: C.text,
    border: `1px solid ${C.border}`, padding: "8px 14px", borderRadius: 8,
    fontWeight: 600, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit",
  },
  table: {
    width: "100%", borderCollapse: "collapse", fontSize: 13,
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, overflow: "hidden",
  },
  th: {
    textAlign: "left", fontSize: 11, textTransform: "uppercase",
    letterSpacing: 0.5, color: C.muted, padding: "10px 12px",
    borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt,
  },
  td: {
    padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
  },
  empty: {
    background: C.surface, border: `1px dashed ${C.border}`,
    borderRadius: 12, padding: 32, textAlign: "center", color: C.muted,
  },
  footer: {
    marginTop: 48, color: C.muted, fontSize: 12, textAlign: "center",
  },
};

// --- tiny CSV parser (no dependencies) ---
// Handles quoted fields with commas + escaped quotes ("").
export function parseCSV(text) {
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ",") { cur.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        cur.push(field); field = "";
        if (cur.length > 0 && !(cur.length === 1 && cur[0] === "")) rows.push(cur);
        cur = [];
      } else { field += ch; }
    }
  }
  if (field !== "" || cur.length > 0) { cur.push(field); rows.push(cur); }
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = (r[i] !== undefined ? r[i] : "").trim(); });
    return o;
  });
}

// --- amount helpers ---
export function parseDollar(str) {
  if (!str) return 0;
  const m = String(str).match(/\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/);
  if (!m) return 0;
  return parseFloat(m[1].replace(/,/g, "")) || 0;
}

export function formatDollar(n) {
  return "$" + (Math.round(n * 100) / 100).toFixed(2);
}

export function monthlyEquivalent(cadence, amountStr) {
  const n = parseDollar(amountStr);
  if (!n) return 0;
  if (cadence === "Weekly") return n * 4.33;
  if (cadence === "Monthly") return n;
  if (cadence === "Quarterly") return n / 3;
  if (cadence === "Yearly") return n / 12;
  return 0;
}

// --- localStorage cache ---
export function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_e) { return null; }
}

export function saveCache(blob) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...blob, _syncAt: Date.now() }));
  } catch (_e) {}
}

export function relativeTime(ms) {
  if (!ms) return "never";
  const diff = Date.now() - ms;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.round(hrs / 24);
  return days + "d ago";
}
