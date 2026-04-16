import type { BudgetBlob, YNABCategoryMapping } from "@/lib/blob";
import { suggestRole } from "@/lib/suggestRole";

const HIDDEN_GROUP_NAMES = new Set(["internal master category", "credit card payments"]);

export interface YNABCategoryRow {
  id: string;
  name: string;
  hidden: boolean;
  deleted: boolean;
}

export interface YNABCategoryGroupRow {
  id: string;
  name: string;
  hidden: boolean;
  categories: YNABCategoryRow[];
}

/** Same rules as iOS `BudgetStore.mergeYNABCategoryMappings`. */
export function mergeCategoryMappingsFromGroups(
  blob: BudgetBlob,
  groups: YNABCategoryGroupRow[]
): YNABCategoryMapping[] {
  const autoIds = new Set(blob.ynabAutoSuggestGroupIds ?? []);
  const existing = new Map(blob.ynabCategoryMappings.map((m) => [m.ynabCategoryID, m]));
  const next: YNABCategoryMapping[] = [];

  for (const g of groups) {
    if (g.hidden || HIDDEN_GROUP_NAMES.has(g.name.trim().toLowerCase())) continue;
    for (const c of g.categories) {
      if (c.hidden || c.deleted) continue;
      const prior = existing.get(c.id);
      if (prior) {
        const roleRaw = autoIds.has(g.id)
          ? suggestRole(c.name, g.name)
          : prior.roleRaw;
        next.push({
          ...prior,
          ynabCategoryName: c.name,
          ynabGroupName: g.name,
          ynabGroupId: g.id,
          roleRaw,
        });
      } else {
        next.push({
          ynabCategoryID: c.id,
          ynabCategoryName: c.name,
          ynabGroupName: g.name,
          ynabGroupId: g.id,
          roleRaw: suggestRole(c.name, g.name),
          dueDay: 0,
        });
      }
    }
  }

  next.sort((a, b) => {
    const g = a.ynabGroupName.localeCompare(b.ynabGroupName, undefined, { sensitivity: "base" });
    if (g !== 0) return g;
    return a.ynabCategoryName.localeCompare(b.ynabCategoryName, undefined, { sensitivity: "base" });
  });
  return next;
}

export function groupMappingsForDisplay(mappings: YNABCategoryMapping[]): {
  groupId: string;
  groupName: string;
  rows: YNABCategoryMapping[];
}[] {
  const byKey = new Map<string, YNABCategoryMapping[]>();
  for (const m of mappings) {
    const key = m.ynabGroupId?.trim() ? m.ynabGroupId : `name:${m.ynabGroupName}`;
    const list = byKey.get(key) ?? [];
    list.push(m);
    byKey.set(key, list);
  }
  const out = [...byKey.entries()].map(([key, rows]) => {
    const sorted = [...rows].sort((a, b) =>
      a.ynabCategoryName.localeCompare(b.ynabCategoryName, undefined, { sensitivity: "base" })
    );
    const groupName = sorted[0]?.ynabGroupName ?? "";
    const groupId = sorted[0]?.ynabGroupId?.trim() ?? (key.startsWith("name:") ? "" : key);
    return { groupId, groupName, rows: sorted };
  });
  out.sort((a, b) =>
    a.groupName.localeCompare(b.groupName, undefined, { sensitivity: "base" })
  );
  return out;
}
