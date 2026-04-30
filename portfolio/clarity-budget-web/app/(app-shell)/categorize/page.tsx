import { createRouteClient } from "@/lib/supabase-server";
import { CategorizeQueue } from "@/components/categorize/CategorizeQueue";
import { PageHeader } from "@/components/shell/PageHeader";
import type { Suggestion } from "@/lib/categorize/types";

export const dynamic = "force-dynamic";

type SuggestionRow = {
  id: string;
  ynab_txn_id: string;
  status: string;
  category_id: string | null;
  category_name: string | null;
  confidence: number;
  reasoning: string;
  model_id: string;
  subtransactions: Suggestion["subtransactions"] | null;
  txn_snapshot: {
    date: string;
    amount: number;
    payee_name: string | null;
    memo: string | null;
    is_split: boolean;
  };
  created_at: string;
};

type SyncStateRow = {
  last_run_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
};

export default async function CategorizePage() {
  const supabase = await createRouteClient();

  const [{ data: pending }, { data: syncState }] = await Promise.all([
    supabase
      .from("clarity_budget_categorization_suggestions")
      .select(
        "id, ynab_txn_id, status, category_id, category_name, confidence, reasoning, model_id, subtransactions, txn_snapshot, created_at"
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("clarity_budget_sync_state")
      .select("last_run_at, last_success_at, last_error")
      .eq("source", "ynab_categorize")
      .maybeSingle<SyncStateRow>(),
  ]);

  return (
    <div className="max-w-[880px] mx-auto">
      <PageHeader title="Categorize" subtitle="AI SUGGESTIONS · YNAB" />
      <CategorizeQueue
        rows={(pending ?? []) as SuggestionRow[]}
        syncState={syncState ?? null}
      />
    </div>
  );
}
