/** Mirrors iOS `BudgetBlob` + `_syncAt` for Supabase merge. */

import { STORE_KEY } from "./constants";

export interface BudgetScenario {
  id: string;
  label: string;
  monthlyIncomeCents: number;
  fixedNeedsCents: number;
  flexibleNeedsEstimateCents: number;
  wantsBudgetCents: number;
  wantsSpentCents: number;
}

export interface YNABCategoryMapping {
  ynabCategoryID: string;
  ynabCategoryName: string;
  ynabGroupName: string;
  /** YNAB category group id; omitted in legacy blobs. */
  ynabGroupId?: string;
  roleRaw: string;
  dueDay: number;
}

export interface YNABIncomeSource {
  id: string;
  name: string;
  amountCents: number;
  frequencyRaw: string;
  /** ISO date or Swift reference date number — prefer ISO strings from web. */
  nextPayDate: string;
  secondPayDay: number;
  sortOrder: number;
}

export interface BudgetBlob {
  baseline: BudgetScenario;
  stretch: BudgetScenario;
  ynabBudgetId?: string | null;
  ynabCategoryMappings: YNABCategoryMapping[];
  ynabIncomeSources: YNABIncomeSource[];
  ynabAutoSuggestGroupIds?: string[];
  _syncAt?: number;
}

export function defaultBlob(): BudgetBlob {
  return {
    baseline: {
      id: "baseline",
      label: "Baseline",
      monthlyIncomeCents: 500000,
      fixedNeedsCents: 280000,
      flexibleNeedsEstimateCents: 90000,
      wantsBudgetCents: 40000,
      wantsSpentCents: 0,
    },
    stretch: {
      id: "stretch",
      label: "Stretch",
      monthlyIncomeCents: 500000,
      fixedNeedsCents: 260000,
      flexibleNeedsEstimateCents: 85000,
      wantsBudgetCents: 55000,
      wantsSpentCents: 0,
    },
    ynabBudgetId: undefined,
    ynabCategoryMappings: [],
    ynabIncomeSources: [],
    ynabAutoSuggestGroupIds: [],
  };
}

export function loadLocalBlob(): BudgetBlob {
  if (typeof window === "undefined") return defaultBlob();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return defaultBlob();
    return mergeBlob(JSON.parse(raw));
  } catch {
    return defaultBlob();
  }
}

export function saveLocalBlob(b: BudgetBlob): BudgetBlob {
  const next = { ...b, _syncAt: Date.now() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  }
  return next;
}

export function mergeBlob(raw: unknown): BudgetBlob {
  const d = defaultBlob();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    ...d,
    ...o,
    baseline: { ...d.baseline, ...(o.baseline as object) } as BudgetScenario,
    stretch: { ...d.stretch, ...(o.stretch as object) } as BudgetScenario,
    ynabCategoryMappings: Array.isArray(o.ynabCategoryMappings)
      ? (o.ynabCategoryMappings as YNABCategoryMapping[])
      : [],
    ynabIncomeSources: Array.isArray(o.ynabIncomeSources)
      ? (o.ynabIncomeSources as YNABIncomeSource[])
      : [],
    ynabAutoSuggestGroupIds: Array.isArray(o.ynabAutoSuggestGroupIds)
      ? (o.ynabAutoSuggestGroupIds as string[])
      : [],
  };
}
