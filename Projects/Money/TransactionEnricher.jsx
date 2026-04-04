import { useState, useCallback, useRef, useEffect, useMemo } from "react";

const COLORS = {
  bg: "#0f1117",
  surface: "#1a1d27",
  card: "#20232f",
  border: "#2a2d3e",
  accent: "#4ade80",
  accentDim: "#22c55e22",
  text: "#e2e8f0",
  muted: "#64748b",
  warning: "#f59e0b",
  error: "#ef4444",
};

const DEFAULT_RULES = [
  { id: 1, pattern: "amazon", category: "Shopping" },
  { id: 2, pattern: "amzn", category: "Shopping" },
  { id: 3, pattern: "apple", category: "Subscriptions" },
  { id: 4, pattern: "netflix", category: "Subscriptions" },
  { id: 5, pattern: "spotify", category: "Subscriptions" },
  { id: 6, pattern: "hulu", category: "Subscriptions" },
  { id: 7, pattern: "youtube", category: "Subscriptions" },
  { id: 8, pattern: "uber eats", category: "Dining Out" },
  { id: 9, pattern: "doordash", category: "Dining Out" },
  { id: 10, pattern: "grubhub", category: "Dining Out" },
  { id: 11, pattern: "starbucks", category: "Dining Out" },
  { id: 12, pattern: "walmart", category: "Groceries" },
  { id: 13, pattern: "target", category: "Shopping" },
  { id: 14, pattern: "costco", category: "Groceries" },
  { id: 15, pattern: "whole foods", category: "Groceries" },
  { id: 16, pattern: "chevron", category: "Gas & Fuel" },
  { id: 17, pattern: "shell", category: "Gas & Fuel" },
  { id: 18, pattern: "exxon", category: "Gas & Fuel" },
  { id: 19, pattern: "uber", category: "Transportation" },
  { id: 20, pattern: "lyft", category: "Transportation" },
];

const DEFAULT_DAY_WINDOW = 3;
const STORAGE_KEY = "txenricher_rules";
const WINDOW_KEY = "txenricher_daywindow";

function loadRules() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_RULES;
}

function saveRules(rules) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rules)); } catch {}
}

function loadDayWindow() {
  try {
    const raw = localStorage.getItem(WINDOW_KEY);
    if (raw !== null) return parseInt(raw, 10);
  } catch {}
  return DEFAULT_DAY_WINDOW;
}

function saveDayWindow(w) {
  try { localStorage.setItem(WINDOW_KEY, String(w)); } catch {}
}

function applyRules(payee, rules) {
  const lower = payee.toLowerCase();
  const match = rules.find(r => r.pattern && lower.includes(r.pattern.toLowerCase()));
  return match ? match.category : null;
}

// ─── Confidence scoring ────────────────────────────────────────────────────

function matchByDateAmountScored(bankRow, candidates, dateCol, amountCol, dayWindow, tolerance = 0.01) {
  const bDate = normalizeDate(bankRow[dateCol]);
  const bAmt = Math.abs(parseAmount(bankRow[amountCol]));

  let best = null;
  let bestScore = -1;

  for (const c of candidates) {
    const cDate = normalizeDate(c._date);
    const cAmt = Math.abs(parseAmount(c._amount));
    const dateDiff = Math.abs(new Date(bDate) - new Date(cDate)) / 86400000;
    const amountDiff = Math.abs(bAmt - cAmt);

    if (dateDiff > dayWindow) continue;
    if (amountDiff > tolerance) continue;

    const dateScore = 1 - dateDiff / (dayWindow + 1);
    const amountScore = amountDiff <= 0.01 ? 1.0 : Math.max(0, 1 - amountDiff / 0.5);
    const score = dateScore * 0.55 + amountScore * 0.45;

    if (score > bestScore) {
      bestScore = score;
      best = { match: c, confidence: score, dateDiff, amountDiff };
    }
  }

  return best || null;
}

function confidenceLabel(conf) {
  if (conf >= 0.85) return { label: "HIGH", color: "#4ade80" };
  if (conf >= 0.55) return { label: "MED", color: "#f59e0b" };
  return { label: "LOW", color: "#ef4444" };
}

// ─── CSV / matching helpers ────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase());
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; continue; }
      if (line[i] === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
      else cur += line[i];
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || "");
    return obj;
  }).filter(r => Object.values(r).some(v => v));
}

function detectBankColumns(rows) {
  if (!rows.length) return null;
  const keys = Object.keys(rows[0]);
  const find = (patterns) => keys.find(k => patterns.some(p => k.includes(p)));
  const dateCol = find(["date", "posted", "transaction date", "trans date"]);
  const amountCol = find(["amount", "debit", "credit", "charge", "sum"]);
  const payeeCol = find(["description", "payee", "merchant", "memo", "name", "narrative"]);
  return { dateCol, amountCol, payeeCol };
}

function parseAmount(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.\-]/g, "")) || 0;
}

function normalizeDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (!isNaN(d)) return d.toISOString().split("T")[0];
  return str.split(/[\/\-]/).reverse().join("-");
}

function parseAmazon(rows) {
  return rows.map(r => ({
    _date: r["order date"] || r["date"] || r["shipment date"] || "",
    _amount: r["item total"] || r["order total"] || r["amount"] || "",
    _desc: r["title"] || r["product name"] || r["item"] || r["description"] || "",
    _category: "Shopping",
    _payee: "Amazon",
    _source: "amazon",
  }));
}

function parseApple(rows) {
  return rows.map(r => ({
    _date: r["purchase date"] || r["date"] || "",
    _amount: r["amount"] || r["price"] || r["total"] || "",
    _desc: r["description"] || r["app name"] || r["item"] || r["title"] || "",
    _category: "Subscriptions",
    _payee: r["app name"] || r["description"] || "Apple",
    _source: "apple",
  }));
}

function parsePrivacy(rows) {
  return rows.map(r => ({
    _date: r["date"] || r["created"] || r["transaction date"] || "",
    _amount: r["amount"] || r["debit"] || "",
    _desc: r["merchant"] || r["merchant name"] || r["description"] || "",
    _category: "",
    _payee: r["merchant"] || r["merchant name"] || "Privacy.com",
    _source: "privacy",
  }));
}

// ─── Export filter logic ───────────────────────────────────────────────────

function applyExportFilter(results, { matchFilter, dateFrom, dateTo }) {
  return results.filter(r => {
    if (matchFilter === "matched" && !r.matched) return false;
    if (matchFilter === "unmatched" && r.matched) return false;
    const d = normalizeDate(r.date);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  });
}

// ─── Upload zone ───────────────────────────────────────────────────────────

function UploadZone({ label, icon, color, onFile, fileName }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const handle = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => onFile(e.target.result, file.name);
    reader.readAsText(file);
  };
  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      style={{
        border: `1.5px dashed ${drag ? color : fileName ? color + "88" : COLORS.border}`,
        borderRadius: 12,
        padding: "18px 16px",
        cursor: "pointer",
        background: drag ? color + "11" : fileName ? color + "09" : COLORS.card,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: fileName ? color : COLORS.muted, fontWeight: 600, letterSpacing: 1 }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fileName || "Drop CSV here or click to upload"}
        </div>
      </div>
      {fileName && <span style={{ color, fontSize: 16 }}>✓</span>}
      <input ref={ref} type="file" accept=".csv" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
    </div>
  );
}

// ─── Inline edit field ─────────────────────────────────────────────────────

function EditField({ label, value, onChange, onKeyDown, autoFocus }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, marginBottom: 3, fontWeight: 600 }}>{label}</div>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          width: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          padding: "6px 9px",
          color: COLORS.text,
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: 12,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.accent}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
    </div>
  );
}

// ─── Confidence pill ───────────────────────────────────────────────────────

function ConfidencePill({ confidence, dateDiff, amountDiff }) {
  const { color } = confidenceLabel(confidence);
  const pct = Math.round(confidence * 100);
  const tooltip = `${pct}% — date off by ${dateDiff === 0 ? "0" : dateDiff.toFixed(1)}d, amount off by $${amountDiff.toFixed(2)}`;

  return (
    <span
      title={tooltip}
      style={{
        fontSize: 10,
        background: color + "1a",
        color,
        borderRadius: 4,
        padding: "2px 7px",
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: "default",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        border: `1px solid ${color}44`,
      }}
    >
      <span style={{
        display: "inline-block",
        width: 20,
        height: 3,
        background: color + "33",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        verticalAlign: "middle",
      }}>
        <span style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
        }} />
      </span>
      {pct}%
    </span>
  );
}

// ─── Export Filter Bar ─────────────────────────────────────────────────────

function DateInput({ value, onChange, label }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: COLORS.muted, letterSpacing: 1, fontWeight: 700, marginBottom: 3 }}>{label}</div>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          padding: "6px 8px",
          color: value ? COLORS.text : COLORS.muted,
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: 11,
          outline: "none",
          boxSizing: "border-box",
          colorScheme: "dark",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.accent}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
    </div>
  );
}

function ExportFilterBar({ results, exportFilter, onExportFilterChange }) {
  const { matchFilter, dateFrom, dateTo } = exportFilter;
  const isFiltered = matchFilter !== "all" || dateFrom || dateTo;
  const filteredCount = useMemo(() => applyExportFilter(results, exportFilter).length, [results, exportFilter]);

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${isFiltered ? COLORS.accent + "55" : COLORS.border}`,
      borderRadius: 10,
      padding: "14px 16px",
      marginBottom: 12,
      transition: "border-color 0.2s",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, fontWeight: 700 }}>EXPORT FILTER</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isFiltered && (
            <button
              onClick={() => onExportFilterChange({ matchFilter: "all", dateFrom: "", dateTo: "" })}
              style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                color: COLORS.muted, borderRadius: 5, padding: "3px 10px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 1,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >CLEAR</button>
          )}
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: isFiltered ? COLORS.accent : COLORS.muted,
            background: isFiltered ? COLORS.accentDim : COLORS.surface,
            border: `1px solid ${isFiltered ? COLORS.accent + "44" : COLORS.border}`,
            borderRadius: 6, padding: "3px 10px",
            transition: "all 0.2s",
          }}>
            {filteredCount} / {results.length} rows
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        {/* Match toggle */}
        <div>
          <div style={{ fontSize: 9, color: COLORS.muted, letterSpacing: 1, fontWeight: 700, marginBottom: 3 }}>MATCH STATUS</div>
          <div style={{ display: "flex", borderRadius: 7, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
            {[
              { value: "all", label: "ALL" },
              { value: "matched", label: "✓ ENRICHED" },
              { value: "unmatched", label: "✗ UNMATCHED" },
            ].map((opt, i, arr) => (
              <button
                key={opt.value}
                onClick={() => onExportFilterChange({ ...exportFilter, matchFilter: opt.value })}
                style={{
                  padding: "6px 12px",
                  background: matchFilter === opt.value ? COLORS.accent : "transparent",
                  color: matchFilter === opt.value ? "#0f1117" : COLORS.muted,
                  border: "none",
                  borderRight: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  fontFamily: "inherit",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flex: 1, minWidth: 200 }}>
          <DateInput
            value={dateFrom}
            onChange={v => onExportFilterChange({ ...exportFilter, dateFrom: v })}
            label="FROM DATE"
          />
          <span style={{ color: COLORS.muted, fontSize: 12, paddingBottom: 8, flexShrink: 0 }}>→</span>
          <DateInput
            value={dateTo}
            onChange={v => onExportFilterChange({ ...exportFilter, dateTo: v })}
            label="TO DATE"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Settings panel ────────────────────────────────────────────────────────

function SettingsPanel({ rules, onRulesChange, dayWindow, onDayWindowChange, onClose }) {
  const [newPattern, setNewPattern] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const p = newPattern.trim();
    const c = newCategory.trim();
    if (!p || !c) { setError("Both fields required"); return; }
    if (rules.some(r => r.pattern.toLowerCase() === p.toLowerCase())) {
      setError("Pattern already exists"); return;
    }
    onRulesChange([...rules, { id: Date.now(), pattern: p, category: c }]);
    setNewPattern("");
    setNewCategory("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 100vw)",
        background: COLORS.surface, borderLeft: `1px solid ${COLORS.border}`,
        zIndex: 50, display: "flex", flexDirection: "column",
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
      }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.accent, fontWeight: 700 }}>SETTINGS</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginTop: 4 }}>Match & Category Rules</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Tune matching behavior and auto-assign categories</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 16, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>DATE MATCH WINDOW</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <input type="range" min={0} max={7} step={1} value={dayWindow} onChange={e => onDayWindowChange(parseInt(e.target.value, 10))} style={{ width: "100%", accentColor: COLORS.accent, cursor: "pointer", height: 4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {[0,1,2,3,4,5,6,7].map(n => (
                  <span key={n} style={{ fontSize: 9, color: n === dayWindow ? COLORS.accent : COLORS.muted, fontWeight: n === dayWindow ? 700 : 400 }}>{n}</span>
                ))}
              </div>
            </div>
            <div style={{ minWidth: 52, textAlign: "center", background: COLORS.card, border: `1px solid ${COLORS.accent}44`, borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.accent, lineHeight: 1 }}>±{dayWindow}</div>
              <div style={{ fontSize: 9, color: COLORS.muted, marginTop: 3 }}>DAYS</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8, lineHeight: 1.5 }}>
            Transactions matched within this window get a confidence score. Wider windows find more matches but may produce lower-confidence results.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[{ label: "HIGH ≥85%", color: "#4ade80" }, { label: "MED ≥55%", color: "#f59e0b" }, { label: "LOW <55%", color: "#ef4444" }].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: COLORS.muted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>ADD CATEGORY RULE</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1.2 }}>
              <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, marginBottom: 4 }}>PAYEE PATTERN</div>
              <input value={newPattern} onChange={e => { setNewPattern(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="e.g. netflix"
                style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "7px 10px", color: COLORS.text, fontFamily: "inherit", fontSize: 12, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = COLORS.accent} onBlur={e => e.target.style.borderColor = COLORS.border} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, marginBottom: 4 }}>CATEGORY</div>
              <input value={newCategory} onChange={e => { setNewCategory(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="e.g. Subscriptions"
                style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "7px 10px", color: COLORS.text, fontFamily: "inherit", fontSize: 12, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = COLORS.accent} onBlur={e => e.target.style.borderColor = COLORS.border} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleAdd} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: COLORS.accent, color: "#0f1117", fontFamily: "inherit", fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap" }}>+ ADD</button>
            </div>
          </div>
          {error && <div style={{ fontSize: 11, color: COLORS.error, marginTop: 6 }}>{error}</div>}
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 8 }}>Patterns match as case-insensitive substrings · Enter to add</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
            ACTIVE RULES <span style={{ color: COLORS.accent }}>({rules.length})</span>
          </div>
          {rules.length === 0 && <div style={{ fontSize: 12, color: COLORS.muted, textAlign: "center", padding: "24px 0" }}>No rules yet — add one above</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {rules.map(rule => (
              <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.card, borderRadius: 8, padding: "9px 12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, color: COLORS.text, fontWeight: 600 }}>{rule.pattern}</span>
                  <span style={{ fontSize: 11, color: COLORS.muted, margin: "0 8px" }}>→</span>
                  <span style={{ fontSize: 11, background: COLORS.accentDim, color: COLORS.accent, borderRadius: 4, padding: "2px 7px", fontWeight: 600 }}>{rule.category}</span>
                </div>
                <button onClick={() => onRulesChange(rules.filter(r => r.id !== rule.id))}
                  style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, padding: "2px 4px", lineHeight: 1, borderRadius: 4, flexShrink: 0 }}
                  onMouseEnter={e => e.target.style.color = COLORS.error}
                  onMouseLeave={e => e.target.style.color = COLORS.muted}
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <button onClick={() => { onRulesChange(DEFAULT_RULES); onDayWindowChange(DEFAULT_DAY_WINDOW); }}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 6, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 1 }}>
            RESET TO DEFAULTS
          </button>
          <div style={{ fontSize: 10, color: COLORS.muted }}>saved automatically</div>
        </div>
      </div>
    </>
  );
}

// ─── Transaction row ───────────────────────────────────────────────────────

function TransactionRow({ r, onSave }) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [draft, setDraft] = useState({ enrichedPayee: "", memo: "", category: "" });

  const sourceColor = (s) => ({ amazon: "#f59e0b", apple: "#60a5fa", privacy: "#a78bfa" })[s] || COLORS.muted;
  const sourceIcon = (s) => ({ amazon: "📦", apple: "🍎", privacy: "🔒" })[s] || "";

  const openEdit = (e) => {
    e.stopPropagation();
    setDraft({ enrichedPayee: r.enrichedPayee, memo: r.memo, category: r.category });
    setEditing(true);
  };

  const handleSave = () => { onSave(r._idx, draft); setEditing(false); };
  const handleCancel = () => setEditing(false);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); };

  const isEdited = r.enrichedPayee !== r._originalEnrichedPayee || r.memo !== r._originalMemo || r.category !== r._originalCategory;
  const hasRuleCategory = r._ruleCategoryApplied && !isEdited;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!editing ? openEdit : undefined}
      style={{
        background: COLORS.card, borderRadius: 10,
        padding: editing ? "14px" : "12px 14px",
        border: `1px solid ${editing ? COLORS.accent + "66" : r.matched ? sourceColor(r.source) + "44" : hovered ? COLORS.border + "cc" : COLORS.border}`,
        display: "flex", flexDirection: "column", gap: editing ? 10 : 4,
        cursor: editing ? "default" : "pointer",
        transition: "border-color 0.15s, padding 0.15s",
        position: "relative",
      }}
    >
      {!editing && hovered && !isEdited && (
        <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: COLORS.muted, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11 }}>✏️</span> click to edit
        </div>
      )}
      {!editing && isEdited && (
        <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: COLORS.accent, letterSpacing: 0.5, fontWeight: 700 }}>edited</div>
      )}

      {editing ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <div style={{ fontSize: 11, color: COLORS.muted }}>was: <span style={{ color: COLORS.text }}>{r.originalPayee}</span></div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{r.amount}</span>
              <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 8 }}>{r.date}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <EditField label="PAYEE" value={draft.enrichedPayee} onChange={v => setDraft(d => ({ ...d, enrichedPayee: v }))} onKeyDown={handleKeyDown} autoFocus />
            <EditField label="MEMO" value={draft.memo} onChange={v => setDraft(d => ({ ...d, memo: v }))} onKeyDown={handleKeyDown} />
            <EditField label="CATEGORY" value={draft.category} onChange={v => setDraft(d => ({ ...d, category: v }))} onKeyDown={handleKeyDown} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <button onClick={handleSave} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: COLORS.accent, color: "#0f1117", fontFamily: "inherit", fontWeight: 800, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>SAVE</button>
            <button onClick={handleCancel} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.muted, fontFamily: "inherit", fontWeight: 600, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>CANCEL</button>
            <span style={{ fontSize: 10, color: COLORS.muted, alignSelf: "center", marginLeft: 4 }}>Enter to save · Esc to cancel</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: isEdited || hovered ? 80 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.matched ? `${sourceIcon(r.source)} ${r.enrichedPayee}` : r.originalPayee}
              </div>
              {r.matched && r.originalPayee !== r.enrichedPayee && (
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>was: {r.originalPayee}</div>
              )}
              {r.memo && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.memo}</div>}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.amount}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{r.date}</div>
            </div>
          </div>
          {(r.matched || r.category) && (
            <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap", alignItems: "center" }}>
              {r.source && <span style={{ fontSize: 10, background: sourceColor(r.source) + "22", color: sourceColor(r.source), borderRadius: 4, padding: "2px 7px", fontWeight: 700, letterSpacing: 1 }}>{r.source.toUpperCase()}</span>}
              {r.matched && r._confidence != null && <ConfidencePill confidence={r._confidence} dateDiff={r._dateDiff} amountDiff={r._amountDiff} />}
              {r.category && (
                <span style={{ fontSize: 10, background: hasRuleCategory ? "#4ade8022" : COLORS.border, color: hasRuleCategory ? COLORS.accent : COLORS.muted, borderRadius: 4, padding: "2px 7px", fontWeight: hasRuleCategory ? 700 : 400 }}>
                  {hasRuleCategory ? "⚡ " : ""}{r.category}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main app ──────────────────────────────────────────────────────────────

export default function App() {
  const [bankData, setBankData] = useState(null);
  const [bankFile, setBankFile] = useState("");
  const [amazonData, setAmazonData] = useState(null);
  const [amazonFile, setAmazonFile] = useState("");
  const [appleData, setAppleData] = useState(null);
  const [appleFile, setAppleFile] = useState("");
  const [privacyData, setPrivacyData] = useState(null);
  const [privacyFile, setPrivacyFile] = useState("");
  const [results, setResults] = useState(null);
  const [cols, setCols] = useState(null);
  const [rules, setRules] = useState(loadRules);
  const [dayWindow, setDayWindow] = useState(loadDayWindow);
  const [showSettings, setShowSettings] = useState(false);
  const [exportFilter, setExportFilter] = useState({ matchFilter: "all", dateFrom: "", dateTo: "" });

  useEffect(() => { saveRules(rules); }, [rules]);
  useEffect(() => { saveDayWindow(dayWindow); }, [dayWindow]);
  useEffect(() => { if (results) setExportFilter({ matchFilter: "all", dateFrom: "", dateTo: "" }); }, [results]);

  const handleBank = (text, name) => {
    const rows = parseCSV(text);
    const detected = detectBankColumns(rows);
    setBankData(rows);
    setCols(detected);
    setBankFile(name);
    setResults(null);
  };

  const enrich = useCallback(() => {
    if (!bankData || !cols) return;
    const { dateCol, amountCol, payeeCol } = cols;
    const amazon = amazonData ? parseAmazon(amazonData) : [];
    const apple = appleData ? parseApple(appleData) : [];
    const privacy = privacyData ? parsePrivacy(privacyData) : [];
    const allCandidates = [...amazon, ...apple, ...privacy];

    const enriched = bankData.map((row, i) => {
      const payee = (row[payeeCol] || "").toLowerCase();
      let result = null;
      let source = null;

      if (payee.includes("amazon") || payee.includes("amzn")) {
        result = matchByDateAmountScored(row, amazon, dateCol, amountCol, dayWindow);
        if (result) source = "amazon";
      } else if (payee.includes("apple") || payee.includes("apple.com/bill")) {
        result = matchByDateAmountScored(row, apple, dateCol, amountCol, dayWindow);
        if (result) source = "apple";
      } else if (payee.includes("privacy.com") || payee.includes("privacy")) {
        result = matchByDateAmountScored(row, privacy, dateCol, amountCol, dayWindow);
        if (result) source = "privacy";
      }

      if (!result) {
        result = matchByDateAmountScored(row, allCandidates, dateCol, amountCol, dayWindow);
        if (result) source = result.match._source;
      }

      const match = result ? result.match : null;
      const enrichedPayee = match ? match._payee : (row[payeeCol] || "");
      const memo = match ? match._desc : "";
      const csvCategory = match ? match._category : "";
      const ruleCategory = applyRules(enrichedPayee || row[payeeCol] || "", rules);
      const category = ruleCategory || csvCategory;

      return {
        _idx: i,
        date: row[dateCol] || "",
        amount: row[amountCol] || "",
        originalPayee: row[payeeCol] || "",
        enrichedPayee, memo, category,
        source: source || null,
        matched: !!match,
        _originalEnrichedPayee: enrichedPayee,
        _originalMemo: memo,
        _originalCategory: category,
        _ruleCategoryApplied: !!ruleCategory,
        _confidence: result ? result.confidence : null,
        _dateDiff: result ? result.dateDiff : null,
        _amountDiff: result ? result.amountDiff : null,
      };
    });
    setResults(enriched);
  }, [bankData, amazonData, appleData, privacyData, cols, rules, dayWindow]);

  const handleSave = useCallback((idx, draft) => {
    setResults(prev => prev.map(r => r._idx === idx ? { ...r, ...draft } : r));
  }, []);

  const filteredResults = useMemo(
    () => results ? applyExportFilter(results, exportFilter) : [],
    [results, exportFilter]
  );

  const downloadYNAB = () => {
    const header = "Date,Payee,Memo,Amount";
    const rows = filteredResults.map(r => `"${r.date}","${r.enrichedPayee}","${r.memo}","${r.amount}"`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "enriched_ynab.csv"; a.click();
  };

  const downloadFull = () => {
    const header = "Date,Original Payee,Enriched Payee,Memo,Category,Amount,Source,Confidence";
    const rows = filteredResults.map(r =>
      `"${r.date}","${r.originalPayee}","${r.enrichedPayee}","${r.memo}","${r.category}","${r.amount}","${r.source || ""}","${r._confidence != null ? Math.round(r._confidence * 100) + "%" : ""}"`
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "enriched_full.csv"; a.click();
  };

  const matchedCount = results ? results.filter(r => r.matched).length : 0;
  const editedCount = results ? results.filter(r => r.enrichedPayee !== r._originalEnrichedPayee || r.memo !== r._originalMemo || r.category !== r._originalCategory).length : 0;
  const ruleCatCount = results ? results.filter(r => r._ruleCategoryApplied && !(r.enrichedPayee !== r._originalEnrichedPayee || r.memo !== r._originalMemo || r.category !== r._originalCategory)).length : 0;
  const matchedRows = results ? results.filter(r => r.matched && r._confidence != null) : [];
  const avgConfidence = matchedRows.length ? Math.round(matchedRows.reduce((s, r) => s + r._confidence, 0) / matchedRows.length * 100) : null;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Mono', 'Fira Mono', monospace", padding: "32px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.accent, fontWeight: 700, marginBottom: 8 }}>TRANSACTION ENRICHER</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: COLORS.text, letterSpacing: -0.5 }}>Unmask your spending</h1>
            <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 8 }}>Upload your bank CSV + Amazon, Apple, and Privacy.com exports to get real merchant names and categories.</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1, fontWeight: 600, flexShrink: 0, display: "flex", alignItems: "center", gap: 7, transition: "border-color 0.15s, color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}
          >
            <span style={{ fontSize: 14 }}>⚙</span> RULES
            <span style={{ fontSize: 10, background: COLORS.accentDim, color: COLORS.accent, borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>{rules.length}</span>
          </button>
        </div>

        {/* Uploads */}
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <UploadZone label="BANK TRANSACTIONS (required)" icon="🏦" color={COLORS.accent} onFile={handleBank} fileName={bankFile} />
          <UploadZone label="AMAZON ORDER HISTORY" icon="📦" color="#f59e0b" onFile={(t, n) => { setAmazonData(parseCSV(t)); setAmazonFile(n); setResults(null); }} fileName={amazonFile} />
          <UploadZone label="APPLE PURCHASE HISTORY" icon="🍎" color="#60a5fa" onFile={(t, n) => { setAppleData(parseCSV(t)); setAppleFile(n); setResults(null); }} fileName={appleFile} />
          <UploadZone label="PRIVACY.COM TRANSACTIONS" icon="🔒" color="#a78bfa" onFile={(t, n) => { setPrivacyData(parseCSV(t)); setPrivacyFile(n); setResults(null); }} fileName={privacyFile} />
        </div>

        {cols && (
          <div style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: COLORS.accent, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span>✓ Detected — Date: <b>{cols.dateCol}</b> · Amount: <b>{cols.amountCol}</b> · Payee: <b>{cols.payeeCol}</b></span>
            <span style={{ fontSize: 11, color: COLORS.muted }}>Match window: <b style={{ color: COLORS.accent }}>±{dayWindow} days</b></span>
          </div>
        )}

        <button
          onClick={enrich}
          disabled={!bankData}
          style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: bankData ? COLORS.accent : COLORS.border, color: bankData ? "#0f1117" : COLORS.muted, fontFamily: "inherit", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: bankData ? "pointer" : "not-allowed", marginBottom: 28, transition: "all 0.2s" }}
        >
          ENRICH TRANSACTIONS →
        </button>

        {results && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Total", val: results.length, color: COLORS.text },
                { label: "Enriched", val: matchedCount, color: COLORS.accent },
                { label: "Unmatched", val: results.length - matchedCount, color: COLORS.muted },
                { label: "Auto-Cat", val: ruleCatCount, color: COLORS.warning },
                { label: "Edited", val: editedCount, color: "#a78bfa" },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.card, borderRadius: 10, padding: "12px 8px", textAlign: "center", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, marginTop: 2 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Avg confidence */}
            {avgConfidence !== null && matchedCount > 0 && (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, fontWeight: 700, flexShrink: 0 }}>AVG CONFIDENCE</div>
                <div style={{ flex: 1, height: 5, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${avgConfidence}%`, background: avgConfidence >= 85 ? "#4ade80" : avgConfidence >= 55 ? "#f59e0b" : "#ef4444", borderRadius: 3, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: avgConfidence >= 85 ? "#4ade80" : avgConfidence >= 55 ? "#f59e0b" : "#ef4444", flexShrink: 0 }}>{avgConfidence}%</div>
              </div>
            )}

            <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 12, textAlign: "center" }}>
              ✏️ click any row to edit &nbsp;·&nbsp; ⚡ = auto-categorized &nbsp;·&nbsp; hover confidence pill for details
            </div>

            {/* Export filter */}
            <ExportFilterBar results={results} exportFilter={exportFilter} onExportFilterChange={setExportFilter} />

            {/* Download buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button onClick={downloadYNAB} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${COLORS.accent}`, background: "transparent", color: COLORS.accent, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                ↓ YNAB CSV ({filteredResults.length})
              </button>
              <button onClick={downloadFull} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.muted, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                ↓ FULL CSV ({filteredResults.length})
              </button>
            </div>

            {/* Transaction list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {results.map(r => <TransactionRow key={r._idx} r={r} onSave={handleSave} />)}
            </div>
          </div>
        )}
      </div>

      {showSettings && (
        <SettingsPanel rules={rules} onRulesChange={setRules} dayWindow={dayWindow} onDayWindowChange={setDayWindow} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
