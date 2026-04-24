import { describe, it, expect } from "vitest";
import { matchPrivacyToYnab, type PrivacyRow, type YnabRow } from "../match";

const priv = (o: Partial<PrivacyRow> = {}): PrivacyRow => ({
  token: "priv-1",
  amount_cents: 1000,
  created: "2026-04-15T12:00:00Z",
  status: "SETTLED",
  settled: "2026-04-16T00:00:00Z",
  ...o,
});

const ynab = (o: Partial<YnabRow> = {}): YnabRow => ({
  id: "ynab-1",
  amount: -10000,
  date: "2026-04-15",
  payee_name: "Privacy.com",
  account_id: "acct-1",
  cleared: "cleared",
  ...o,
});

describe("matchPrivacyToYnab", () => {
  it("matches exact amount and same date", () => {
    expect(matchPrivacyToYnab([priv()], [ynab()]).get("priv-1")).toBe("ynab-1");
  });

  it("matches within 3 days", () => {
    expect(
      matchPrivacyToYnab([priv()], [ynab({ date: "2026-04-18" })]).get("priv-1")
    ).toBe("ynab-1");
  });

  it("does not match 4 days apart", () => {
    expect(
      matchPrivacyToYnab([priv()], [ynab({ date: "2026-04-19" })]).size
    ).toBe(0);
  });

  it("does not match when amounts differ", () => {
    expect(
      matchPrivacyToYnab([priv({ amount_cents: 999 })], [ynab()]).size
    ).toBe(0);
  });

  it("does not match YNAB inflows", () => {
    expect(
      matchPrivacyToYnab([priv()], [ynab({ amount: 10000 })]).size
    ).toBe(0);
  });

  it("prefers same-day match over later date", () => {
    const result = matchPrivacyToYnab(
      [priv()],
      [
        ynab({ id: "ynab-far", date: "2026-04-17", payee_name: "Privacy.com" }),
        ynab({ id: "ynab-same", date: "2026-04-15", payee_name: "Privacy.com" }),
      ]
    );
    expect(result.get("priv-1")).toBe("ynab-same");
  });

  it("prefers Privacy-named payee when dates are equal distance", () => {
    const result = matchPrivacyToYnab(
      [priv()],
      [
        ynab({ id: "ynab-other", payee_name: "Uber Eats" }),
        ynab({ id: "ynab-priv", payee_name: "Privacy.com" }),
      ]
    );
    expect(result.get("priv-1")).toBe("ynab-priv");
  });

  it("matches each YNAB txn at most once", () => {
    const result = matchPrivacyToYnab(
      [priv({ token: "priv-1" }), priv({ token: "priv-2" })],
      [ynab({ id: "ynab-1" })]
    );
    expect(result.size).toBe(1);
  });
});
