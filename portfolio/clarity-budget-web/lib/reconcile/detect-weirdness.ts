import { fingerprint } from "./fingerprint";
import type { PrivacyRow, YnabRow } from "./match";

export type WeirdnessType =
  | "duplicate_txn"
  | "orphan_privacy_charge"
  | "orphan_ynab_privacy_payee";

export type WeirdnessFlag = {
  type: WeirdnessType;
  severity: "high" | "medium" | "low";
  related_ids: string[];
  details: Record<string, unknown>;
  fingerprint: string;
};

const MS_PER_DAY = 86_400_000;

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round(Math.abs(da - db) / MS_PER_DAY);
}

function isSettledOver48h(settled: string | null): boolean {
  if (!settled) return false;
  return Date.now() - new Date(settled).getTime() > 48 * 3_600_000;
}

export function detectWeirdness(
  ynabTxns: YnabRow[],
  privacyTxns: PrivacyRow[],
  matches: Map<string, string>
): WeirdnessFlag[] {
  const flags: WeirdnessFlag[] = [];
  const matchedYnabIds = new Set(matches.values());

  // duplicate_txn — two cleared YNAB txns, same account + amount, dates ≤1 day apart
  const cleared = ynabTxns.filter((t) => t.cleared !== "uncleared");
  for (let i = 0; i < cleared.length; i++) {
    for (let j = i + 1; j < cleared.length; j++) {
      const a = cleared[i];
      const b = cleared[j];
      if (
        a.account_id === b.account_id &&
        a.amount === b.amount &&
        daysBetween(a.date, b.date) <= 1
      ) {
        flags.push({
          type: "duplicate_txn",
          severity: "high",
          related_ids: [a.id, b.id].sort(),
          details: { amount: a.amount, date_a: a.date, date_b: b.date },
          fingerprint: fingerprint([a.id, b.id]),
        });
      }
    }
  }

  // orphan_privacy_charge — settled > 48h ago, no matched YNAB txn
  for (const priv of privacyTxns) {
    if (
      priv.status === "SETTLED" &&
      isSettledOver48h(priv.settled) &&
      !matches.has(priv.token)
    ) {
      flags.push({
        type: "orphan_privacy_charge",
        severity: "medium",
        related_ids: [priv.token],
        details: { amount_cents: priv.amount_cents, settled: priv.settled },
        fingerprint: fingerprint([priv.token]),
      });
    }
  }

  // orphan_ynab_privacy_payee — YNAB txn with "Privacy" in payee, not matched
  for (const txn of ynabTxns) {
    if (
      /privacy/i.test(txn.payee_name ?? "") &&
      !matchedYnabIds.has(txn.id)
    ) {
      flags.push({
        type: "orphan_ynab_privacy_payee",
        severity: "low",
        related_ids: [txn.id],
        details: { payee_name: txn.payee_name, date: txn.date },
        fingerprint: fingerprint([txn.id]),
      });
    }
  }

  return flags;
}
