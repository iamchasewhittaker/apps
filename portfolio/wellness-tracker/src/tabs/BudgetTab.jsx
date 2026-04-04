import React, { useState } from "react";
import { T } from "../theme";
import { Card, SectionLabel, Divider, ProgressBar } from "../ui";

// ── Shared input styles ────────────────────────────────────────────────────
const incomeInputStyle = {
  flex: 1, padding: "10px 12px", borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: T.surface,
  color: T.text, fontSize: 16, fontFamily: "inherit", fontWeight: 700,
};

const textareaStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: T.surface,
  color: T.text, fontSize: 16, fontFamily: "inherit",
  boxSizing: "border-box", resize: "vertical",
};

// ══════════════════════════════════════════════════════════════════════════
// BUDGET TOOL
// ══════════════════════════════════════════════════════════════════════════

const BUDGET_CATS = [
  { id: "income", label: "Monthly Take-Home Income", type: "income", icon: "💵" },
  { id: "tithing", label: "Tithing / Giving", type: "fixed", icon: "🙏" },
  { id: "mortgage", label: "Mortgage / Rent", type: "fixed", icon: "🏠" },
  { id: "car", label: "Car Payment(s)", type: "fixed", icon: "🚗" },
  { id: "insurance", label: "Insurance (car, home, health)", type: "fixed", icon: "🛡️" },
  { id: "phone", label: "Phone", type: "fixed", icon: "📱" },
  { id: "internet", label: "Internet", type: "fixed", icon: "🌐" },
  { id: "utilities", label: "Utilities (average)", type: "fixed", icon: "💡" },
  { id: "subscriptions", label: "Subscriptions", type: "fixed", icon: "📺" },
  { id: "debt", label: "Debt Payoff", type: "fixed", icon: "📉" },
  { id: "groceries", label: "Groceries", type: "variable", icon: "🛒" },
  { id: "gas", label: "Gas / Transportation", type: "variable", icon: "⛽" },
  { id: "kids", label: "Kids Expenses", type: "variable", icon: "👧" },
  { id: "medical", label: "Medical / Prescriptions", type: "variable", icon: "💊" },
  { id: "date_nights", label: "Date Nights", type: "variable", icon: "💑" },
  { id: "savings", label: "Savings / Emergency Fund", type: "breathe", icon: "🏦" },
  { id: "chase_personal", label: "Chase Personal Spending", type: "flex", icon: "👤" },
  { id: "wife_personal", label: "Wife Personal Spending", type: "flex", icon: "👤" },
  { id: "other_flex", label: "Other / Everything Else", type: "flex", icon: "🎯" },
];

const TYPE_LABELS = {
  income: { label: "Income", color: T.accent },
  fixed: { label: "Fixed Bills", color: T.blue },
  variable: { label: "Variable Necessities", color: T.warn },
  breathe: { label: "Savings & Breathing Room", color: "#7B5EA7" },
  flex: { label: "Flex / Personal Spending", color: T.yellow },
};

function BudgetTool({ budgetData, setBudgetData }) {
  const [scenario, setScenario] = useState("now");
  const [needChecker, setNeedChecker] = useState({ item: "", cost: "" });
  const [needResult, setNeedResult] = useState(null);

  // Each scenario stores its own values under "now_" or "target_" prefix
  const prefix = scenario === "now" ? "now_" : "tgt_";

  const setVal = (id, val) => {
    const num = parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
    setBudgetData(prev => ({ ...prev, [prefix + id]: num }));
  };

  const get = (id) => budgetData[prefix + id] || 0;

  const income = get("income");
  const wifeIncome = get("wife_income");
  const unemployment = get("unemployment");
  const totalIncome = income + wifeIncome + unemployment;
  const totalFixed = BUDGET_CATS.filter(c => c.type === "fixed").reduce((s, c) => s + get(c.id), 0);
  const totalVariable = BUDGET_CATS.filter(c => c.type === "variable").reduce((s, c) => s + get(c.id), 0);
  const totalBreath = BUDGET_CATS.filter(c => c.type === "breathe").reduce((s, c) => s + get(c.id), 0);
  const totalFlex = BUDGET_CATS.filter(c => c.type === "flex").reduce((s, c) => s + get(c.id), 0);
  const totalSpend = totalFixed + totalVariable + totalBreath + totalFlex;
  const leftover = totalIncome - totalSpend;

  const checkNeed = () => {
    const cost = parseFloat(needChecker.cost) || 0;
    setNeedResult({
      affordable: leftover > 0 && leftover >= cost,
      leftoverAfter: leftover - cost,
    });
  };

  const typeGroups = ["fixed", "variable", "breathe", "flex"];

  const ScenarioHint = scenario === "now"
    ? "Enter your wife's current take-home + any unemployment. Leave Chase income at $0 for now."
    : "Model what life looks like when you're both working. Use your target salary take-home.";

  const [budgetView, setBudgetView] = useState("budget");

  return (
    <div style={{ padding: "0 0 40px" }}>

      {/* Budget sub-nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[{ id: "budget", label: "💰 Budget" }, { id: "wants", label: "🛒 Wants" }].map(t => (
          <button key={t.id} onClick={() => setBudgetView(t.id)} style={{
            flex: 1, padding: "9px 6px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${budgetView === t.id ? T.accent : T.border}`,
            background: budgetView === t.id ? T.accentLight : T.surface,
            color: budgetView === t.id ? T.accent : T.muted,
            fontWeight: budgetView === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {budgetView === "wants" && (
        <WantsTracker budgetData={budgetData} setBudgetData={setBudgetData} />
      )}

      {budgetView === "budget" && (<>

      {/* Scenario switcher */}
      <div style={{ padding: "14px 0 4px" }}>
        <div style={{ fontSize: 20, color: T.muted, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Budget Scenario</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[
            { id: "now", label: "📍 Right Now", sub: "Current single income" },
            { id: "target", label: "🎯 When Working", sub: "Both incomes, target salary" },
          ].map(s => (
            <button key={s.id} onClick={() => setScenario(s.id)} style={{
              flex: 1, padding: "12px 10px", borderRadius: 10,
              border: `2px solid ${scenario === s.id ? T.accent : T.border}`,
              background: scenario === s.id ? T.accentLight : T.surface,
              color: scenario === s.id ? T.accent : T.muted,
              cursor: "pointer", fontFamily: "inherit", textAlign: "center",
            }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 20, marginTop: 2 }}>{s.sub}</div>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 20, color: T.muted, background: T.faint, padding: "8px 12px", borderRadius: 6, lineHeight: 1.5 }}>
          💡 {ScenarioHint}
        </div>
      </div>

      {/* Income section */}
      <Card style={{ marginTop: 14 }}>
        <SectionLabel color={T.accent}>💵 Monthly Income</SectionLabel>

        {scenario === "now" ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>Wife's monthly take-home (after all deductions)</div>
              <div style={{ fontSize: 16, color: T.muted, marginBottom: 6 }}>Bi-weekly paycheck? Multiply by 2.17. Twice monthly? Multiply by 2.</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.muted, fontSize: 15 }}>$</span>
                <input type="number" value={budgetData["now_wife_income"] || ""} onChange={e => setVal("wife_income", e.target.value)}
                  placeholder="0.00" style={incomeInputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>Chase's unemployment benefits (monthly, if any)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.muted, fontSize: 15 }}>$</span>
                <input type="number" value={budgetData["now_unemployment"] || ""} onChange={e => setVal("unemployment", e.target.value)}
                  placeholder="0.00" style={incomeInputStyle} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>Chase's monthly take-home (target role)</div>
              <div style={{ fontSize: 16, color: T.muted, marginBottom: 6 }}>At $130k OTE in Utah → approx. $7,200–$7,800/mo after taxes</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.muted, fontSize: 15 }}>$</span>
                <input type="number" value={budgetData["tgt_income"] || ""} onChange={e => setVal("income", e.target.value)}
                  placeholder="0.00" style={incomeInputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>Wife's monthly take-home</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.muted, fontSize: 15 }}>$</span>
                <input type="number" value={budgetData["tgt_wife_income"] || ""} onChange={e => setVal("wife_income", e.target.value)}
                  placeholder="0.00" style={incomeInputStyle} />
              </div>
            </div>
          </>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 12px", background: T.accentLight, borderRadius: 8, marginTop: 4,
        }}>
          <span style={{ fontSize: 16, color: T.accent, fontWeight: 600 }}>Total monthly income</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.accent }}>${totalIncome.toLocaleString()}</span>
        </div>
      </Card>

      {/* Category groups */}
      {typeGroups.map(type => {
        const cats = BUDGET_CATS.filter(c => c.type === type);
        const total = cats.reduce((s, c) => s + get(c.id), 0);
        const { label, color } = TYPE_LABELS[type];
        return (
          <Card key={type}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SectionLabel color={color}>{label}</SectionLabel>
              <span style={{ fontSize: 16, fontWeight: 700, color }}>${total.toLocaleString()}</span>
            </div>
            {totalIncome > 0 && <div style={{ marginBottom: 14 }}><ProgressBar value={total} max={totalIncome} color={color} /></div>}
            {cats.map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16, minWidth: 24 }}>{cat.icon}</span>
                <span style={{ flex: 1, fontSize: 16, color: T.text }}>{cat.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 16, color: T.muted }}>$</span>
                  <input type="number" value={get(cat.id) || ""}
                    onChange={e => setVal(cat.id, e.target.value)}
                    placeholder="0"
                    style={{
                      width: 90, padding: "8px 10px", borderRadius: 6,
                      border: `1.5px solid ${T.border}`, background: T.faint,
                      color: T.text, fontSize: 16, fontFamily: "inherit", textAlign: "right",
                    }}
                  />
                </div>
              </div>
            ))}
          </Card>
        );
      })}

      {/* Summary */}
      <Card style={{ background: leftover >= 0 ? T.accentLight : T.redLight, border: `1.5px solid ${leftover >= 0 ? T.accent : T.red}` }}>
        <SectionLabel color={leftover >= 0 ? T.accent : T.red}>
          {scenario === "now" ? "📍 Current Monthly Summary" : "🎯 Target Monthly Summary"}
        </SectionLabel>
        {[
          { label: "Total income", val: totalIncome, color: T.accent },
          { label: "Fixed bills", val: -totalFixed, color: T.blue },
          { label: "Variable necessities", val: -totalVariable, color: T.warn },
          { label: "Savings & breathing room", val: -totalBreath, color: "#7B5EA7" },
          { label: "Flex spending", val: -totalFlex, color: T.yellow },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: T.muted }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: r.color }}>{r.val < 0 ? "-" : ""}${Math.abs(r.val).toLocaleString()}</span>
          </div>
        ))}
        <Divider />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
          <span style={{ color: T.text }}>Left over</span>
          <span style={{ color: leftover >= 0 ? T.accent : T.red }}>{leftover < 0 ? "-" : ""}${Math.abs(Math.round(leftover)).toLocaleString()}</span>
        </div>
        {leftover < 0 && (
          <div style={{ marginTop: 10, fontSize: 20, color: T.red, padding: "8px 10px", background: "#fff5f5", borderRadius: 6 }}>
            ⚠️ Spending exceeds income by ${Math.abs(Math.round(leftover)).toLocaleString()}/mo. Start by reviewing flex spending and variable categories.
          </div>
        )}
        {leftover > 0 && scenario === "now" && (
          <div style={{ marginTop: 10, fontSize: 20, color: T.accent, padding: "8px 10px", background: "#f0fff4", borderRadius: 6 }}>
            ✓ You have ${Math.round(leftover).toLocaleString()}/mo breathing room. Consider moving some of this to savings while job searching.
          </div>
        )}
        {leftover > 0 && scenario === "target" && (
          <div style={{ marginTop: 10, fontSize: 20, color: T.accent, padding: "8px 10px", background: "#f0fff4", borderRadius: 6 }}>
            🎯 When both working, you'll have ${Math.round(leftover).toLocaleString()}/mo to accelerate savings and debt payoff.
          </div>
        )}
      </Card>

      {/* Is This a Need? Checker */}
      <Card>
        <SectionLabel color={T.warn}>🛑 Is This a Need? Checker</SectionLabel>
        <div style={{ fontSize: 20, color: T.muted, marginBottom: 14, lineHeight: 1.5 }}>
          Before buying something, fill this in. Wait 24 hours, then check again.
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>What do you want to buy?</div>
          <input
            value={needChecker.item}
            onChange={e => setNeedChecker(p => ({ ...p, item: e.target.value }))}
            placeholder="e.g. new headphones, energy drinks, gym gear..."
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 8,
              border: `1.5px solid ${T.border}`, background: T.surface,
              color: T.text, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 20, color: T.muted, marginBottom: 4 }}>How much does it cost?</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: T.muted }}>$</span>
            <input
              type="number"
              value={needChecker.cost}
              onChange={e => setNeedChecker(p => ({ ...p, cost: e.target.value }))}
              placeholder="0.00"
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 8,
                border: `1.5px solid ${T.border}`, background: T.surface,
                color: T.text, fontSize: 16, fontFamily: "inherit",
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 20, color: T.muted, marginBottom: 8 }}>Ask yourself honestly:</div>
          {[
            "Am I anxious, bored, or stressed right now?",
            "Would I still want this tomorrow if I felt calm?",
            "Is there money actually available in the budget for this?",
            "Could this wait 24 hours without real consequence?",
          ].map(q => (
            <div key={q} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 20, color: T.text }}>
              <span style={{ color: T.warn, marginTop: 1 }}>→</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
        <button onClick={checkNeed} style={{
          width: "100%", padding: "11px", borderRadius: 8,
          border: `1.5px solid ${T.warn}`, background: T.warnLight,
          color: T.warn, fontSize: 20, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>Check the Budget</button>
        {needResult && needChecker.cost && (
          <div style={{
            marginTop: 12, padding: "14px", borderRadius: 8,
            background: needResult.affordable ? T.accentLight : T.redLight,
            border: `1.5px solid ${needResult.affordable ? T.accent : T.red}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: needResult.affordable ? T.accent : T.red, marginBottom: 6 }}>
              {needResult.affordable ? "✓ Budget has room for this" : "⚠️ Budget doesn't have room for this"}
            </div>
            <div style={{ fontSize: 20, color: T.muted }}>
              Leftover after purchase: <strong style={{ color: needResult.leftoverAfter >= 0 ? T.accent : T.red }}>${needResult.leftoverAfter.toLocaleString()}</strong>
            </div>
            {!needResult.affordable && (
              <div style={{ marginTop: 6, fontSize: 20, color: T.red }}>
                Try the 24-hour rule — set a reminder and revisit tomorrow. Most impulse urges pass.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Budget Notes */}
      <Card>
        <SectionLabel>📝 Budget Notes</SectionLabel>
        <textarea
          value={budgetData.notes || ""}
          onChange={e => setBudgetData(p => ({ ...p, notes: e.target.value }))}
          placeholder="Financial goals, things to discuss with your spouse, upcoming expenses..."
          rows={3} style={textareaStyle}
        />
      </Card>
      </>)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// WANTS TRACKER
// ══════════════════════════════════════════════════════════════════════════

export function WantsTracker({ budgetData, setBudgetData }) {
  const [step, setStep] = useState(0); // 0=list 1=what 2=why+feel 3=classify 4=saved
  const [form, setForm] = useState({});
  const wants = budgetData.wants || [];

  const saveWant = () => {
    const entry = { ...form, id: Date.now(), loggedAt: new Date().toISOString(), status: "waiting" };
    setBudgetData(prev => ({ ...prev, wants: [entry, ...(prev.wants || [])] }));
    setForm({});
    setStep(0);
  };

  const updateWant = (id, updates) => {
    setBudgetData(prev => ({
      ...prev,
      wants: (prev.wants || []).map(w => w.id === id ? { ...w, ...updates } : w)
    }));
  };

  const deleteWant = (id) => {
    setBudgetData(prev => ({ ...prev, wants: (prev.wants || []).filter(w => w.id !== id) }));
  };

  const hoursElapsed = (loggedAt) => {
    return Math.floor((Date.now() - new Date(loggedAt).getTime()) / (1000 * 60 * 60));
  };

  const btnBase = { padding: "10px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, border: "none" };

  const waiting = wants.filter(w => w.status === "waiting");
  const resolved = wants.filter(w => w.status !== "waiting");

  const EMOTIONS = [
    { v: "stressed",  e: "😰", l: "Stressed / overwhelmed" },
    { v: "bored",     e: "😑", l: "Bored" },
    { v: "excited",   e: "😄", l: "Genuinely excited about this" },
    { v: "anxious",   e: "😟", l: "Anxious" },
    { v: "happy",     e: "😊", l: "Happy / good mood" },
    { v: "frustrated",e: "😤", l: "Frustrated" },
    { v: "tired",     e: "😴", l: "Tired / low energy" },
  ];

  return (
    <div>
      <div style={{ background: "#2b1a0f", border: "1px dashed #C4622D44", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: "#6b6a72", lineHeight: 1.6 }}>
        🛒 <strong style={{ color: "#e8e6e0" }}>24-hour rule.</strong> Log the want, wait 24 hours, then decide. Most impulses disappear on their own.
      </div>

      {/* Add button */}
      {step === 0 && (
        <button onClick={() => setStep(1)} style={{ ...btnBase, width: "100%", background: "#C4622D", color: "#fff", marginBottom: 16, fontSize: 14 }}>
          + Log a Want
        </button>
      )}

      {/* Step 1 — What + Cost */}
      {step === 1 && (
        <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 6 }}>New Want · Step 1 of 3</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 14 }}>What do you want to buy?</div>

          <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 6, fontWeight: 600 }}>What is it?</div>
          <input value={form.item || ""} onChange={e => setForm(p => ({...p, item: e.target.value}))}
            placeholder="e.g. new desk lamp, running shoes, subscription..."
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />

          <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 6, fontWeight: 600 }}>Approximate cost?</div>
          <input value={form.cost || ""} onChange={e => setForm(p => ({...p, cost: e.target.value}))}
            placeholder="$0.00" type="number"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />

          <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 6, fontWeight: 600 }}>Link? <span style={{ fontWeight: 400 }}>(optional)</span></div>
          <input value={form.link || ""} onChange={e => setForm(p => ({...p, link: e.target.value}))}
            placeholder="https://..."
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 16 }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStep(0); setForm({}); }} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72" }}>Cancel</button>
            <button onClick={() => form.item?.trim() && setStep(2)} style={{ ...btnBase, flex: 1, background: form.item?.trim() ? "#C4622D" : "#2a2a35", color: "#fff" }}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 2 — Why + Emotional state */}
      {step === 2 && (
        <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 6 }}>New Want · Step 2 of 3</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 14 }}>Why do you want it?</div>

          <textarea value={form.why || ""} onChange={e => setForm(p => ({...p, why: e.target.value}))}
            placeholder="Be honest — what's the real reason? Solve a problem, fill a gap, just want it, saw it and now can't stop thinking about it..."
            rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8E4DC", background: "#16161c", color: "#e8e6e0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", marginBottom: 14 }} />

          <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 8, fontWeight: 600 }}>How are you feeling right now?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {EMOTIONS.map(o => (
              <button key={o.v} onClick={() => setForm(p => ({...p, emotion: o.v}))} style={{
                padding: "6px 11px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                border: `1.5px solid ${form.emotion === o.v ? "#C4622D" : "#2a2a35"}`,
                background: form.emotion === o.v ? "#2b1a0f" : "#1a1a1f",
                color: form.emotion === o.v ? "#C4622D" : "#6b6a72",
                fontWeight: form.emotion === o.v ? 700 : 400,
              }}>{o.e} {o.l}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72" }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ ...btnBase, flex: 1, background: "#C4622D", color: "#fff" }}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Need vs Want */}
      {step === 3 && (
        <div style={{ background: "#1a1a1f", border: "1.5px solid #C4622D", borderRadius: 12, padding: "20px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 6 }}>New Want · Step 3 of 3</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6e0", marginBottom: 6 }}>Be honest — need or want?</div>
          <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 12 }}>A need solves a real problem. A want improves something that already works fine.</div>

          {[
            { v: "need",       e: "🔧", l: "Need — something is broken or genuinely missing" },
            { v: "need_want",  e: "🟡", l: "Somewhere in between — useful but not urgent" },
            { v: "want",       e: "✨", l: "Want — I just want it" },
            { v: "impulse",    e: "⚡", l: "Pure impulse — saw it and now I can't stop" },
          ].map(o => (
            <button key={o.v} onClick={() => setForm(p => ({...p, type: o.v}))} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
              borderRadius: 8, marginBottom: 7,
              border: `1.5px solid ${form.type === o.v ? "#C4622D" : "#2a2a35"}`,
              background: form.type === o.v ? "#2b1a0f" : "#1a1a1f",
              color: "#e8e6e0", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}><span style={{ fontSize: 16 }}>{o.e}</span><span>{o.l}</span></button>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setStep(2)} style={{ ...btnBase, background: "#1a1a1f", border: "1px solid #E8E4DC", color: "#6b6a72" }}>← Back</button>
            <button onClick={() => form.type && saveWant()} style={{ ...btnBase, flex: 1, background: form.type ? "#C4622D" : "#2a2a35", color: "#fff" }}>Start the 24hrs ⏱</button>
          </div>
        </div>
      )}

      {/* Waiting list */}
      {waiting.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 10 }}>⏱ Waiting ({waiting.length})</div>
          {waiting.map(w => {
            const hrs = hoursElapsed(w.loggedAt);
            const ready = hrs >= 24;
            const pct = Math.min(100, Math.round((hrs / 24) * 100));
            return (
              <div key={w.id} style={{ background: "#1a1a1f", border: `1.5px solid ${ready ? "#2D6A4F" : "#2a2a35"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e6e0" }}>{w.item}</div>
                    {w.cost && <div style={{ fontSize: 12, color: "#6b6a72" }}>${parseFloat(w.cost).toLocaleString()}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: ready ? "#2D6A4F" : "#C4622D", fontWeight: 700 }}>
                      {ready ? "✓ 24hrs done" : `${hrs}h / 24h`}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b6a72" }}>
                      {w.type?.replace(/_/g, " ")} · {EMOTIONS.find(e => e.v === w.emotion)?.e || ""}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {!ready && (
                  <div style={{ height: 4, background: "#16161c", borderRadius: 2, marginBottom: 10 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#C4622D", borderRadius: 2, transition: "width 0.3s ease" }} />
                  </div>
                )}

                {w.why && <div style={{ fontSize: 12, color: "#6b6a72", marginBottom: 6, fontStyle: "italic" }}>"{w.why}"</div>}
                {w.link && (
                  <a href={w.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#2D5A8A", display: "block", margin: "0 0 10px", wordBreak: "break-all" }}>
                    🔗 {w.link}
                  </a>
                )}

                {/* Decision buttons — always visible, emphasized when ready */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => updateWant(w.id, { status: "bought", resolvedAt: new Date().toISOString(), resolvedHrs: hrs })} style={{
                    ...btnBase, padding: "7px 12px", fontSize: 12,
                    background: ready ? "#2D6A4F" : "#16161c",
                    color: ready ? "#fff" : "#6b6a72",
                    border: ready ? "none" : "1px solid #E8E4DC",
                  }}>✓ Bought it</button>
                  <button onClick={() => updateWant(w.id, { status: "skipped", resolvedAt: new Date().toISOString(), resolvedHrs: hrs })} style={{
                    ...btnBase, padding: "7px 12px", fontSize: 12,
                    background: ready ? "#0d2b1e" : "#16161c",
                    color: ready ? "#2D6A4F" : "#6b6a72",
                    border: `1px solid ${ready ? "#2D6A4F44" : "#2a2a35"}`,
                  }}>✗ Decided no</button>
                  <button onClick={() => updateWant(w.id, { status: "forgot", resolvedAt: new Date().toISOString(), resolvedHrs: hrs })} style={{
                    ...btnBase, padding: "7px 12px", fontSize: 12,
                    background: "#16161c", color: "#6b6a72", border: "1px solid #E8E4DC",
                  }}>🤷 Forgot about it</button>
                  <button onClick={() => deleteWant(w.id)} style={{
                    ...btnBase, padding: "7px 10px", fontSize: 12,
                    background: "transparent", color: "#6b6a72", border: "1px solid #E8E4DC", marginLeft: "auto",
                  }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolved list */}
      {resolved.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6a72", marginBottom: 10 }}>📋 Resolved ({resolved.length})</div>
          {resolved.slice(0, 10).map(w => {
            const icon = w.status === "bought" ? "🛒" : w.status === "skipped" ? "✗" : "🤷";
            const color = w.status === "bought" ? "#C4622D" : w.status === "skipped" ? "#2D6A4F" : "#6b6a72";
            return (
              <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#1a1a1f", border: "1px solid #E8E4DC", borderRadius: 8, marginBottom: 5 }}>
                <div>
                  <span style={{ fontSize: 13, color: "#e8e6e0" }}>{icon} {w.item}</span>
                  {w.cost && <span style={{ fontSize: 11, color: "#6b6a72", marginLeft: 8 }}>${parseFloat(w.cost).toLocaleString()}</span>}
                  {w.resolvedHrs !== undefined && (
                    <span style={{ fontSize: 11, color: "#6b6a72", marginLeft: 8 }}>
                      {w.status === "forgot" ? "forgotten" : `decided at ${w.resolvedHrs}h`}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color, fontWeight: 700 }}>{w.status}</span>
              </div>
            );
          })}
        </div>
      )}

      {wants.length === 0 && step === 0 && (
        <div style={{ textAlign: "center", padding: "24px", color: "#6b6a72", fontSize: 13, border: "1px dashed #E8E4DC", borderRadius: 10 }}>
          Nothing logged yet. Next time you feel the urge to buy something — log it here first.
        </div>
      )}
    </div>
  );
}

export default BudgetTool;
