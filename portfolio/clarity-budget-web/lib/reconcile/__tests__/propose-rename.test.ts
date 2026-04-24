import { describe, it, expect } from "vitest";
import { buildProposals, type CardInfo } from "../propose-rename";
import type { YnabRow } from "../match";

const makeYnabById = (rows: Partial<YnabRow>[]): Map<string, YnabRow> =>
  new Map(
    rows.map((r) => {
      const row: YnabRow = {
        id: "ynab-1",
        amount: -10000,
        date: "2026-04-15",
        payee_name: "Privacy.com",
        account_id: "acct-1",
        cleared: "cleared",
        ...r,
      };
      return [row.id, row];
    })
  );

const card: CardInfo = {
  token: "card-1",
  memo: "Uber Eats",
  linked_payee_id: "payee-uber-eats",
};

describe("buildProposals", () => {
  it("proposes rename when YNAB payee contains Privacy", () => {
    const proposals = buildProposals(
      new Map([["priv-1", "ynab-1"]]),
      makeYnabById([{ id: "ynab-1", payee_name: "Privacy.com" }]),
      new Map([["priv-1", { card_token: "card-1" }]]),
      new Map([["card-1", card]]),
      new Set()
    );
    expect(proposals).toHaveLength(1);
    expect(proposals[0].proposed_payee_name).toBe("Uber Eats");
    expect(proposals[0].proposed_payee_id).toBe("payee-uber-eats");
    expect(proposals[0].confidence).toBe(0.9);
  });

  it("skips when YNAB payee does not look like Privacy", () => {
    const proposals = buildProposals(
      new Map([["priv-1", "ynab-1"]]),
      makeYnabById([{ id: "ynab-1", payee_name: "Uber Eats" }]),
      new Map([["priv-1", { card_token: "card-1" }]]),
      new Map([["card-1", card]]),
      new Set()
    );
    expect(proposals).toHaveLength(0);
  });

  it("skips when ynab txn already has a proposal", () => {
    const proposals = buildProposals(
      new Map([["priv-1", "ynab-1"]]),
      makeYnabById([{ id: "ynab-1", payee_name: "Privacy.com" }]),
      new Map([["priv-1", { card_token: "card-1" }]]),
      new Map([["card-1", card]]),
      new Set(["ynab-1"])
    );
    expect(proposals).toHaveLength(0);
  });

  it("skips when card has no memo", () => {
    const noMemo: CardInfo = { token: "card-1", memo: null, linked_payee_id: null };
    const proposals = buildProposals(
      new Map([["priv-1", "ynab-1"]]),
      makeYnabById([{ id: "ynab-1", payee_name: "Privacy.com" }]),
      new Map([["priv-1", { card_token: "card-1" }]]),
      new Map([["card-1", noMemo]]),
      new Set()
    );
    expect(proposals).toHaveLength(0);
  });

  it("uses memo as name with 0.7 confidence when no linked_payee_id", () => {
    const memoOnly: CardInfo = { token: "card-1", memo: "Netflix", linked_payee_id: null };
    const proposals = buildProposals(
      new Map([["priv-1", "ynab-1"]]),
      makeYnabById([{ id: "ynab-1", payee_name: "Privacy.com" }]),
      new Map([["priv-1", { card_token: "card-1" }]]),
      new Map([["card-1", memoOnly]]),
      new Set()
    );
    expect(proposals).toHaveLength(1);
    expect(proposals[0].proposed_payee_id).toBeNull();
    expect(proposals[0].confidence).toBe(0.7);
  });
});
