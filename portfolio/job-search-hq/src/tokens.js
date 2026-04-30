// ── DESIGN TOKENS (Command Blue palette) ─────────────────────────────────────
// Single source of truth for every color in Job Search HQ.
// Aligned with Shipyard's nautical token vocabulary where possible.
// Rule: no raw hex/rgba anywhere outside this file.

const bg = "#0A1128";
const surface = "#0E1A3E";

export const T = {
  // Core
  bg,
  surface,
  foreground: "#FFFFFF",
  muted: "#A0AABF",
  card: "rgba(255,255,255,0.05)",
  cardSubtle: "rgba(255,255,255,0.03)",
  border: "rgba(59,130,246,0.12)",
  borderInput: "rgba(59,130,246,0.2)",
  borderHover: "rgba(59,130,246,0.35)",
  borderFocus: "rgba(59,130,246,0.5)",
  overlay: "rgba(0,0,0,0.75)",
  modalBg: "rgba(14,26,62,0.95)",
  bgGradient: `linear-gradient(150deg, ${bg} 0%, ${surface} 100%)`,

  // Accent (blue)
  accent: "#3b82f6",
  accentBg: "rgba(59,130,246,0.15)",
  accentRing: "rgba(59,130,246,0.25)",
  accentShadow: "rgba(59,130,246,0.18)",
  highlight: "#60a5fa",
  highlightLight: "#93c5fd",
  highlightFaint: "#dbeafe",

  // Success (green)
  success: "#34D399",
  successMid: "#4ade80",
  successBright: "#22c55e",
  successLight: "#6ee7b7",
  successTextLight: "#d1fae5",
  successBg: "rgba(52,211,153,0.08)",
  successBorder: "rgba(52,211,153,0.2)",
  successFaded: "#34D39955",
  meeting: "#10b981",

  // Warning (amber)
  warning: "#FBBF24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBorder: "rgba(251,191,36,0.2)",

  // Danger (red)
  danger: "#F87171",
  dangerBg: "rgba(248,113,113,0.08)",
  dangerLight: "#fca5a5",
  dangerBorderDark: "#991b1b",
  dangerBorderDeep: "#7f1d1d",

  // Purple
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  purpleChipBg: "#312e81",
  purpleChipText: "#a5b4fc",

  // Gold
  gold: "#c8a84b",
  goldBg: "#1a1608",
  goldBorder: "#c8a84b55",
  goldDarkBg: "#1c1a0a",
  goldDarkBorder: "#78350f",

  // Kassie card
  kassieBg: "#160a14",
  kassieBorder: "#4a1d3a",
  kassieLabel: "#f0abfc",
  kassieText: "#e9d5ff",
  kassieSubtle: "#c4b5fd",
  kassieCodeBg: "#2a1032",

  // Area-specific
  urgencyBlueBg: "#1e3a5f",
  offerGreenBg: "#14532d",
  offerGreenDarkBg: "#0f2b1a",
  interviewBg: "#0c1a0c",
  backupOrange: "#e07040",
  resourceCyan: "#22d3ee",
  resourceAmber: "#f59e0b",
  setupGuideBg: "#ecfdf5",
  setupGuideBorder: "#a7f3d0",
  setupGuideText: "#065f46",
};
