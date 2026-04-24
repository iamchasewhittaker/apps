import type { YnabRow } from "./match";

export type CardInfo = {
  token: string;
  memo: string | null;
  linked_payee_id: string | null;
};

export type ProposalInput = {
  ynab_txn_id: string;
  privacy_txn_token: string;
  current_payee_name: string;
  proposed_payee_name: string;
  proposed_payee_id: string | null;
  confidence: number;
  reason: string;
};

function looksLikePrivacyPayee(name: string | null): boolean {
  return /privacy/i.test(name ?? "");
}

export function buildProposals(
  matches: Map<string, string>,
  ynabById: Map<string, YnabRow>,
  privacyTxnByToken: Map<string, { card_token: string | null }>,
  cardByToken: Map<string, CardInfo>,
  existingProposalYnabIds: Set<string>
): ProposalInput[] {
  const proposals: ProposalInput[] = [];

  for (const [privToken, ynabId] of matches) {
    if (existingProposalYnabIds.has(ynabId)) continue;

    const ynabTxn = ynabById.get(ynabId);
    if (!ynabTxn) continue;
    if (!looksLikePrivacyPayee(ynabTxn.payee_name)) continue;

    const cardToken = privacyTxnByToken.get(privToken)?.card_token;
    const card = cardToken ? cardByToken.get(cardToken) : undefined;
    const proposedName = card?.memo ?? null;

    if (!proposedName) continue;

    proposals.push({
      ynab_txn_id: ynabId,
      privacy_txn_token: privToken,
      current_payee_name: ynabTxn.payee_name ?? "",
      proposed_payee_name: proposedName,
      proposed_payee_id: card?.linked_payee_id ?? null,
      confidence: card?.linked_payee_id ? 0.9 : 0.7,
      reason: card?.linked_payee_id
        ? "Card linked to YNAB payee"
        : "Card memo used as payee name",
    });
  }

  return proposals;
}
