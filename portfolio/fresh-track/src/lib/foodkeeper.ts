import { FoodKeeperEntry, StorageLocation } from "./types";
import data from "@/data/foodkeeper.json";

const entries: FoodKeeperEntry[] = data as FoodKeeperEntry[];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function searchFoods(query: string, limit: number = 5): FoodKeeperEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = entries.map((entry) => {
    const name = normalize(entry.name);
    let score = 0;

    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 60;
    else {
      const words = name.split(" ");
      const matchingWord = words.some((w) => w.startsWith(q));
      if (matchingWord) score = 50;
      else {
        const dist = levenshtein(q, name.slice(0, q.length + 2));
        if (dist <= 2) score = 30 - dist * 5;
      }
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

export function getShelfLifeDays(
  entry: FoodKeeperEntry,
  storage: StorageLocation
): number {
  if (storage === "freezer") {
    return entry.freezerMonthsMax * 30;
  }
  return entry.fridgeDaysMax;
}

export function getAllCategories(): string[] {
  const cats = new Set(entries.map((e) => e.category));
  return Array.from(cats).sort();
}

export function getByCategory(category: string): FoodKeeperEntry[] {
  return entries.filter((e) => e.category === category);
}
