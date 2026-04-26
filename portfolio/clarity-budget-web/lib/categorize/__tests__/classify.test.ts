import { describe, it, expect } from "vitest";
import {
  buildAllowlist,
  buildFewShots,
  buildPatchBody,
  classifySuggestion,
  toCategorizable,
} from "../logic";
import { CONFIDENCE_THRESHOLD } from "../types";
import type { CategorizableTxn, Suggestion } from "../types";
import type { SuggestionRow } from "../persist";
import type { YNABTransaction } from "@/lib/ynab";

const baseTxn = (o: Partial<CategorizableTxn> = {}): CategorizableTxn => ({
  id: "tx-1",
  date: "2026-04-25",
  amount: -2500,
  payeeName: "Costco",
  memo: null,
  isSplit: false,
  ...o,
});

const baseSug = (o: Partial<Suggestion> = {}): Suggestion => ({
  ynabTxnId: "tx-1",
  categoryId: "c1",
  categoryName: "Groceries",
  confidence: 0.95,
  reasoning: "payee matches Costco history",
  ...o,
});

describe("classifySuggestion", () => {
  const allowed = new Set(["c1", "c2"]);

  it("auto-applies when confidence >= threshold and id is allowed", () => {
    const out = classifySuggestion({
      suggestion: baseSug(),
      txn: baseTxn(),
      allowedIds: allowed,
    });
    expect(out.status).toBe("auto_applied");
    expect(out.suggestion.categoryId).toBe("c1");
  });

  it("queues as pending when confidence < threshold", () => {
    const out = classifySuggestion({
      suggestion: baseSug({ confidence: CONFIDENCE_THRESHOLD - 0.01 }),
      txn: baseTxn(),
      allowedIds: allowed,
    });
    expect(out.status).toBe("pending");
  });

  it("marks invalid when category_id is not in allowlist", () => {
    const out = classifySuggestion({
      suggestion: baseSug({ categoryId: "hallucinated" }),
      txn: baseTxn(),
      allowedIds: allowed,
    });
    expect(out.status).toBe("invalid");
    expect(out.suggestion.categoryId).toBeNull();
    expect(out.suggestion.categoryName).toBeNull();
  });

  it("queues with null id (no auto-apply, not invalid)", () => {
    const out = classifySuggestion({
      suggestion: baseSug({ categoryId: null, confidence: 0.6 }),
      txn: baseTxn(),
      allowedIds: allowed,
    });
    expect(out.status).toBe("pending");
  });

  it("split parent queues even when subs are confident", () => {
    const txn = baseTxn({
      isSplit: true,
      subtransactions: [
        { id: "s1", amount: -1000, memo: null },
        { id: "s2", amount: -1500, memo: null },
      ],
    });
    const sug = baseSug({
      categoryId: null,
      categoryName: null,
      subtransactions: [
        { id: "s1", amount: -1000, categoryId: "c1", categoryName: "Groceries" },
        { id: "s2", amount: -1500, categoryId: "c2", categoryName: "Gas" },
      ],
    });
    const out = classifySuggestion({
      suggestion: sug,
      txn,
      allowedIds: allowed,
    });
    // Splits with all-high confidence flow to auto_applied; below threshold → pending.
    expect(out.status).toBe("auto_applied");
  });

  it("split with hallucinated sub category is invalid", () => {
    const txn = baseTxn({
      isSplit: true,
      subtransactions: [{ id: "s1", amount: -1000, memo: null }],
    });
    const sug = baseSug({
      subtransactions: [
        { id: "s1", amount: -1000, categoryId: "hallucinated", categoryName: "?" },
      ],
    });
    const out = classifySuggestion({
      suggestion: sug,
      txn,
      allowedIds: allowed,
    });
    expect(out.status).toBe("invalid");
  });

  it("split with mismatched sub count is invalid", () => {
    const txn = baseTxn({
      isSplit: true,
      subtransactions: [
        { id: "s1", amount: -1000, memo: null },
        { id: "s2", amount: -1500, memo: null },
      ],
    });
    const sug = baseSug({
      subtransactions: [
        { id: "s1", amount: -1000, categoryId: "c1", categoryName: "Groceries" },
      ],
    });
    const out = classifySuggestion({
      suggestion: sug,
      txn,
      allowedIds: allowed,
    });
    expect(out.status).toBe("invalid");
  });
});

describe("buildAllowlist", () => {
  it("excludes hidden groups, hidden categories, and deleted categories", () => {
    const groups = [
      {
        name: "Visible",
        hidden: false,
        categories: [
          { id: "c1", name: "OK", hidden: false, deleted: false },
          { id: "c2", name: "Hidden", hidden: true, deleted: false },
          { id: "c3", name: "Deleted", hidden: false, deleted: true },
        ],
      },
      {
        name: "Hidden Group",
        hidden: true,
        categories: [{ id: "c4", name: "Inside", hidden: false, deleted: false }],
      },
    ];
    const out = buildAllowlist(groups);
    expect(out.list.map((c) => c.id)).toEqual(["c1"]);
    expect(out.ids.has("c1")).toBe(true);
    expect(out.ids.has("c2")).toBe(false);
    expect(out.ids.has("c4")).toBe(false);
  });
});

describe("buildFewShots", () => {
  const ynab = (o: Partial<YNABTransaction> = {}): YNABTransaction => ({
    id: "tx-1",
    date: "2026-04-15",
    amount: -3500,
    memo: null,
    cleared: "cleared",
    approved: true,
    deleted: false,
    payee_id: null,
    payee_name: "Costco",
    category_id: "c1",
    category_name: "Groceries",
    account_id: "a1",
    account_name: "Checking",
    subtransactions: [],
    ...o,
  });

  it("expands splits into per-sub examples", () => {
    const out = buildFewShots([
      ynab({
        category_name: "Split",
        subtransactions: [
          {
            id: "s1",
            amount: -1000,
            memo: null,
            deleted: false,
            category_id: "c2",
            category_name: "Gas",
          },
          {
            id: "s2",
            amount: -2500,
            memo: null,
            deleted: false,
            category_id: "c1",
            category_name: "Groceries",
          },
        ],
      }),
    ]);
    expect(out.length).toBe(2);
    expect(out.map((s) => s.category)).toContain("Gas");
    expect(out.map((s) => s.category)).toContain("Groceries");
  });

  it("skips uncategorized history rows", () => {
    const out = buildFewShots([
      ynab({ category_name: null }),
      ynab({ category_name: "Split", subtransactions: [] }),
    ]);
    expect(out.length).toBe(0);
  });
});

describe("toCategorizable", () => {
  const ynab = (o: Partial<YNABTransaction> = {}): YNABTransaction => ({
    id: "tx-1",
    date: "2026-04-15",
    amount: -3500,
    memo: "note",
    cleared: "cleared",
    approved: false,
    deleted: false,
    payee_id: null,
    payee_name: "Costco",
    category_id: null,
    category_name: null,
    account_id: "a1",
    account_name: "Checking",
    subtransactions: [],
    ...o,
  });

  it("flattens non-split", () => {
    const c = toCategorizable(ynab());
    expect(c.isSplit).toBe(false);
    expect(c.subtransactions).toBeUndefined();
  });

  it("flattens split with subs", () => {
    const c = toCategorizable(
      ynab({
        category_name: "Split",
        subtransactions: [
          {
            id: "s1",
            amount: -1000,
            memo: null,
            deleted: false,
            category_id: null,
            category_name: null,
          },
          {
            id: "s2",
            amount: -2500,
            memo: null,
            deleted: false,
            category_id: null,
            category_name: null,
          },
        ],
      })
    );
    expect(c.isSplit).toBe(true);
    expect(c.subtransactions?.length).toBe(2);
    expect(c.subtransactions?.[0].id).toBe("s1");
  });
});

describe("buildPatchBody", () => {
  const row = (o: Partial<SuggestionRow> = {}): SuggestionRow => ({
    user_id: "u",
    ynab_txn_id: "tx-1",
    status: "auto_applied",
    category_id: "c1",
    category_name: "Groceries",
    confidence: 0.9,
    reasoning: "x",
    model_id: "openai/gpt-4o-mini",
    prompt_hash: "abc",
    subtransactions: null,
    txn_snapshot: {
      date: "2026-04-25",
      amount: -2500,
      payee_name: "Costco",
      memo: null,
      is_split: false,
    },
    ...o,
  });

  it("builds top-level category PATCH for non-splits", () => {
    const txn = baseTxn();
    const sug = baseSug();
    const body = buildPatchBody({
      rows: [row()],
      txnsById: new Map([[txn.id, txn]]),
      suggestionsByTxnId: new Map([[txn.id, sug]]),
    });
    expect(body.length).toBe(1);
    expect(body[0]).toEqual({
      id: "tx-1",
      category_id: "c1",
      approved: true,
    });
  });

  it("builds subtransactions[] PATCH for splits and preserves orig amounts", () => {
    const txn = baseTxn({
      isSplit: true,
      subtransactions: [
        { id: "s1", amount: -1000, memo: null },
        { id: "s2", amount: -1500, memo: null },
      ],
    });
    const sug = baseSug({
      categoryId: null,
      subtransactions: [
        { id: "s1", amount: -1000, categoryId: "c1", categoryName: "Groceries" },
        { id: "s2", amount: -1500, categoryId: "c2", categoryName: "Gas" },
      ],
    });
    const r = row({
      category_id: null,
      txn_snapshot: { ...row().txn_snapshot, is_split: true },
    });
    const body = buildPatchBody({
      rows: [r],
      txnsById: new Map([[txn.id, txn]]),
      suggestionsByTxnId: new Map([[txn.id, sug]]),
    });
    expect(body.length).toBe(1);
    expect(body[0].id).toBe("tx-1");
    expect(body[0].approved).toBe(true);
    expect(body[0].category_id).toBeUndefined();
    expect(body[0].subtransactions?.length).toBe(2);
    // Sum of sub amounts equals parent amount.
    const sum =
      (body[0].subtransactions ?? []).reduce((a, s) => a + s.amount, 0);
    expect(sum).toBe(-2500);
    // First sub keeps its original id.
    expect(body[0].subtransactions?.[0].id).toBe("s1");
    expect(body[0].subtransactions?.[0].category_id).toBe("c1");
  });

  it("skips non-auto_applied rows", () => {
    const body = buildPatchBody({
      rows: [row({ status: "pending" }), row({ status: "invalid" })],
      txnsById: new Map([[baseTxn().id, baseTxn()]]),
      suggestionsByTxnId: new Map([[baseTxn().id, baseSug()]]),
    });
    expect(body.length).toBe(0);
  });
});
