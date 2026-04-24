import { describe, it, expect } from "vitest";
import { detectWeirdness } from "../detect-weirdness";
import type { PrivacyRow, YnabRow } from "../match";

const priv = (o: Partial<PrivacyRow> = {}): PrivacyRow => ({
  token: "priv-1",
  amount_cents: 1000,
  created: "2026-04-15T12:00:00Z",
  status: "SETTLED",
  settled: "2026-04-01T00:00:00Z", // well over 48h ago
  ...o,
});

const ynab = (o: Partial<YnabRow> = {}): YnabRow => ({
  id: "ynab-1",
  amount: -10000,
  date: "2026-04-15",
  payee_name: "Regular Store",
  account_id: "acct-1",
  cleared: "cleared",
  ...o,
});

describe("detectWeirdness", () => {
  describe("duplicate_txn", () => {
    it("flags two cleared txns with same account, amount, and dates ≤1 day apart", () => {
      const flags = detectWeirdness(
        [ynab({ id: "a", date: "2026-04-15" }), ynab({ id: "b", date: "2026-04-15" })],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "duplicate_txn")).toHaveLength(1);
    });

    it("does not flag duplicates on different accounts", () => {
      const flags = detectWeirdness(
        [ynab({ id: "a", account_id: "acct-1" }), ynab({ id: "b", account_id: "acct-2" })],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "duplicate_txn")).toHaveLength(0);
    });

    it("does not flag txns more than 1 day apart", () => {
      const flags = detectWeirdness(
        [ynab({ id: "a", date: "2026-04-15" }), ynab({ id: "b", date: "2026-04-17" })],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "duplicate_txn")).toHaveLength(0);
    });

    it("does not flag uncleared txns", () => {
      const flags = detectWeirdness(
        [
          ynab({ id: "a", cleared: "uncleared" }),
          ynab({ id: "b", cleared: "uncleared" }),
        ],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "duplicate_txn")).toHaveLength(0);
    });
  });

  describe("orphan_privacy_charge", () => {
    it("flags a settled charge with no match after 48h", () => {
      const flags = detectWeirdness([], [priv()], new Map());
      expect(flags.filter((f) => f.type === "orphan_privacy_charge")).toHaveLength(1);
    });

    it("does not flag when matched", () => {
      const flags = detectWeirdness([], [priv()], new Map([["priv-1", "ynab-1"]]));
      expect(flags.filter((f) => f.type === "orphan_privacy_charge")).toHaveLength(0);
    });

    it("does not flag when settled < 48h ago", () => {
      const recent = new Date(Date.now() - 3_600_000).toISOString();
      const flags = detectWeirdness([], [priv({ settled: recent })], new Map());
      expect(flags.filter((f) => f.type === "orphan_privacy_charge")).toHaveLength(0);
    });

    it("does not flag non-SETTLED status", () => {
      const flags = detectWeirdness([], [priv({ status: "PENDING" })], new Map());
      expect(flags.filter((f) => f.type === "orphan_privacy_charge")).toHaveLength(0);
    });
  });

  describe("orphan_ynab_privacy_payee", () => {
    it("flags unmatched YNAB txn with Privacy in payee", () => {
      const flags = detectWeirdness(
        [ynab({ id: "ynab-1", payee_name: "Privacy.com" })],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "orphan_ynab_privacy_payee")).toHaveLength(1);
    });

    it("does not flag when matched", () => {
      const flags = detectWeirdness(
        [ynab({ id: "ynab-1", payee_name: "Privacy.com" })],
        [],
        new Map([["priv-1", "ynab-1"]])
      );
      expect(flags.filter((f) => f.type === "orphan_ynab_privacy_payee")).toHaveLength(0);
    });

    it("does not flag non-Privacy payees", () => {
      const flags = detectWeirdness(
        [ynab({ id: "ynab-1", payee_name: "Uber Eats" })],
        [],
        new Map()
      );
      expect(flags.filter((f) => f.type === "orphan_ynab_privacy_payee")).toHaveLength(0);
    });
  });

  it("fingerprint is stable across runs", () => {
    const txns = [ynab({ id: "a" }), ynab({ id: "b" })];
    const [r1] = detectWeirdness(txns, [], new Map()).filter((f) => f.type === "duplicate_txn");
    const [r2] = detectWeirdness(txns, [], new Map()).filter((f) => f.type === "duplicate_txn");
    expect(r1.fingerprint).toBe(r2.fingerprint);
  });
});
