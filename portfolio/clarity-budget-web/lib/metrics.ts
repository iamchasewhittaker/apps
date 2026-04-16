/** Ported from Funded `MetricsEngine.js` — dollars / milliunits as noted. */

export function buildBalances(
  monthCategories: Array<{
    id: string;
    hidden: boolean;
    deleted: boolean;
    budgeted: number;
    activity: number;
    balance: number;
    goal_target: number | null;
  }>,
  categoryMappings: Array<{ ynabCategoryID: string; roleRaw: string; dueDay?: number }>
) {
  const roleByID: Record<string, (typeof categoryMappings)[0]> = {};
  for (const m of categoryMappings) roleByID[m.ynabCategoryID] = m;

  return monthCategories
    .filter(
      (cat) =>
        !cat.hidden &&
        !cat.deleted &&
        roleByID[cat.id] &&
        roleByID[cat.id].roleRaw !== "ignore"
    )
    .map((cat) => {
      const mapping = roleByID[cat.id];
      const budgetedDollars = cat.budgeted / 1000;
      const goalTargetDollars =
        cat.goal_target != null ? cat.goal_target / 1000 : null;
      const monthlyTarget =
        goalTargetDollars != null ? goalTargetDollars : budgetedDollars;
      const available = cat.balance / 1000;
      const activityDollars = cat.activity / 1000;
      return {
        role: mapping.roleRaw,
        monthlyTarget,
        available,
        activityDollars,
        dueDay: mapping.dueDay || 0,
      };
    });
}

function totalRequired(balances: ReturnType<typeof buildBalances>) {
  return balances
    .filter((b) => b.role === "mortgage" || b.role === "bill" || b.role === "essential")
    .reduce((sum, b) => sum + b.monthlyTarget, 0);
}

function totalFunded(balances: ReturnType<typeof buildBalances>) {
  return balances
    .filter((b) => b.role === "mortgage" || b.role === "bill" || b.role === "essential")
    .reduce((sum, b) => sum + Math.min(b.available, b.monthlyTarget), 0);
}

export function currentShortfall(balances: ReturnType<typeof buildBalances>) {
  return Math.max(0, totalRequired(balances) - totalFunded(balances));
}

export function safeToSpend(
  balances: ReturnType<typeof buildBalances>,
  toBeBudgeted = 0
) {
  const discretionary = balances
    .filter((b) => b.role !== "mortgage" && b.role !== "bill" && b.role !== "essential")
    .reduce((sum, b) => sum + Math.max(0, b.available), 0);
  const tbb = Math.max(0, toBeBudgeted);
  return Math.max(0, discretionary + tbb - currentShortfall(balances));
}

export function daysRemainingInMonth(date = new Date()) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const today = date.getDate();
  return Math.max(1, daysInMonth - today + 1);
}

export function safePerDay(
  balances: ReturnType<typeof buildBalances>,
  daysRemaining: number,
  toBeBudgeted = 0
) {
  if (daysRemaining <= 0) return 0;
  return safeToSpend(balances, toBeBudgeted) / daysRemaining;
}

export function safePerWeek(
  balances: ReturnType<typeof buildBalances>,
  daysRemaining: number,
  toBeBudgeted = 0
) {
  return safePerDay(balances, daysRemaining, toBeBudgeted) * 7;
}
