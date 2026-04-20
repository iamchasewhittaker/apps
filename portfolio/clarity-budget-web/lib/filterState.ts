"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SpendLine } from "./aggregations";

export interface FilterState {
  from?: string;
  to?: string;
  categoryNames?: string[];
  accountIds?: string[];
  payeeQuery?: string;
  amountMin?: number;
  amountMax?: number;
}

export function emptyFilters(): FilterState {
  return {};
}

const PARAM = {
  from: "from",
  to: "to",
  categoryNames: "cat",
  accountIds: "acct",
  payeeQuery: "q",
  amountMin: "min",
  amountMax: "max",
} as const;

function splitList(v: string | null): string[] | undefined {
  if (!v) return undefined;
  const parts = v.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}

function parseNum(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(sp: URLSearchParams): FilterState {
  const f: FilterState = {};
  const from = sp.get(PARAM.from);
  if (from) f.from = from;
  const to = sp.get(PARAM.to);
  if (to) f.to = to;
  const cats = splitList(sp.get(PARAM.categoryNames));
  if (cats) f.categoryNames = cats;
  const accts = splitList(sp.get(PARAM.accountIds));
  if (accts) f.accountIds = accts;
  const q = sp.get(PARAM.payeeQuery);
  if (q) f.payeeQuery = q;
  const min = parseNum(sp.get(PARAM.amountMin));
  if (min != null) f.amountMin = min;
  const max = parseNum(sp.get(PARAM.amountMax));
  if (max != null) f.amountMax = max;
  return f;
}

export function toQueryString(f: FilterState): string {
  const sp = new URLSearchParams();
  if (f.from) sp.set(PARAM.from, f.from);
  if (f.to) sp.set(PARAM.to, f.to);
  if (f.categoryNames?.length) sp.set(PARAM.categoryNames, f.categoryNames.join(","));
  if (f.accountIds?.length) sp.set(PARAM.accountIds, f.accountIds.join(","));
  if (f.payeeQuery) sp.set(PARAM.payeeQuery, f.payeeQuery);
  if (f.amountMin != null) sp.set(PARAM.amountMin, String(f.amountMin));
  if (f.amountMax != null) sp.set(PARAM.amountMax, String(f.amountMax));
  return sp.toString();
}

export function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.from) n++;
  if (f.to) n++;
  if (f.categoryNames?.length) n++;
  if (f.accountIds?.length) n++;
  if (f.payeeQuery) n++;
  if (f.amountMin != null) n++;
  if (f.amountMax != null) n++;
  return n;
}

export function applyFilters(lines: SpendLine[], f: FilterState): SpendLine[] {
  if (!activeFilterCount(f)) return lines;
  const q = f.payeeQuery?.trim().toLowerCase();
  const catSet = f.categoryNames?.length ? new Set(f.categoryNames) : null;
  const acctSet = f.accountIds?.length ? new Set(f.accountIds) : null;

  return lines.filter((l) => {
    if (f.from && l.date < f.from) return false;
    if (f.to && l.date > f.to) return false;
    if (catSet && !catSet.has(l.categoryName)) return false;
    if (acctSet && !acctSet.has(l.accountId)) return false;
    if (q && !l.payeeName.toLowerCase().includes(q)) return false;
    if (f.amountMin != null && Math.abs(l.amountDollars) < f.amountMin) return false;
    if (f.amountMax != null && Math.abs(l.amountDollars) > f.amountMax) return false;
    return true;
  });
}

/** Keeps filter state synced with the URL. Uses replace, not push, to avoid history spam. */
export function useUrlFilterState(): [FilterState, (next: FilterState) => void] {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => parseFilters(sp ?? new URLSearchParams()), [sp]);

  const setFilters = useCallback(
    (next: FilterState) => {
      const qs = toQueryString(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  return [filters, setFilters];
}
