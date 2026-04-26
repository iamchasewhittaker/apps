import { describe, it, expect } from "vitest";
import { buildPrompt, __TESTING__ } from "../prompt";
import type {
  CategorizableTxn,
  CategoryAllowlistEntry,
  FewShotExample,
} from "../types";

const cat = (
  id: string,
  name: string,
  groupName: string
): CategoryAllowlistEntry => ({ id, name, groupName });

const txn = (o: Partial<CategorizableTxn> = {}): CategorizableTxn => ({
  id: "tx-1",
  date: "2026-04-25",
  amount: -3500,
  payeeName: "Trader Joe's",
  memo: null,
  isSplit: false,
  ...o,
});

const fs = (o: Partial<FewShotExample> = {}): FewShotExample => ({
  payee: "Trader Joe's",
  amount: -3500,
  category: "Groceries",
  group: "Everyday",
  ...o,
});

describe("buildPrompt", () => {
  it("produces byte-identical output for identical input", () => {
    const input = {
      categories: [cat("c1", "Groceries", "Everyday"), cat("c2", "Gas", "Auto")],
      fewShots: [fs()],
      batch: [txn()],
    };
    const a = buildPrompt(input);
    const b = buildPrompt(input);
    expect(a.prompt).toBe(b.prompt);
    expect(a.hash).toBe(b.hash);
    expect(a.system).toBe(b.system);
  });

  it("sorts categories by group then name regardless of input order", () => {
    const a = buildPrompt({
      categories: [cat("c2", "Gas", "Auto"), cat("c1", "Groceries", "Everyday")],
      fewShots: [],
      batch: [txn()],
    });
    const b = buildPrompt({
      categories: [cat("c1", "Groceries", "Everyday"), cat("c2", "Gas", "Auto")],
      fewShots: [],
      batch: [txn()],
    });
    expect(a.hash).toBe(b.hash);
  });

  it("dedupes few-shots by lowercased payee and caps at FEW_SHOT_CAP", () => {
    const dupes = Array.from({ length: 50 }, (_, i) =>
      fs({ payee: i % 2 === 0 ? "trader joe's" : `Other ${i}` })
    );
    const out = __TESTING__.pickFewShots(dupes);
    expect(out.length).toBeLessThanOrEqual(__TESTING__.FEW_SHOT_CAP);
    const lowered = out.map((s) => s.payee.toLowerCase());
    expect(new Set(lowered).size).toBe(lowered.length);
  });

  it("includes split-aware language when batch has a split", () => {
    const built = buildPrompt({
      categories: [cat("c1", "Groceries", "Everyday")],
      fewShots: [],
      batch: [
        txn({
          isSplit: true,
          subtransactions: [
            { id: "s1", amount: -2000, memo: null },
            { id: "s2", amount: -1500, memo: null },
          ],
        }),
      ],
    });
    expect(built.prompt).toContain("isSplit: true");
    expect(built.prompt).toContain("subtransactions:");
    expect(built.prompt).toContain("id=s1");
  });

  it("hash changes when batch changes", () => {
    const base = {
      categories: [cat("c1", "Groceries", "Everyday")],
      fewShots: [fs()],
    };
    const a = buildPrompt({ ...base, batch: [txn()] });
    const b = buildPrompt({ ...base, batch: [txn({ id: "tx-2" })] });
    expect(a.hash).not.toBe(b.hash);
  });
});
