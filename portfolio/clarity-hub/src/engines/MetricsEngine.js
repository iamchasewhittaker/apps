// MetricsEngine.js — Pure functions ported from MetricsEngine.swift
// All dollar amounts are in dollars (not cents, not milliunits)

/**
 * Build CategoryBalance array from YNAB month categories + user's role mappings.
 * categoryMappings: [{ ynabCategoryID, ynabCategoryName, ynabGroupName, roleRaw, dueDay }]
 * monthCategories: [{ id, name, budgeted, activity, balance, hidden, deleted, goalTarget, goalType, goalPercentageComplete }]
 *   (amounts in milliunits from YNAB API — divide by 1000 for dollars)
 */
export function buildBalances(monthCategories, categoryMappings) {
  const roleByID = {};
  for (const m of categoryMappings) roleByID[m.ynabCategoryID] = m;

  return monthCategories
    .filter(cat => !cat.hidden && !cat.deleted && roleByID[cat.id] && roleByID[cat.id].roleRaw !== "ignore")
    .map(cat => {
      const mapping = roleByID[cat.id];
      const budgetedDollars = cat.budgeted / 1000;
      const goalTargetDollars = cat.goalTarget != null ? cat.goalTarget / 1000 : null;
      const monthlyTarget = goalTargetDollars != null ? goalTargetDollars : budgetedDollars;
      const available = cat.balance / 1000;
      const activityDollars = cat.activity / 1000;

      const shortfall = Math.max(0, monthlyTarget - Math.max(0, available));
      const isCovered = available >= monthlyTarget || (monthlyTarget > 0 && activityDollars < 0 && available >= 0);
      const coverageFraction = monthlyTarget > 0 ? (isCovered ? 1.0 : Math.min(1.0, Math.max(0, available) / monthlyTarget)) : 1.0;

      return {
        ynabCategoryID: cat.id,
        name: cat.name,
        role: mapping.roleRaw,
        monthlyTarget,
        available,
        activityDollars,
        dueDay: mapping.dueDay || 0,
        shortfall,
        isCovered,
        coverageFraction,
      };
    });
}

export function totalRequired(balances) {
  return balances
    .filter(b => b.role === "mortgage" || b.role === "bill" || b.role === "essential")
    .reduce((sum, b) => sum + b.monthlyTarget, 0);
}

export function totalFunded(balances) {
  return balances
    .filter(b => b.role === "mortgage" || b.role === "bill" || b.role === "essential")
    .reduce((sum, b) => sum + Math.min(b.available, b.monthlyTarget), 0);
}

export function currentShortfall(balances) {
  return Math.max(0, totalRequired(balances) - totalFunded(balances));
}

export function mortgageShortfall(balances) {
  const m = balances.filter(b => b.role === "mortgage");
  const target = m.reduce((s, b) => s + b.monthlyTarget, 0);
  const avail = m.reduce((s, b) => s + b.available, 0);
  return Math.max(0, target - avail);
}

export function mortgageCoveredFraction(balances) {
  const m = balances.filter(b => b.role === "mortgage");
  const target = m.reduce((s, b) => s + b.monthlyTarget, 0);
  if (target <= 0) return 1.0;
  const funded = m.reduce((s, b) => s + Math.min(b.available, b.monthlyTarget), 0);
  return Math.min(1.0, Math.max(0, funded / target));
}

export function billsCoverageFraction(balances) {
  const b = balances.filter(x => x.role === "bill" || x.role === "essential");
  const target = b.reduce((s, x) => s + x.monthlyTarget, 0);
  if (target <= 0) return 1.0;
  const funded = b.reduce((s, x) => s + Math.min(x.available, x.monthlyTarget), 0);
  return Math.min(1.0, Math.max(0, funded / target));
}

export function obligationsCoverageFraction(balances) {
  const slice = balances.filter(b => b.role === "mortgage" || b.role === "bill" || b.role === "essential");
  const target = slice.reduce((s, b) => s + b.monthlyTarget, 0);
  if (target <= 0) return 1.0;
  const funded = slice.reduce((s, b) => s + Math.min(b.available, b.monthlyTarget), 0);
  return Math.min(1.0, Math.max(0, funded / target));
}

export function safeToSpend(balances, toBeBudgeted = 0) {
  const discretionary = balances
    .filter(b => b.role !== "mortgage" && b.role !== "bill" && b.role !== "essential")
    .reduce((sum, b) => sum + Math.max(0, b.available), 0);
  const tbb = Math.max(0, toBeBudgeted);
  return Math.max(0, discretionary + tbb - currentShortfall(balances));
}

export function safePerDay(balances, daysRemaining, toBeBudgeted = 0) {
  if (daysRemaining <= 0) return 0;
  return safeToSpend(balances, toBeBudgeted) / daysRemaining;
}

export function safePerWeek(balances, daysRemaining, toBeBudgeted = 0) {
  return safePerDay(balances, daysRemaining, toBeBudgeted) * 7;
}

// ── Spending from transactions ──

export function outflowSpending(transactions, rangeStart, rangeEndInclusive) {
  let total = 0;
  for (const t of transactions) {
    if (t.deleted || t.transferAccountId) continue;
    const d = new Date(t.date + "T00:00:00");
    if (d >= rangeStart && d <= rangeEndInclusive) {
      const dollars = t.amount / 1000;
      if (dollars < 0) total += -dollars;
    }
  }
  return total;
}

export function spendingYesterday(transactions) {
  const now = new Date();
  const y = new Date(now); y.setDate(y.getDate() - 1);
  y.setHours(0, 0, 0, 0);
  return outflowSpending(transactions, y, y);
}

export function spendingThisWeek(transactions) {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  // Week starts Monday
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - diff);
  return outflowSpending(transactions, weekStart, today);
}

export function spendingThisMonth(transactions) {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return outflowSpending(transactions, monthStart, today);
}

// ── Income ──

export function occurrencesInMonth(source, month) {
  const year = month.getFullYear();
  const mo = month.getMonth();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();
  const monthStart = new Date(year, mo, 1);
  const monthEnd = new Date(year, mo, daysInMonth);

  const freq = source.frequencyRaw;
  const amountDollars = source.amountCents / 100;
  const nextPay = new Date(source.nextPayDate + "T00:00:00");
  const payDay = nextPay.getDate();

  if (freq === "monthly") {
    return [new Date(year, mo, Math.min(payDay, daysInMonth))];
  }
  if (freq === "semimonthly") {
    const d1 = Math.min(payDay, daysInMonth);
    const d2 = Math.min(source.secondPayDay || 20, daysInMonth);
    return [new Date(year, mo, d1), new Date(year, mo, d2)].sort((a, b) => a - b);
  }
  if (freq === "biweekly") {
    let anchor = new Date(nextPay);
    while (anchor > monthStart) anchor.setDate(anchor.getDate() - 14);
    const dates = [];
    let current = new Date(anchor);
    while (current <= monthEnd) {
      if (current >= monthStart) dates.push(new Date(current));
      current.setDate(current.getDate() + 14);
    }
    return dates;
  }
  return [];
}

export function expectedIncomeThisMonth(sources, month) {
  return sources.reduce((total, source) => {
    const count = occurrencesInMonth(source, month).length;
    return total + (source.amountCents / 100) * count;
  }, 0);
}

export function incomeGap(balances, sources, month) {
  return Math.max(0, totalRequired(balances) - expectedIncomeThisMonth(sources, month));
}

export function grossAnnualNeeded(netMonthlyNeeded, taxRate) {
  if (taxRate < 0 || taxRate >= 1.0) return netMonthlyNeeded * 12;
  return (netMonthlyNeeded * 12) / (1 - taxRate);
}

export function daysRemainingInMonth(date = new Date()) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const today = date.getDate();
  return Math.max(1, daysInMonth - today + 1);
}

// ── Underfunded goals ──

export function underfundedGoals(monthCategories, categoryMappings) {
  const roleByID = {};
  for (const m of categoryMappings) roleByID[m.ynabCategoryID] = m;

  return monthCategories
    .filter(cat => {
      if (cat.hidden || cat.deleted) return false;
      const mapping = roleByID[cat.id];
      if (!mapping || mapping.roleRaw === "ignore") return false;
      const target = cat.goalTarget != null ? cat.goalTarget / 1000 : null;
      if (!target || target <= 0) return false;
      const assigned = cat.budgeted / 1000;
      return target - assigned > 0.01;
    })
    .map(cat => {
      const target = cat.goalTarget / 1000;
      const assigned = cat.budgeted / 1000;
      return {
        ynabCategoryID: cat.id,
        categoryName: cat.name,
        goalTarget: target,
        assigned,
        gap: target - assigned,
      };
    })
    .sort((a, b) => b.gap - a.gap);
}
