import type { YNABTransaction } from "./ynab";
import type { YNABCategoryMapping } from "./blob";
import type { RoleRaw } from "./suggestRole";
import { T } from "./constants";

/** One spendable line — a plain tx or a single subtransaction from a split parent. */
export interface SpendLine {
  txId: string;
  subId?: string;
  date: string;
  /** Positive = outflow, negative = inflow. Converted from YNAB milliunits. */
  amountDollars: number;
  payeeName: string;
  categoryId: string | null;
  categoryName: string;
  accountId: string;
  accountName: string;
  memo: string | null;
  role?: RoleRaw;
  cleared: YNABTransaction["cleared"];
  approved: boolean;
}

export interface SpendBucket {
  key: string;
  label: string;
  amount: number;
  count: number;
}

const UNCATEGORIZED = "Uncategorized";

function roleFor(categoryId: string | null, roleByCat: Map<string, RoleRaw>): RoleRaw | undefined {
  if (!categoryId) return undefined;
  return roleByCat.get(categoryId);
}

/** Flatten YNAB transactions (including split subtransactions) into line items. */
export function flattenSpendLines(
  txs: YNABTransaction[],
  mappings: YNABCategoryMapping[]
): SpendLine[] {
  const roleByCat = new Map<string, RoleRaw>();
  for (const m of mappings) roleByCat.set(m.ynabCategoryID, m.roleRaw as RoleRaw);

  const out: SpendLine[] = [];
  for (const t of txs) {
    if (t.deleted) continue;
    if (t.subtransactions?.length) {
      for (const s of t.subtransactions) {
        if (s.deleted) continue;
        out.push({
          txId: t.id,
          subId: s.id,
          date: t.date,
          amountDollars: -s.amount / 1000,
          payeeName: t.payee_name ?? "",
          categoryId: s.category_id,
          categoryName: s.category_name || t.category_name || UNCATEGORIZED,
          accountId: t.account_id,
          accountName: t.account_name,
          memo: s.memo ?? t.memo,
          role: roleFor(s.category_id, roleByCat),
          cleared: t.cleared,
          approved: t.approved,
        });
      }
    } else {
      out.push({
        txId: t.id,
        date: t.date,
        amountDollars: -t.amount / 1000,
        payeeName: t.payee_name ?? "",
        categoryId: t.category_id,
        categoryName: t.category_name || UNCATEGORIZED,
        accountId: t.account_id,
        accountName: t.account_name,
        memo: t.memo,
        role: roleFor(t.category_id, roleByCat),
        cleared: t.cleared,
        approved: t.approved,
      });
    }
  }
  return out;
}

export function onlyOutflows(lines: SpendLine[]): SpendLine[] {
  return lines.filter((l) => l.amountDollars > 0);
}

export function totalSpent(lines: SpendLine[]): number {
  return onlyOutflows(lines).reduce((sum, l) => sum + l.amountDollars, 0);
}

export function outflowCount(lines: SpendLine[]): number {
  return onlyOutflows(lines).length;
}

function buildBuckets(
  lines: SpendLine[],
  keyFn: (l: SpendLine) => { key: string; label: string }
): SpendBucket[] {
  const map = new Map<string, SpendBucket>();
  for (const l of onlyOutflows(lines)) {
    const { key, label } = keyFn(l);
    const prev = map.get(key);
    if (prev) {
      prev.amount += l.amountDollars;
      prev.count += 1;
    } else {
      map.set(key, { key, label, amount: l.amountDollars, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export function groupByCategory(lines: SpendLine[]): SpendBucket[] {
  return buildBuckets(lines, (l) => ({
    key: l.categoryName,
    label: l.categoryName,
  }));
}

export function groupByPayee(lines: SpendLine[]): SpendBucket[] {
  return buildBuckets(lines, (l) => ({
    key: l.payeeName || "(no payee)",
    label: l.payeeName || "(no payee)",
  }));
}

export function groupByAccount(lines: SpendLine[]): SpendBucket[] {
  return buildBuckets(lines, (l) => ({
    key: l.accountId,
    label: l.accountName,
  }));
}

/** Monday-noon dates avoid DST boundary surprises; weeks start Sunday to match YNAB. */
function parseYmdNoon(ymd: string): Date {
  return new Date(ymd + "T12:00:00");
}

function startOfWeekSunday(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekLabel(startSun: Date): string {
  const end = new Date(startSun);
  end.setDate(end.getDate() + 6);
  const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const sameMonth = startSun.getMonth() === end.getMonth();
  return sameMonth
    ? `${fmtDay(startSun)}–${end.getDate()}`
    : `${fmtDay(startSun)} – ${fmtDay(end)}`;
}

export function groupByWeek(lines: SpendLine[]): SpendBucket[] {
  return buildBuckets(lines, (l) => {
    const start = startOfWeekSunday(parseYmdNoon(l.date));
    return { key: ymd(start), label: weekLabel(start) };
  });
}

export function dateRangeLabel(lines: SpendLine[]): string {
  if (!lines.length) return "";
  const sorted = [...lines].sort((a, b) => a.date.localeCompare(b.date));
  const from = parseYmdNoon(sorted[0].date);
  const to = parseYmdNoon(sorted[sorted.length - 1].date);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(from)} – ${fmt(to)}`;
}

/** Subtle role chip colors built from the existing theme. */
export function roleColor(role?: RoleRaw): { bg: string; fg: string; label: string } | null {
  switch (role) {
    case "mortgage":
      return { bg: "rgba(79,146,242,0.15)", fg: T.accent, label: "Housing" };
    case "bill":
      return { bg: "rgba(232,187,50,0.18)", fg: T.caution, label: "Bill" };
    case "essential":
      return { bg: "rgba(61,183,122,0.18)", fg: T.safe, label: "Essential" };
    case "flexible":
      return { bg: "rgba(79,146,242,0.15)", fg: T.accent, label: "Flex" };
    case "ignore":
      return null;
    default:
      return null;
  }
}
