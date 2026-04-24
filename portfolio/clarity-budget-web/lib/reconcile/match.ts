export type PrivacyRow = {
  token: string;
  amount_cents: number;
  created: string;       // ISO timestamp
  status: string;
  settled: string | null;
};

export type YnabRow = {
  id: string;
  amount: number;        // milliunits, negative = outflow
  date: string;          // YYYY-MM-DD
  payee_name: string | null;
  account_id: string;
  cleared: "cleared" | "uncleared" | "reconciled";
};

const MS_PER_DAY = 86_400_000;

function privacyDateStr(created: string): string {
  return new Date(created).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round(Math.abs(da - db) / MS_PER_DAY);
}

export function matchPrivacyToYnab(
  privacyTxns: PrivacyRow[],
  ynabTxns: YnabRow[]
): Map<string, string> {
  const usedYnabIds = new Set<string>();
  const result = new Map<string, string>();

  const outflows = ynabTxns.filter((t) => t.amount < 0);

  for (const priv of privacyTxns) {
    const privDate = privacyDateStr(priv.created);
    const targetMilliunits = priv.amount_cents * 10;

    const candidates = outflows.filter(
      (y) =>
        !usedYnabIds.has(y.id) &&
        -y.amount === targetMilliunits &&
        daysBetween(privDate, y.date) <= 3
    );

    if (candidates.length === 0) continue;

    candidates.sort((a, b) => {
      const diffA = daysBetween(privDate, a.date);
      const diffB = daysBetween(privDate, b.date);
      if (diffA !== diffB) return diffA - diffB;
      const aPrivacy = /privacy/i.test(a.payee_name ?? "");
      const bPrivacy = /privacy/i.test(b.payee_name ?? "");
      if (aPrivacy !== bPrivacy) return aPrivacy ? -1 : 1;
      return 0;
    });

    const best = candidates[0];
    result.set(priv.token, best.id);
    usedYnabIds.add(best.id);
  }

  return result;
}
