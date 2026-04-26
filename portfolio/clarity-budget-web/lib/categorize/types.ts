/** Shape returned by the LLM for a single transaction. */
export type Suggestion = {
  ynabTxnId: string;
  categoryId: string | null;
  categoryName: string | null;
  confidence: number;
  reasoning: string;
  /** Populated only for split parents; one entry per existing subtransaction. */
  subtransactions?: Array<{
    id?: string;
    amount: number;
    categoryId: string | null;
    categoryName: string | null;
  }>;
};

/** Result row written to clarity_budget_categorization_suggestions. */
export type SuggestionStatus =
  | "pending"
  | "auto_applied"
  | "user_applied"
  | "dismissed"
  | "invalid";

/** Allowlist entry. */
export type CategoryAllowlistEntry = {
  id: string;
  name: string;
  groupName: string;
};

/** Few-shot example built from the user's already-categorized history. */
export type FewShotExample = {
  payee: string;
  amount: number; // milliunits, signed
  category: string;
  group: string;
};

/** Compact transaction view sent to the LLM. */
export type CategorizableTxn = {
  id: string;
  date: string;
  amount: number; // milliunits, signed
  payeeName: string | null;
  memo: string | null;
  isSplit: boolean;
  subtransactions?: Array<{
    id: string;
    amount: number;
    memo: string | null;
  }>;
};

/** Outcome summary returned by `runCategorization`. */
export type RunSummary = {
  fetched: number;
  cached: number;
  suggested: number;
  autoApplied: number;
  queued: number;
  invalid: number;
  modelId: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
};

export const CONFIDENCE_THRESHOLD = 0.85 as const;
