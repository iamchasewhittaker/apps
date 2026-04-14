import React, { useState, useEffect } from "react";
import { T, loadYnabToken, saveYnabToken, fmtDollars } from "../theme";
import { fetchBudgets, fetchCategories, fetchMonth, fetchTransactions, updateCategoryBudgeted } from "../engines/YNABClient";
import { buildBalances, safeToSpend, safePerDay, safePerWeek, totalRequired, totalFunded, daysRemainingInMonth, expectedIncomeThisMonth, incomeGap, grossAnnualNeeded, spendingYesterday, spendingThisWeek, spendingThisMonth } from "../engines/MetricsEngine";
import { buildTimeline } from "../engines/CashFlowEngine";

// ── SNAKE_CASE → CAMELCASE MAPPERS ──────────────────────────────────────────
// YNAB API returns snake_case; MetricsEngine expects camelCase

function mapCategory(cat) {
  return {
    id: cat.id,
    name: cat.name,
    budgeted: cat.budgeted,
    activity: cat.activity,
    balance: cat.balance,
    hidden: cat.hidden,
    deleted: cat.deleted,
    goalTarget: cat.goal_target ?? null,
    goalType: cat.goal_type ?? null,
    goalPercentageComplete: cat.goal_percentage_complete ?? null,
  };
}

function mapTransaction(t) {
  return {
    id: t.id,
    date: t.date,
    amount: t.amount,
    deleted: t.deleted,
    transferAccountId: t.transfer_account_id ?? null,
    payeeName: t.payee_name ?? "",
    categoryId: t.category_id ?? null,
  };
}

// ── SUGGEST ROLE (ported from iOS CategorySetupView.swift:183-231) ──────────

function suggestRole(categoryName, groupName) {
  const combined = (categoryName + " " + groupName).toLowerCase();
  const groupOnly = groupName.toLowerCase();

  const ignoreGroups = ["saving", "savings", "goal", "goals", "investment", "next month", "rainy day"];
  const mortgageGroups = ["mortgage", "housing"];
  const billGroups = ["bill", "bills", "utilities", "utility", "subscription", "subscriptions", "insurance", "debt", "loan", "giving", "tithe", "tithes", "donation", "donations", "fixed"];
  const essentialGroups = ["grocery", "groceries", "health", "medical", "healthcare", "transportation", "transit", "essential", "everyday", "needs", "kids", "children"];
  const flexibleGroups = ["fun", "entertainment", "dining", "eating", "restaurant", "flexible", "discretionary", "gifts", "celebrations", "holiday", "holidays", "wants", "personal", "lifestyle", "career", "development"];

  if (ignoreGroups.some(k => groupOnly.includes(k))) return "ignore";
  if (mortgageGroups.some(k => groupOnly.includes(k))) return "mortgage";
  if (billGroups.some(k => groupOnly.includes(k))) return "bill";
  if (essentialGroups.some(k => groupOnly.includes(k))) return "essential";
  if (flexibleGroups.some(k => groupOnly.includes(k))) return "flexible";

  const mortgageKW = ["mortgage", "hoa", "home loan", "property tax"];
  const billKW = ["electric", "gas", "water", "internet", "phone", "cable", "insurance", "subscription", "netflix", "spotify", "hulu", "streaming", "car payment", "loan", "debt", "wifi", "cellular", "broadband", "amazon prime", "vivint", "utility", "utilities", "tithe", "tithing", "offering", "donation", "giving"];
  const essentialKW = ["groceries", "grocery", "food", "medical", "health", "prescription", "medication", "fuel", "transportation", "transit", "clothing", "household", "childcare", "toiletries", "personal care", "maintenance", "repair", "pharmacy", "doctor", "dentist", "dental", "vision", "baby", "pet"];
  const flexibleKW = ["dining", "restaurant", "eating out", "entertainment", "shopping", "hobbies", "vacation", "travel", "fun", "gifts", "hair", "gym", "fitness", "coffee", "bars", "games", "sports", "birthday", "christmas", "holiday", "books", "media"];

  if (mortgageKW.some(k => combined.includes(k))) return "mortgage";
  if (billKW.some(k => combined.includes(k))) return "bill";
  if (essentialKW.some(k => combined.includes(k))) return "essential";
  if (flexibleKW.some(k => combined.includes(k))) return "flexible";
  return "ignore";
}

// ── SHARED STYLES ───────────────────────────────────────────────────────────

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  btn: { width: "100%", padding: 14, borderRadius: 12, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  btnOutline: { width: "100%", padding: 12, borderRadius: 12, background: "transparent", border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 15, outline: "none", boxSizing: "border-box" },
  select: { padding: "8px 10px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, outline: "none" },
  label: { fontSize: 12, color: T.muted, marginBottom: 6, display: "block" },
  error: { fontSize: 12, color: T.red, marginTop: 8 },
  stepHeader: { fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 },
  stepSub: { fontSize: 13, color: T.muted, marginBottom: 20 },
  chip: { flex: 1, textAlign: "center", padding: "12px 8px", background: T.surfaceHigh, borderRadius: 10 },
};

// ── PROGRESS BAR ────────────────────────────────────────────────────────────

function ProgressBar({ fraction, color }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: T.surfaceHigh, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, fraction * 100))}%`, background: color, borderRadius: 3, transition: "width 0.3s" }} />
    </div>
  );
}

// ── SETUP STEP 1: TOKEN ─────────────────────────────────────────────────────

function TokenStep({ onNext }) {
  const [token, setToken] = useState(loadYnabToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError("");
    try {
      const budgets = await fetchBudgets(token.trim());
      saveYnabToken(token.trim());
      onNext(token.trim(), budgets);
    } catch (e) {
      setError(e.message || "Could not verify token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={S.stepHeader}>Connect YNAB</div>
      <div style={S.stepSub}>Paste your YNAB personal access token to get started.</div>
      <label style={S.label}>Personal Access Token</label>
      <input style={{ ...S.input, marginBottom: 12, fontFamily: "monospace", fontSize: 13 }} value={token} onChange={e => setToken(e.target.value)} placeholder="Paste token here" spellCheck="false" />
      <button style={{ ...S.btn, ...(loading || !token.trim() ? S.btnDisabled : {}) }} disabled={loading || !token.trim()} onClick={verify}>
        {loading ? "Verifying\u2026" : "Verify & Continue"}
      </button>
      {error && <div style={S.error}>{error}</div>}
    </div>
  );
}

// ── SETUP STEP 2: BUDGET PICKER ─────────────────────────────────────────────

function BudgetStep({ budgets, token, blob, setBlob, onNext }) {
  const [selected, setSelected] = useState(blob.preferences.activeBudgetID || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = async () => {
    const budget = budgets.find(b => b.id === selected);
    if (!budget) return;
    setLoading(true);
    setError("");
    try {
      const groups = await fetchCategories(token, selected);
      setBlob(prev => ({ ...prev, preferences: { ...prev.preferences, activeBudgetID: budget.id, activeBudgetName: budget.name } }));
      onNext(groups);
    } catch (e) {
      setError(e.message || "Could not fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={S.stepHeader}>Pick a Budget</div>
      <div style={S.stepSub}>Select which YNAB budget to track.</div>
      {budgets.map(b => (
        <div key={b.id} onClick={() => setSelected(b.id)} style={{
          ...S.card, cursor: "pointer", marginBottom: 8,
          border: selected === b.id ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
        }}>
          <div style={{ fontWeight: 600, color: T.text }}>{b.name}</div>
        </div>
      ))}
      <button style={{ ...S.btn, marginTop: 8, ...(loading || !selected ? S.btnDisabled : {}) }} disabled={loading || !selected} onClick={pick}>
        {loading ? "Loading categories\u2026" : "Use This Budget"}
      </button>
      {error && <div style={S.error}>{error}</div>}
    </div>
  );
}

// ── SETUP STEP 3: CATEGORY ROLES ────────────────────────────────────────────

const HIDDEN_GROUPS = ["internal master category", "credit card payments"];
const ROLE_OPTIONS = [
  { value: "mortgage", label: "Mortgage / Housing" },
  { value: "bill", label: "Fixed Bill" },
  { value: "essential", label: "Essential" },
  { value: "flexible", label: "Flexible" },
  { value: "ignore", label: "Ignore" },
];

function CategoryStep({ groups, blob, setBlob, onNext }) {
  const existingByID = {};
  for (const m of blob.categoryMappings) existingByID[m.ynabCategoryID] = m;

  const visibleGroups = groups.filter(g => !g.hidden && !HIDDEN_GROUPS.includes(g.name.toLowerCase()));

  const initRoles = {};
  const initDays = {};
  for (const group of visibleGroups) {
    for (const cat of (group.categories || []).filter(c => !c.hidden && !c.deleted)) {
      initRoles[cat.id] = existingByID[cat.id]?.roleRaw || suggestRole(cat.name, group.name);
      initDays[cat.id] = existingByID[cat.id]?.dueDay || 0;
    }
  }

  const [roles, setRoles] = useState(initRoles);
  const [dueDays, setDueDays] = useState(initDays);
  const [collapsed, setCollapsed] = useState({});

  const toggleGroup = (id) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const save = () => {
    const mappings = [];
    for (const group of visibleGroups) {
      for (const cat of (group.categories || []).filter(c => !c.hidden && !c.deleted)) {
        mappings.push({
          ynabCategoryID: cat.id,
          ynabCategoryName: cat.name,
          ynabGroupName: group.name,
          roleRaw: roles[cat.id] || "ignore",
          dueDay: dueDays[cat.id] || 0,
        });
      }
    }
    setBlob(prev => ({ ...prev, categoryMappings: mappings }));
    onNext();
  };

  const showDueDay = (role) => role === "mortgage" || role === "bill" || role === "essential";

  return (
    <div>
      <div style={S.stepHeader}>Assign Category Roles</div>
      <div style={S.stepSub}>Tell Clarity how to treat each YNAB category.</div>
      {visibleGroups.map(group => {
        const cats = (group.categories || []).filter(c => !c.hidden && !c.deleted);
        if (cats.length === 0) return null;
        const isCollapsed = collapsed[group.id];
        return (
          <div key={group.id} style={{ marginBottom: 12 }}>
            <div onClick={() => toggleGroup(group.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "8px 0" }}>
              <span style={{ fontSize: 12, color: T.muted }}>{isCollapsed ? "\u25B6" : "\u25BC"}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{group.name}</span>
              <span style={{ fontSize: 12, color: T.muted }}>({cats.length})</span>
            </div>
            {!isCollapsed && cats.map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0 6px 16px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ flex: 1, fontSize: 13, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</div>
                <select value={roles[cat.id] || "ignore"} onChange={e => setRoles(prev => ({ ...prev, [cat.id]: e.target.value }))} style={S.select}>
                  {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {showDueDay(roles[cat.id]) && (
                  <select value={dueDays[cat.id] || 0} onChange={e => setDueDays(prev => ({ ...prev, [cat.id]: parseInt(e.target.value) }))} style={{ ...S.select, width: 60 }}>
                    <option value={0}>Auto</option>
                    {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        );
      })}
      <button style={{ ...S.btn, marginTop: 8 }} onClick={save}>Save & Continue</button>
    </div>
  );
}

// ── SETUP STEP 4: INCOME SOURCES ────────────────────────────────────────────

const FREQ_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "semimonthly", label: "Twice a month" },
  { value: "biweekly", label: "Every two weeks" },
];

function IncomeStep({ blob, setBlob }) {
  const [sources, setSources] = useState(blob.incomeSources.length > 0 ? blob.incomeSources : []);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [freq, setFreq] = useState("biweekly");
  const [nextDate, setNextDate] = useState("");
  const [secondDay, setSecondDay] = useState(20);
  const [editing, setEditing] = useState(null);

  const addOrUpdate = () => {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!name.trim() || isNaN(cents) || cents <= 0 || !nextDate) return;

    const entry = {
      id: editing || crypto.randomUUID(),
      name: name.trim(),
      amountCents: cents,
      frequencyRaw: freq,
      nextPayDate: nextDate,
      secondPayDay: freq === "semimonthly" ? secondDay : 0,
      sortOrder: editing ? sources.findIndex(s => s.id === editing) : sources.length,
    };

    if (editing) {
      setSources(prev => prev.map(s => s.id === editing ? entry : s));
      setEditing(null);
    } else {
      setSources(prev => [...prev, entry]);
    }
    setName("");
    setAmount("");
    setFreq("biweekly");
    setNextDate("");
    setSecondDay(20);
  };

  const edit = (source) => {
    setEditing(source.id);
    setName(source.name);
    setAmount((source.amountCents / 100).toString());
    setFreq(source.frequencyRaw);
    setNextDate(source.nextPayDate);
    setSecondDay(source.secondPayDay || 20);
  };

  const remove = (id) => setSources(prev => prev.filter(s => s.id !== id));

  const finish = () => {
    setBlob(prev => ({
      ...prev,
      incomeSources: sources,
      preferences: { ...prev.preferences, setupComplete: true },
    }));
  };

  return (
    <div>
      <div style={S.stepHeader}>Income Sources</div>
      <div style={S.stepSub}>Add your paychecks so Clarity can calculate income gaps.</div>

      {sources.map(s => (
        <div key={s.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{fmtDollars(s.amountCents / 100)} &middot; {FREQ_OPTIONS.find(f => f.value === s.frequencyRaw)?.label}</div>
          </div>
          <button onClick={() => edit(s)} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", padding: 4 }}>Edit</button>
          <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", color: T.red, fontSize: 15, cursor: "pointer", padding: 4 }}>&times;</button>
        </div>
      ))}

      <div style={{ ...S.card, marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 10 }}>{editing ? "Edit Income" : "Add Income"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input style={S.input} placeholder="Name (e.g. Paycheck)" value={name} onChange={e => setName(e.target.value)} />
          <input style={S.input} placeholder="Amount ($)" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
          <select style={{ ...S.select, width: "100%" }} value={freq} onChange={e => setFreq(e.target.value)}>
            {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input style={S.input} type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} />
          {freq === "semimonthly" && (
            <div>
              <label style={S.label}>Second pay day of month</label>
              <input style={{ ...S.input, width: 80 }} type="number" min="1" max="31" value={secondDay} onChange={e => setSecondDay(parseInt(e.target.value) || 20)} />
            </div>
          )}
          <button style={{ ...S.btn, ...(!name.trim() || !amount || !nextDate ? S.btnDisabled : {}) }} disabled={!name.trim() || !amount || !nextDate} onClick={addOrUpdate}>
            {editing ? "Update" : "Add"}
          </button>
          {editing && <button style={S.btnOutline} onClick={() => { setEditing(null); setName(""); setAmount(""); setFreq("biweekly"); setNextDate(""); }}>Cancel</button>}
        </div>
      </div>

      <button style={{ ...S.btn, marginTop: 12 }} onClick={finish}>
        {sources.length > 0 ? "Done" : "Skip for Now"}
      </button>
    </div>
  );
}

// ── SETUP FLOW ──────────────────────────────────────────────────────────────

function SetupFlow({ blob, setBlob }) {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [groups, setGroups] = useState([]);

  const stepLabels = ["Token", "Budget", "Categories", "Income"];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {stepLabels.map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, background: i + 1 <= step ? T.accent : T.border, marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: i + 1 <= step ? T.accent : T.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {step === 1 && <TokenStep onNext={(tok, buds) => { setToken(tok); setBudgets(buds); setStep(2); }} />}
      {step === 2 && <BudgetStep budgets={budgets} token={token} blob={blob} setBlob={setBlob} onNext={(grps) => { setGroups(grps); setStep(3); }} />}
      {step === 3 && <CategoryStep groups={groups} blob={blob} setBlob={setBlob} onNext={() => setStep(4)} />}
      {step === 4 && <IncomeStep blob={blob} setBlob={setBlob} />}
    </div>
  );
}

// ── DASHBOARD: SAFE TO SPEND ────────────────────────────────────────────────

function SafeToSpendSection({ balances, tbb }) {
  const days = daysRemainingInMonth();
  const daily = safePerDay(balances, days, tbb);
  const weekly = safePerWeek(balances, days, tbb);
  const monthly = safeToSpend(balances, tbb);
  const color = monthly > 0 ? T.green : T.red;

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Safe to Spend</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ label: "Today", val: daily }, { label: "This Week", val: weekly }, { label: "This Month", val: monthly }].map(c => (
          <div key={c.label} style={S.chip}>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{fmtDollars(c.val)}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD: BUDGET HEALTH ────────────────────────────────────────────────

function BudgetHealthSection({ balances }) {
  const funded = totalFunded(balances);
  const required = totalRequired(balances);
  const fraction = required > 0 ? funded / required : 1;
  const pct = Math.round(fraction * 100);
  const color = pct >= 100 ? T.green : pct >= 50 ? T.yellow : T.red;

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Budget Health</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted, marginBottom: 6 }}>
        <span>Funded: {fmtDollars(funded)}</span>
        <span>Required: {fmtDollars(required)}</span>
      </div>
      <ProgressBar fraction={fraction} color={color} />
      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color, marginTop: 6 }}>{pct}% covered</div>
    </div>
  );
}

// ── DASHBOARD: BILLS PLANNER ────────────────────────────────────────────────

function BillsSection({ balances, onFund }) {
  const bills = balances.filter(b => b.role === "mortgage" || b.role === "bill" || b.role === "essential");
  const needsAttention = bills.filter(b => !b.isCovered && b.coverageFraction < 0.5);
  const partial = bills.filter(b => !b.isCovered && b.coverageFraction >= 0.5);
  const covered = bills.filter(b => b.isCovered);
  const [showCovered, setShowCovered] = useState(false);

  const renderRow = (b) => (
    <div key={b.ynabCategoryID} style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{b.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {b.shortfall > 0 && (
            <button onClick={() => onFund(b)} style={{ fontSize: 12, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>Fund</button>
          )}
          <span style={{ fontSize: 12, color: b.isCovered ? T.green : b.coverageFraction >= 0.5 ? T.yellow : T.red, fontWeight: 600 }}>
            {b.isCovered ? "Covered" : b.shortfall > 0 ? `-${fmtDollars(b.shortfall)}` : "Partial"}
          </span>
        </div>
      </div>
      <ProgressBar fraction={b.coverageFraction} color={b.isCovered ? T.green : b.coverageFraction >= 0.5 ? T.yellow : T.red} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginTop: 3 }}>
        <span>{fmtDollars(Math.max(0, b.available))} funded</span>
        <span>{fmtDollars(b.monthlyTarget)} needed</span>
      </div>
    </div>
  );

  const renderGroup = (label, items, color) => {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 4 }}>{label} ({items.length})</div>
        {items.map(renderRow)}
      </div>
    );
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Bills & Essentials</div>
      {renderGroup("Needs Attention", needsAttention, T.red)}
      {renderGroup("Partially Funded", partial, T.yellow)}
      {covered.length > 0 && (
        <div>
          <div onClick={() => setShowCovered(!showCovered)} style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: T.green, marginBottom: 4 }}>
            {showCovered ? "\u25BC" : "\u25B6"} Fully Covered ({covered.length})
          </div>
          {showCovered && covered.map(renderRow)}
        </div>
      )}
      {bills.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No bills mapped yet.</div>}
    </div>
  );
}

// ── DASHBOARD: INCOME GAP ───────────────────────────────────────────────────

function IncomeGapSection({ balances, blob }) {
  const now = new Date();
  const expected = expectedIncomeThisMonth(blob.incomeSources, now);
  const required = totalRequired(balances);
  const gap = incomeGap(balances, blob.incomeSources, now);
  const surplus = expected > required ? expected - required : 0;
  const grossNeeded = grossAnnualNeeded(required, blob.preferences.taxRate || 0.28);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Income Gap</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: T.muted }}>Expected this month</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{fmtDollars(expected)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: T.muted }}>Required</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{fmtDollars(required)}</div>
        </div>
      </div>
      {gap > 0 ? (
        <div style={{ background: T.redLight, borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.red }}>Gap: {fmtDollars(gap)}</div>
          <div style={{ fontSize: 11, color: T.muted }}>Income falls short of obligations this month</div>
        </div>
      ) : (
        <div style={{ background: T.greenLight, borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.green }}>Surplus: {fmtDollars(surplus)}</div>
          <div style={{ fontSize: 11, color: T.muted }}>Income covers obligations this month</div>
        </div>
      )}
      <div style={{ fontSize: 12, color: T.muted }}>
        Gross annual salary needed: <span style={{ color: T.text, fontWeight: 600 }}>{fmtDollars(grossNeeded)}</span>
        <span style={{ fontSize: 11 }}> (at {Math.round((blob.preferences.taxRate || 0.28) * 100)}% tax rate)</span>
      </div>
    </div>
  );
}

// ── DASHBOARD: CASH FLOW TIMELINE ───────────────────────────────────────────

function CashFlowSection({ blob, balances }) {
  const events = buildTimeline(blob.incomeSources, balances, new Date());
  const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Cash Flow Timeline</div>
      {events.length === 0 && <div style={{ fontSize: 13, color: T.muted }}>No events this month.</div>}
      {events.map((ev, i) => {
        if (ev.kind === "todayMarker") {
          return (
            <div key={`today-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <div style={{ flex: 1, height: 2, background: T.accent }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>TODAY</div>
              <div style={{ flex: 1, height: 2, background: T.accent }} />
            </div>
          );
        }
        if (ev.kind === "mortgageCoveredMarker") {
          return (
            <div key={`mc-${i}`} style={{ background: T.accentLight, borderRadius: 6, padding: "6px 10px", margin: "4px 0", fontSize: 12, color: T.accent, fontWeight: 600 }}>
              {ev.label}
            </div>
          );
        }
        const isPaycheck = ev.kind === "paycheck";
        return (
          <div key={`${ev.kind}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, width: 50, flexShrink: 0 }}>{fmtDate(ev.date)}</div>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: isPaycheck ? T.green : ev.isCovered ? T.green : T.yellow, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.label}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isPaycheck ? T.green : T.text, flexShrink: 0 }}>
              {isPaycheck ? "+" : ""}{fmtDollars(ev.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── DASHBOARD: SPENDING ─────────────────────────────────────────────────────

function SpendingSection({ transactions }) {
  const yd = spendingYesterday(transactions);
  const wk = spendingThisWeek(transactions);
  const mo = spendingThisMonth(transactions);

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Spending</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ label: "Yesterday", val: yd }, { label: "This Week", val: wk }, { label: "This Month", val: mo }].map(c => (
          <div key={c.label} style={S.chip}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.red }}>{fmtDollars(c.val)}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FUND CATEGORY MODAL ─────────────────────────────────────────────────────

function FundModal({ target, token, budgetID, onDone, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    try {
      const newBudgetedMilliunits = Math.round((target.available + target.shortfall) * 1000);
      await updateCategoryBudgeted(token, budgetID, new Date(), target.ynabCategoryID, newBudgetedMilliunits);
      onDone();
    } catch (e) {
      setError(e.message || "Failed to update YNAB.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Fund Category</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>
          Assign {fmtDollars(target.shortfall)} to <strong style={{ color: T.text }}>{target.name}</strong> in YNAB?
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted, marginBottom: 4 }}>
          <span>Current: {fmtDollars(Math.max(0, target.available))}</span>
          <span>Needed: {fmtDollars(target.monthlyTarget)}</span>
        </div>
        <ProgressBar fraction={target.coverageFraction} color={T.yellow} />
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={onCancel} disabled={loading}>Cancel</button>
          <button style={{ ...S.btn, flex: 1, ...(loading ? S.btnDisabled : {}) }} disabled={loading} onClick={confirm}>
            {loading ? "Assigning\u2026" : `Assign ${fmtDollars(target.shortfall)}`}
          </button>
        </div>
        {error && <div style={S.error}>{error}</div>}
      </div>
    </div>
  );
}

// ── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard({ blob, setBlob }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tbb, setTbb] = useState(0);
  const [fundTarget, setFundTarget] = useState(null);

  const token = loadYnabToken();
  const budgetID = blob.preferences.activeBudgetID;

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const [monthData, txns] = await Promise.all([
        fetchMonth(token, budgetID, new Date()),
        fetchTransactions(token, budgetID, monthStart),
      ]);
      const mapped = (monthData.categories || []).map(mapCategory);
      const mappedTxns = (txns || []).map(mapTransaction);
      setBalances(buildBalances(mapped, blob.categoryMappings));
      setTransactions(mappedTxns);
      setTbb((monthData.to_be_budgeted || 0) / 1000);
    } catch (e) {
      setError(e.message || "Failed to load YNAB data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <div style={{ color: T.muted, fontSize: 14, marginTop: 40 }}>Loading YNAB data&hellip;</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ background: T.redLight, borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: T.red, fontWeight: 600, marginBottom: 8 }}>{error}</div>
          {error.includes("Token") && <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Update your token in Settings.</div>}
          <button style={{ ...S.btn, width: "auto", padding: "10px 24px" }} onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{blob.preferences.activeBudgetName}</div>
        <button onClick={loadData} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer" }}>Refresh</button>
      </div>

      <SafeToSpendSection balances={balances} tbb={tbb} />
      <BudgetHealthSection balances={balances} />
      <BillsSection balances={balances} onFund={setFundTarget} />
      <IncomeGapSection balances={balances} blob={blob} />
      <CashFlowSection blob={blob} balances={balances} />
      <SpendingSection transactions={transactions} />

      {fundTarget && (
        <FundModal
          target={fundTarget}
          token={token}
          budgetID={budgetID}
          onCancel={() => setFundTarget(null)}
          onDone={() => { setFundTarget(null); loadData(); }}
        />
      )}
    </div>
  );
}

// ── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function YnabTab({ blob, setBlob }) {
  if (!blob.preferences.setupComplete) {
    return <SetupFlow blob={blob} setBlob={setBlob} />;
  }
  return <Dashboard blob={blob} setBlob={setBlob} />;
}
