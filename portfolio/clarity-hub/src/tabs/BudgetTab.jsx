import React, { useState } from "react";
import { T, fmtCents } from "../theme";

// ── CENTS HELPERS ────────────────────────────────────────────────────────────

function parseDollarsToCents(raw) {
  const trimmed = raw.replace(/,/g, "").trim();
  if (!trimmed) return 0;
  const d = parseFloat(trimmed);
  return isNaN(d) ? 0 : Math.round(d * 100);
}

function centsToDisplay(cents) {
  const v = cents / 100;
  return v === Math.floor(v) ? String(Math.floor(v)) : v.toFixed(2);
}

// ── SCENARIO MATH (mirrors BudgetScenario computed props in Swift) ────────────

function afterNeedsCents(s) { return s.monthlyIncomeCents - s.fixedNeedsCents - s.flexibleNeedsEstimateCents; }
function wantsRemainingCents(s) { return s.wantsBudgetCents - s.wantsSpentCents; }
function surplusCents(s) { return afterNeedsCents(s) - s.wantsSpentCents; }

// ── SHARED STYLES ────────────────────────────────────────────────────────────

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `1px solid ${T.border}` },
  label: { fontSize: 13, color: T.muted },
  value: { fontSize: 13, fontWeight: 600, color: T.text },
  input: { width: "100%", padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
  fieldRow: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 },
  fieldLabel: { fontSize: 11, color: T.muted },
  quickBtn: { flex: 1, padding: "10px 4px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer" },
};

// ── AT A GLANCE CARD ─────────────────────────────────────────────────────────

function GlanceCard({ scenario }) {
  const after = afterNeedsCents(scenario);
  const remaining = wantsRemainingCents(scenario);
  const surplus = surplusCents(scenario);
  const afterColor = after >= 0 ? T.green : T.red;
  const remainingColor = remaining >= 0 ? T.green : T.red;
  const surplusColor = surplus >= 0 ? T.green : T.red;

  return (
    <div style={{ flex: 1, background: T.surfaceHigh, borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>{scenario.label}</div>
      <div style={S.row}>
        <span style={S.label}>Income</span>
        <span style={S.value}>{fmtCents(scenario.monthlyIncomeCents)}</span>
      </div>
      <div style={S.row}>
        <span style={S.label}>After needs</span>
        <span style={{ ...S.value, color: afterColor }}>{fmtCents(after)}</span>
      </div>
      <div style={S.row}>
        <span style={S.label}>Wants left</span>
        <span style={{ ...S.value, color: remainingColor }}>{fmtCents(remaining)}</span>
      </div>
      <div style={{ ...S.row, borderBottom: "none" }}>
        <span style={S.label}>Surplus</span>
        <span style={{ ...S.value, color: surplusColor }}>{fmtCents(surplus)}</span>
      </div>
    </div>
  );
}

// ── SCENARIO EDITOR ──────────────────────────────────────────────────────────

function ScenarioEditor({ scenario, onUpdate }) {
  const [label, setLabel] = useState(scenario.label);
  const [income, setIncome] = useState(centsToDisplay(scenario.monthlyIncomeCents));
  const [fixed, setFixed] = useState(centsToDisplay(scenario.fixedNeedsCents));
  const [flexible, setFlexible] = useState(centsToDisplay(scenario.flexibleNeedsEstimateCents));
  const [wantsBudget, setWantsBudget] = useState(centsToDisplay(scenario.wantsBudgetCents));

  const commit = (patch) => {
    onUpdate({
      ...scenario,
      label: label.trim() || scenario.label,
      monthlyIncomeCents: parseDollarsToCents(income),
      fixedNeedsCents: parseDollarsToCents(fixed),
      flexibleNeedsEstimateCents: parseDollarsToCents(flexible),
      wantsBudgetCents: parseDollarsToCents(wantsBudget),
      ...patch,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {[
        { label: "Label", value: label, set: setLabel, field: "label" },
        { label: "Monthly income ($)", value: income, set: setIncome, field: "income" },
        { label: "Fixed needs ($)", value: fixed, set: setFixed, field: "fixed" },
        { label: "Flexible needs estimate ($)", value: flexible, set: setFlexible, field: "flexible" },
        { label: "Wants budget cap ($)", value: wantsBudget, set: setWantsBudget, field: "wantsBudget" },
      ].map(f => (
        <div key={f.field} style={S.fieldRow}>
          <span style={S.fieldLabel}>{f.label}</span>
          <input
            style={S.input}
            value={f.value}
            onChange={e => f.set(e.target.value)}
            onBlur={() => commit({})}
            type={f.field === "label" ? "text" : "number"}
            min="0"
            step="0.01"
          />
        </div>
      ))}
    </div>
  );
}

// ── WANTS TRACKER ────────────────────────────────────────────────────────────

function WantsTracker({ blob, setBlob }) {
  const [focus, setFocus] = useState("baseline");
  const [custom, setCustom] = useState("");

  const scenario = blob[focus];

  const addSpend = (cents) => {
    setBlob(prev => ({
      ...prev,
      [focus]: { ...prev[focus], wantsSpentCents: prev[focus].wantsSpentCents + cents },
    }));
  };

  const addCustom = () => {
    const cents = parseDollarsToCents(custom);
    if (cents <= 0) return;
    addSpend(cents);
    setCustom("");
  };

  const reset = () => {
    setBlob(prev => ({ ...prev, [focus]: { ...prev[focus], wantsSpentCents: 0 } }));
  };

  const remaining = wantsRemainingCents(scenario);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Wants Tracker</div>

      <div style={{ display: "flex", gap: 0, marginBottom: 14, borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {["baseline", "stretch"].map(k => (
          <button key={k} onClick={() => setFocus(k)} style={{
            flex: 1, padding: "9px 0", background: focus === k ? T.accent : "transparent",
            border: "none", color: focus === k ? "#fff" : T.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            {blob[k].label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={S.row}>
          <span style={S.label}>Budget cap</span>
          <span style={S.value}>{fmtCents(scenario.wantsBudgetCents)}</span>
        </div>
        <div style={S.row}>
          <span style={S.label}>Spent</span>
          <span style={{ ...S.value, color: T.yellow }}>{fmtCents(scenario.wantsSpentCents)}</span>
        </div>
        <div style={{ ...S.row, borderBottom: "none" }}>
          <span style={S.label}>Remaining vs plan</span>
          <span style={{ ...S.value, color: remaining >= 0 ? T.green : T.red }}>{fmtCents(remaining)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {[{ label: "+$5", cents: 500 }, { label: "+$20", cents: 2000 }, { label: "+$50", cents: 5000 }].map(q => (
          <button key={q.label} style={S.quickBtn} onClick={() => addSpend(q.cents)}>{q.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input style={{ ...S.input }} type="number" min="0" step="0.01" placeholder="Custom ($)" value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustom()} />
        <button onClick={addCustom} style={{ ...S.quickBtn, flex: "none", padding: "9px 16px" }}>Add</button>
      </div>

      <button onClick={reset} style={{ background: "none", border: `1px solid ${T.red}`, color: T.red, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        Reset wants spent
      </button>
    </div>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function BudgetTab({ blob, setBlob }) {
  const updateScenario = (key, updated) => setBlob(prev => ({ ...prev, [key]: updated }));

  return (
    <div style={{ padding: 16 }}>
      <div style={S.card}>
        <div style={S.cardTitle}>At a Glance</div>
        <div style={{ display: "flex", gap: 10 }}>
          <GlanceCard scenario={blob.baseline} />
          <GlanceCard scenario={blob.stretch} />
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Baseline Scenario</div>
        <ScenarioEditor scenario={blob.baseline} onUpdate={s => updateScenario("baseline", s)} />
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Stretch Scenario</div>
        <ScenarioEditor scenario={blob.stretch} onUpdate={s => updateScenario("stretch", s)} />
      </div>

      <WantsTracker blob={blob} setBlob={setBlob} />
    </div>
  );
}
